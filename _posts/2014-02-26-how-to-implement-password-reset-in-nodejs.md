---
layout: post
categories: tutorials
title: How To Implement Password Reset In Node.js
excerpt: "In this tutorial, we'll go over how to create a forgot your password feature using Express, MongoDB, Passport and Nodemailer. We will build a complete application from scratch. This guide assumes as little possible, and thus covers some basic stuff along the way."
gradient: 1
image: blog/password-reset-cover.jpg
---

**May 25, 2014:** Updated tutorial for Express 4.x.

---

To see password reset in action, check
out this [Live Demo](http://hackathonstarter.herokuapp.com/) from the
[Hackathon Starter](http://github.com/sahat/hackathon-starter) project.

Let's begin by installing the Express application generator. That will allow
us to create a new Express project skeleton from the command line.

```bash
sudo npm install -g express-generator
```

**Note:** Do not use `sudo` if you are on Windows.

To create a new Express project run the following command:

```bash
express myapp
```

<img src="/images/blog/password-reset-1.png">

Next, install NPM dependencies:

```bash
cd myapp && npm install
```

Before proceeding any further, let's cleanup this project from all 
that garbage created by the Express generator. 

Delete **bin** and **routes** folders, as well as **views/error.jade** template.
Then replace **app.js** with the following contents:

```js
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// Middleware
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
```

If you run the app now, you should see the following *"Welcome to Express"* page.

![](/images/blog/password-reset-1.5.png)

We will be using [Nodemailer](https://github.com/andris9/Nodemailer) for sending password reset emails,
[Mongoose](http://mongoosejs.com) for interacting with MongoDB and
[Passport](http://passportjs.com/) for user authentication.
Additionally we will need [bcrypt-nodejs](https://www.npmjs.org/package/bcrypt-nodejs)
for hashing user passwords and
[async](https://github.com/caolan/async) library to avoid dealing with nested 
callbacks by using with the help of `async.waterfall` method. Also, 
as of Express 4.0+ you have to install [session](https://github.com/expressjs/session)
middleware separately.

To install these modules run the following command:

```bash
npm install --save async express-session mongoose nodemailer passport passport-local bcrypt-nodejs
```

**Note:** By passing `--save` flag, those packages will be automatically added
to `package.json`. I can't recall how many times I have installed packages
locally, but then forgot to add them to `package.json`.

Next, add these modules at the top of `app.js`:

```js
var session = require('express-session')
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
```

**Note:** We didn't have to install `crypto` library as it is part of Node.js.
We will be using it for generating random token during a password reset.

Add the session middleware right after `app.use(cookieParser())`:

```js
app.use(session({ secret: 'session secret key' }));
```

From here on, we will be working entirely inside `app.js`, while  ocassionally
switching to templates. I am only doing it for the purposes of this tutorial, in
order to keep things simple. If you are building a mediums-sized application (or
larger), it would be in your best interests to modularize your code.

Since we are using Mongoose to interact with MongoDB, we will first need to create
a `User` model before we can do anything. But even before that, we need to have
a Schema. Let's start by defining the `User` schema. Add this right after the
module dependencies.

```js
var userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});
```

Each schema maps to a MongoDB collection. And each key - username, email,
password, etc., defines a property in our MongoDB documents. For example, this
is how our User document would look in a database:

```js
> db.users.findOne()
{
	"__v" : 0,
	"_id" : ObjectId("530c17c1fb8c96752498e120"),
	"email" : "sahat@me.com",
	"password" : "$2a$05$ANZrgWJqVo9j1tqgCMwe2.LCFnU43bUAYW9rA3Nsx4WchPM.cELEi",
	"username" : "sahat"
}
```

**Note:** Properties `resetPasswordToken` and `resetPassword` are not part of
the above document, because they are set only after password reset is
submitted. And since we haven't specified default values, those properties
will not be set when creating a new user.

Besides specifying a structure of documents, Mongoose schemas also define
[instance methods](http://mongoosejs.com/docs/guide.html#methods)
and [middleware](http://mongoosejs.com/docs/middleware.html). And that's
exactly what we will use next.

It would not be smart to store passwords in plaintext, clearly visible.
If your database is compromised, you (or your users) are pretty much
screwed. To avoid that, we will need to hash user's passwords. And that's where
`bcrypt` comes in. Now, consider a scenario where you have a signup page,
an account management page where users can update their existing password and
a reset password page where users can set a new password. Do you really want
to implement the same password hashing logic in all three places? Instead,
you should use Mongoose middleware to hash a password on `save()`.


```js
userSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});
```

**Note:** This code snippet was taken from a
[passport-local](https://github.com/jaredhanson/passport-local) example.

Next, to perform password verification when user tries to sign-in,
we will use the following Mongoose instance method:

```js
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
```

To use our `userSchema`, we need to convert it into a Model we can work with.
Add this line right after the instance method we have just defined:

```js
var User = mongoose.model('User', userSchema);
```

Before we can interact with the database, we must first connect to one.
If you already have MongoDB installed on your machine, and it is up and
running, then simply add this line somewhere in your `app.js`. I typically
place it right before (or after) `var app = express();`.

```js
mongoose.connect('localhost');
```

Or, if you do not have MongoDB installed on your computer, you may
use this demo database that I have created just for this tutorial:

```js
mongoose.connect(mongodb://demo:demo@ds027759.mongolab.com:27759/demo);
```

Now, let's move on to Passport configuration. You need to configure three
pieces to use Passport for authentication:

1. Authentication strategies
2. Application middleware
3. Sessions

To setup a Local strategy (username and password), add the following code
anywhere after the `User` model declaration:

```js
passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  });
}));
```

**Note:** This code snippet is almost identical to the one found on
[Passport | Configure](http://passportjs.org/guide/configure/) page.

Next, we need to add the Passport middleware to our Express configuration. It is
important that you place these two lines after `app.use(session({ secret: 'session secret key' }))`. More often
than not, order matters when it comes to Express middleware.

```js
app.use(passport.initialize());
app.use(passport.session());
```

For example, this is how it would look all together:

```js
// Middleware
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'session secret key' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
```

And lastly, we need to add *serialize* and *deserialize* passport methods.
You can read more about it on
[Passport | Configure](http://passportjs.org/guide/configure/) page, but
essentially it allows you to stay logged-in when navigating between different
pages within your application.

Add this code before or after your *LocalStrategy*:

```js
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
```

At this point your `app.js` should look, more or less, something like this:

```js
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

userSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

mongoose.connect('localhost');

var app = express();

// Middleware
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'session secret key' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
```

We are done with the configuration step, so let's move on to defining
our routes: `/login`, `/logout`, `/signup`. We will add a few
more routes for resetting a password shortly.

Update the `/` route to include `user: req.user` property and add the new
`/login` route:

```js
app.get('/', function(req, res){
  res.render('index', {
    title: 'Express',
    user: req.user
  });
});

app.get('/login', function(req, res) {
  res.render('login', {
    user: req.user
  });
});
```

Our `GET /login` route simply renders a page. When the login operation
completes, `user` will be assigned to `req.user`. To check if user
is signed-in or not, inside templates, we have to pass `{ user: req.user }`
explicitly. For instance, you may want to display **Login** and
**Create Account** links to guests and **Logout** link to authenticated users.

We will come back to that in a moment, but for now let's create a login
template. Inside the **views** folder create `login.jade` with the following
content:

```jade
extends layout

block content
  form(method='POST')
    legend Login
    .form-group
      label(for='username') Username
      input.form-control(type='text', name='username', autofocus)
    .form-group
      label(for='password') Password
      input.form-control(type='password', name='password')
    button.btn.btn-primary(type='submit') Login
    a.btn.btn-link(href='/forgot') Forgot Password?
```

**Note:** If this is your first time working with Jade templates, I 
recommend to take a look at this interactive
[Jade Syntax Documentation](http://naltatis.github.io/jade-syntax-docs/).

Let's switch over to `layout.jade` so we can add jQuery and
Bootstrap libraries. Inside `head` block add these three lines:

```jade
link(rel='stylesheet', href='//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css')
script(src='//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js')
script(src='//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js')
```

And while we are here, let's also add a Navbar in `layout.jade`.
Place this code inside `body` tag, but before `block content`:

```jade
.navbar.navbar-inverse.navbar-static-top(role='navigation')
  .container
    .navbar-header
      button.navbar-toggle(type='button', data-toggle='collapse', data-target='.navbar-collapse')
        span.sr-only Toggle navigation
        span.icon-bar
        span.icon-bar
        span.icon-bar
      a.navbar-brand(href='/') Project name
    .collapse.navbar-collapse
      ul.nav.navbar-nav
        li.active
          a(href='/') Home
        if user
          li
            a(href='/logout') Logout
        else
          li
            a(href='/login') Login
          li
            a(href='/signup') Signup
```

Notice the *if/else* statement. Recall what I said earlier about passing
`{ user: req.user }` to a template. This essentially allows us to display
different content, depending on whether `user` is defined or not.

Also, to make things prettier, let's add some padding to our page content
by wrapping `block content` with `.container` element.

```jade
.container
  block content
```

Here is how your `layout.jade` should look at this point:

```jade
doctype html
html
  head
    title= title
    link(rel='stylesheet', href='//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css')
    script(src='//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js')
    script(src='//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js')
  body
    .navbar.navbar-inverse.navbar-static-top(role='navigation')
      .container
        .navbar-header
          button.navbar-toggle(type='button', data-toggle='collapse', data-target='.navbar-collapse')
            span.sr-only Toggle navigation
            span.icon-bar
            span.icon-bar
            span.icon-bar
          a.navbar-brand(href='/') Project name
        .collapse.navbar-collapse
          ul.nav.navbar-nav
            li.active
              a(href='/') Home
            if user
              li
                a(href='/logout') Logout
            else
              li
                a(href='/login') Login
              li
                a(href='/signup') Signup

    .container
      block content
```

Try visiting the `/login` route. If you are not
using something like [nodemon](https://github.com/remy/nodemon), you will need
to manually restart the node.js server before you see new changes. Looks
better now, doesn't it?

<img src="/images/blog/password-reset-2.png">

If we try to submit a form right now, we will get an error, because we haven't
created `POST /login` route yet. Let's do that next.

Back in `app.js` add the following route:

```js
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err)
    if (!user) {
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
});
```

**Note:** This code snippet was taken from a [passport-local](https://github.com/jaredhanson/passport-local/blob/master/examples/express3-mongoose/app.js#L149)
example.

You now have a fully working login form, except there is no way to test it
since we haven't created any users yet. This would be a right time to create a
signup page.

Add the following route to `app.js`:

```js
app.get('/signup', function(req, res) {
  res.render('signup', {
    user: req.user
  });
});
```

In your **views** folder create `signup.jade` file with the following contents:

```jade
extends layout

block content
  form(method='POST')
    legend Signup
    .form-group
      label(for='username') Username
      input.form-control(type='text', name='username', autofocus)
    .form-group
      label(for='email') Email
      input.form-control(type='text', name='email')
    .form-group
      label(for='password') Password
      input.form-control(type='password', name='password')
    .form-group
      label(for='confirm') Confirm Password
      input.form-control(type='password', name='confirm')
    button.btn.btn-primary(type='submit') Signup
```

**Note:** Confirm Password currently doesn't do anything. In a real-world
scenario you would compare `req.body.confirm` with
`req.body.password` to see if they are equal. Take a look at
[express-validator](https://github.com/ctavan/express-validator) if you are
interested in learning more about data validation.

This is how our `/signup` page would look like, if you followed along the tutorial:

<img src="/images/blog/password-reset-3.png">

Just as with the login form, we will need to create a POST route to handle
the form on the signup page.

```js
app.post('/signup', function(req, res) {
  var user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

  user.save(function(err) {
    req.logIn(user, function(err) {
      res.redirect('/');
    });
  });
});
```

Here we create a new `User` object with the values passed into the form.
On a successful database save, user is immediately logged-in, then redirected
to the home page.

Oh, one last thing, let's add the logout route:

```js
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
```

At this stage you have a basic, but functional application with
**Home**, **Login** and **Signup** pages. We have everything but the password
reset feature, which was the entire point of this tutorial.

Create a new route in `app.js` and a corresponding template, `forgot.jade`:

```js
app.get('/forgot', function(req, res) {
  res.render('forgot', {
    user: req.user
  });
});
```

```jade
extends layout

block content
  form(method='POST')
    legend Forgot Password
    .form-group
      label(for='email') Email
      input.form-control(type='text', name='email', autofocus)
    button.btn.btn-primary(type='submit') Reset Password
```

Before we proceed any further, let's add flash messages to notify users about
success and error messages. Go ahead and run:

```bash
npm install express-flash --save
```

and then add it to `app.js`:

```js
var flash = require('express-flash');
```

Finally, add the `flash()` function with the rest of your Express middleware.
I have placed it right after `app.use(session({ secret: 'session secret key' }))`, 
although it might still work if you place it elsewhere.

```js
app.use(flash());
```

To display flash messages, inside `layout.jade` let's add the following code to
the `.container` element, right before `block content`:

```jade
.container
  if messages.error
    .alert.alert-danger
      div= messages.error
  if messages.info
    .alert.alert-info
      div= messages.info
  if messages.success
    .alert.alert-success
      div= messages.success
  block content
```


Ok, so far so good. Now, it's going to get slightly more complicated. Add the
following route to handle the form on `/forgot` page:

```js
app.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: '!!! YOUR SENDGRID USERNAME !!!',
          pass: '!!! YOUR SENDGRID PASSWORD !!!'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});
```

Here we are using [async](https://github.com/caolan/async) module to avoid
nesting callbacks within callbacks within callbacks. We start out by randomly
generating a token that looks like this -
*94b422c1f87568a06a198da66fe2ef8cc963641d*. It doesn't mean anything, we only
care that it is somewhat unique, i.e. no two exact password reset tokens at
one time. We then pass that token down the *async.waterfall* to the next
function that looks up a user by the provided e-mail address. If there is
an account with such e-mail address, we set `resetPasswordToken` to that
randomly generated token and set `resetPasswordExpires` 1 hour into the future.
In other words, password reset link will be active only for 1 hour, afterwards
that link becomes invalid.

Next, we send out an e-mail to the user using
[Nodemailer](https://github.com/andris9/Nodemailer) and
[SendGrid](http://sendgrid.com/). If you prefer not to use SendGrid, change
`service` string to any of the following: *Gmail*, *Mailgun*, *iCloud*,
*Hotmail*. For a full list of service providers see
[Nodemailer](https://github.com/andris9/Nodemailer) GitHub repo.

<img src="/images/blog/password-reset-4.png">

You should receive an email that looks something like this:
<img src="/images/blog/password-reset-8.png">

Clicking on that link won't do anything since we have not implemented `/reset`
route yet. Let's do that right now.

```js
app.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user
    });
  });
});
```

It immediately checks if there exists a user with a given password reset
token **and** that token has not expired yet. If user is found, it will display
a page to setup a new password.

And the `reset.jade` template:

```jade
extends layout

block content
  form(method='POST')
    legend Reset Password
    .form-group
      label(for='password') New Password
      input.form-control(type='password', name='password', value='', placeholder='New password', autofocus=true)
    .form-group
      label(for='confirm') Confirm Password
      input.form-control(type='password', name='confirm', value='', placeholder='Confirm password')
    .form-group
      button.btn.btn-primary(type='submit') Update Password
```

This is what you would see in a case of a valid token:

<img src="/images/blog/password-reset-5.png">

And finally, we need to add a POST controller for the `/reset/:token` route. It
is very similar to the `/forgot` route.

```js
app.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: '!!! YOUR SENDGRID USERNAME !!!',
          pass: '!!! YOUR SENDGRID PASSWORD !!!'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});
```

We begin by checking if the password reset token is still valid. It is not
unlikely that a user opens the link from their e-mail and leaves the browser
open for more than one hour (at which point token should no longer be valid).

If the user is found, update his/her password and `$unset` *resetPasswordToken*
and *resetPasswordExpires* fields. User is then immediately signed-in. Right
after that an email is sent to the user notifying about the password change.

<img src="/images/blog/password-reset-7.png">

Upon a successful password reset you would be redirected to the home page with
a success flash message:

<img src="/images/blog/password-reset-6.png">

That's all I have! I hope you enjoyed this tutorial. For questions & comments
send me an email at sahat[at]me[dot]com.
