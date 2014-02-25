---
layout: post

title: Implementing Password Reset in Node.js

---

To see password reset in action, check out this
[live demo](http://hackathonstarter.herokuapp.com/).

In this tutorial, we'll go over how to create "forgot password" feature
using Express, MongoDB, Passport and Nodemailer. We will build a complete
application from scratch. This guide assumes as little possible, and thus
covers some basics along the way.

At the very least I assume you have already installed Node.js. So, let's
begin by installing Express if you don't have that already:

```
sudo npm install -g express
```

**Note:** Do not use `sudo` if you are on Windows.

This installs Express globally, making it available from the command line.
We are going to use that command to create a new project.

To create a new Express project run the following command:

```
express myapp --sessions
```

<img src="/images/blog/password-reset-1.png">

Let's install NPM dependencies:

```
cd myapp && npm install
```

We will be using *Nodemailer* for sending password reset emails,
*Mongoose* for interacting with MongoDB and *Passport* for user authentication.
Additionally we will require *bcrypt-nodejs* to hash user passwords and *async*
library to avoid dealing with nested callbacks by using `async.waterfall`.
To install these packages, run:

```
npm install async mongoose nodemailer passport passport-local bcrypt-nodejs --save
```

**Note:** By passing `--save` flag, those packages will be automatically added
to `package.json`.

Add these five packages at the top of `app.js`:

```
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
```

From here on, we will be working entirely in the `app.js` file.

Since we are using Mongoose, we will first need to create a `User` model
before we can do anything. But even before that, we need to have a Schema.
Let's start by defining the `User` schema. Add this right after module
dependencies.


```
var userSchema = new mongoose.Schema({
  username: { type: String, required, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});
```

Each schema maps to a MongoDB collection. Each key - username, email and
password, defines a property in our MongoDB documents.
Besides specifying a structure of documents, they also define
[instance methods](http://mongoosejs.com/docs/guide.html#methods)
and [middleware](http://mongoosejs.com/docs/middleware.html). And that's
exactly what we will use next.

It would not be wise to store passwords of your users in plaintext. We are
going to use Mongoose `pre('save')` middleware that gets executed before
each `user.save()` call. What this code essentially does is hashes user's
password automatically. Otherwise, without this middleware, you would
need to do this manually in multiple places, e.g. account signup, password
reset, account management.

```
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

**Note:** This code snippet was taken directly from
[passport-local](https://github.com/jaredhanson/passport-local) examples.

Next, in order to perform password verification when user tries to sign-in,
we will use this Mongoose instance method.

```
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
```

To use our `userSchema`, we need to convert it into a Model we can work with.

```
var User = mongoose.model('User', userSchema);
```

But before we can interact with the database, first we must connect to one.
If you already have MongoDB installed on your machine, and it is up and
running, then simply add this line somewhere in your `app.js`. I usually
place it right before or after `var app = express();`.

```
mongoose.connect('localhost');
```

Alternatively, you may use this demo database that I have created just for this
tutorial:

```
mongoose.connect(mongodb://demo:demo@ds027759.mongolab.com:27759/demo);

```

Now, let's move to Passport configuration. Three pieces need to be configured
to use Passport for authentication:

1. Authentication strategies
2. Application middleware
3. Sessions

To setup a local strategy (username and password), add the following code
anywhere after the `User` model declaration:

```
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
important that you place these two lines *after* `express.session()`. Order
matters when it comes to Express middleware.

```
app.use(passport.initialize());
app.use(passport.session());
```

For example, this is how it would look all together:

```
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

```

Finally, we need to add serialize/deserialize functions and then we are all set.
You can read more about it on
[Passport | Configure](http://passportjs.org/guide/configure/) page, but
essentially it allows you to stay signed-in when navigating between different
routes within your application.

Add this before or after your *LocalStrategy*:

```
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
```

At this point your `app.js` should look something like this:

```
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
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
  }
));

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
  password: { type: String, required: true }
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
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

mongoose.connect('localhost');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(expressValidator());
app.use(express.methodOverride());
app.use(flash());
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
```

We are finally done with setting things up, so now we can move on to
defining routes: `/login`, `/logout`, `/signup`. Later we will add a few
more routes for resetting the password.

Remove these two routes:

```
app.get('/', routes.index);
app.get('/users', user.list);
```

And then add the following routes:

```
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

The first route hasn't changed. It is in fact the same as `routes/index.js`,
but I have included it here for the sake of consistency of keeping
everything self-contained inside `app.js`. You may even delete the *routes*
folder and remove `var routes` and `var user` require statements.

Our `GET /login` route simply renders a page. When the login operation
completes, `user` will be assigned to `req.user`. In order to check if user
is signed-in or not, inside templates, we have to pass user: req.user
explicitly. For instance, you may want to display **Login - Create Account**
links to guests and **Logout** link to authenticated users.


We will come back to that in a moment, but for now let's create a login
template. Inside *views* folder create `login.jade` with the following:

```
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

At this point let's switch over to `layout.jade` so we can add jQuery and
Bootstrap libraries. In the `head` block add these three lines:

```
link(rel='stylesheet', href='//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css')
script(src='//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js')
script(src='//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js')
```

And since we are already here, let's also add Bootstrap NavBar in `layout.jade`.
Place this code inside `body` tag, before `block content`:

```
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

Also, to make things nicer, wrap `block content` with `.container` element.
This way your text will not be touching the page edges. Each page, e.g. login,
forgot password, signup will be rendered inside this `block content`.

Notice the *if-else* statement? Recall what I said earlier about passing
user: req.user to a template. This basically allows us to display different
content, depending on whether user is signed-in or not.

```
.container
  block content
```

**Note:** Be careful with the indentation.

Here is how your `layout.jade` should look at this point:

```
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

Try visiting `/login` page and it should look much better now. If you are not
using something like [nodemon](https://github.com/remy/nodemon), you will need
to manually restart the node.js server before you see new changes.

<img src="/images/blog/password-reset-2.png">

If we try to submit a form right now, we will get an error because we haven't
created `POST /login` route yet. Let's do that next.

Back in `app.js` add the following route:

```
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

**Note:** This code snippet was taken directly from [passport-local](https://github.com/jaredhanson/passport-local/blob/master/examples/express3-mongoose/app.js#L149)
example.

You now have a fully working login form, except there is no way to test it
since we haven't created any users yet. This would be a good time to create a
signup page.

Add the following route to `app.js`:

```
app.get('/signup', function(req, res) {
  res.render('signup', {
    user: req.user
  });
});
```

In your *views* folder create `signup.jade` file with the following contents:

```
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

**Note:** Confirm Password currently does not do anything. In a real-world
scenario you would of course compare it with `req.body.password` to see if they
are equal.

This is how `/signup` page would look if you followed along:

<img src="/images/blog/password-reset-3.png">

Just like with the login form, we will need to create a POST route to handle
the form on the signup page.

```
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

Here we create a new `User` object with the values passed in through the form.
On a successful database save, user is immediately logged-in, then redirected
to the home page.

One last thing we are going to add is the logout route:

```
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
```

At this stage you have a basic, but fully functional application with
**Home**, **Login** and **Signup** pages. We have everything but the password
reset feature, which was the entire point of this tutorial.

Create a new route in `app.js` and a corresponding template, `forgot.jade`:

```
app.get('/forgot', function(req, res) {
  res.render('forgot', {
    user: req.user
  });
});
```

```
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
success and error messages when they are filling out the form. Go ahead and
run:
```
npm install express-flash --save
```

and then add it to `app.js`:

```
var flash = require('express-flash');
```

And finally add it with the rest of your Express middleware. I have placed it
right after `express.sesson()`, although it will probably still work if you
place it elsewhere.

```
app.use(flash());
```

To display flash messages, let's add this to the `.container` inside
`layout.jade`, right before `block content`:

```
.container
  if messages.error
    .alert.alert-danger
      div= messages.error
  if messages.info
    .alert.alert-info
      div= messages.info
  block content
```


Ok, so far so good. Now, it's going to get a little more complicated. Add the
following route to handle the form on `/forgot` page:




Source code for this tutorial is available on
[GitHub](https://github.com/sahat/express-password-reset).