---
layout: post

title: Implementing Password Reset in Node.js

---

In this tutorial, we'll go over how to create "forgot password" feature
using Express, MongoDB, Passport and Nodemailer. We will build a complete
application from scratch. This guide assumes as little possible, and thus
covers some basics along the way.

At the very least I assume you have already installed Node.js. So, let's
begin by installing Express if you don't have it already:

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

<img src="/images/blog/Screenshot 2014-02-24 19.33.11.png">

Let's install NPM dependencies:

```
cd myapp && npm install
```

We will be using *Nodemailer* for sending password reset emails,
*Mongoose* for interacting with MongoDB and *Passport* for user authentication.
Additionally we will require *bcrypt-nodejs* to hash user passwords.
To install these packages, run:

```
npm install mongoose nodemailer passport passport-local bcrypt-nodejs --save
```

**Note:** By passing `--save` flag, those packages will be automatically added
to `package.json`.

Add these four packages at the top of `app.js`:

```
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

```

From here on, we will be working entirely in the `app.js` file.

Since we are using Mongoose, we will first need to create a `User` model
before we can do anything. But even before that, we need to have a Schema.
Let's start by defining the `User` schema. Add this right after module
dependencies.


```
var userSchema = new mongoose.Schema({
  username: { type: String, required, unique: true },
  password: { type: String, required: true }
});
```

Each schema maps to a MongoDB collection. Each key - username and password,
defines a property in our MongoDB documents. Besides specifying a structure of
documents, they also define
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







