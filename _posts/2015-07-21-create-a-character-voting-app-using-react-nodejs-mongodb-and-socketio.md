---
layout: post
title: Create a character voting app using React, Node.js, MongoDB and Socket.IO
excerpt: "In this tutorial we are going to build a character voting app (inspired by Facemash) for EVE Online - a massively multiplayer online game. You will learn how to build a REST API with <strong>Node.js</strong>, save and retrieve data from <strong>MongoDB</strong>, track online visitors in real-time using <strong>Socket.IO</strong>, build a single-page app experience using <strong>React</strong> + <strong>Flux</strong> with server-side rendering and then finally deploy it to the cloud."
gradient: 1
image: bg/7.jpg
comments: true
---

## Update Notice (October 19, 2015)
Tutorial has been updated to use **React 0.14** and **React Router 1.0** that introduced breaking changes. For detailed tutorial updates see *October 19, 2015* notices below.


## Overview

In this tutorial we are going to build a character voting app (inspired by *Facemash* and *Hot or Not*) for [EVE Online](http://www.eveonline.com/) - a massively multiplayer online game. Be sure to play this awesome soundtrack below to get yourself in the mood for this epicly long tutorial.

<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/152471846&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"></iframe>

While listening to this soundtrack, imagine yourself mining asteroid belts in deep space while keeping a lookout for pirates on the radar, researching propulsion system blueprints at the station's facility, manufacturing spaceship components for capital ships, placing buy & sell orders on the entirely player-driven market where supply and demand govern the game economics, hauling trade goods from a remote solar system in a massive freighter, flying blazingly fast interceptors with a microwarpdrive or powerful battleships armored to the teeth, optimizing extraction efficiency of rare  minerals from planets, or fighting large-scale battles with thousands of players from multiple alliances. That is **EVE Online**.

Each player in EVE Online has a 3D avatar representing their character. This app is designed for ranking those avatars. Anyway, your goal here is to learn about Node.js, React and Flux, not EVE Online. But I will say this: "Having an interesting tutorial project is just as important, if not more so, than the main subject of the tutorial". The only reason I built the original [New Eden Faces](http://www.newedenfaces.com/) app is to learn <i class="devicons devicons-backbone"></i>Backbone.js and the only reason I built the [TV Show Tracker](https://github.com/sahat/tvshow-tracker) app is so that I could learn <i class="devicons devicons-angular"></i>AngularJS. To me, either one of these projects is far more interesting than a simple todo app that everyone seems to be using these days.

One thing that I have learned — between screencasts, books and training videos, nothing is more effective than building a small project that you are passionate about to learn a new technology.

![](/images/blog/Screenshot 2015-03-31 23.05.36.png)

<ul class="list-inline text-center">
  <li><a href="https://github.com/sahat/newedenfaces-react"><i class="ion-fork-repo"></i> GitHub Source Code</a></li>
</ul>

In the same spirit as my previous tutorials ([TV Show Tracker](http://sahatyalkabov.com/create-a-tv-show-tracker-using-angularjs-nodejs-and-mongodb/) and [Instagram Clone](https://hackhands.com/building-instagram-clone-angularjs-satellizer-nodejs-mongodb/)), this is a step by step full-stack JavaScript tutorial where we build a complete app from the ground up.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  This is a remake of the original <a href="http://www.newedenfaces.com/">New Eden Faces</a> (2013) project, which was my first ever single-page application written in Backbone.js. It has been running in production on <a href="https://www.openshift.com/">OpenShift</a> with Node.js 0.8.x for over 2 years now.
</div>

I usually make as few assumptions as possible about a particular topic, which is why my tutorials are so lengthy, but having said that, you need to have at least some prior experience with client-side JavaScript frameworks and Node.js to get the most out of this tutorial.

Before proceeding, you will need to download and install the following tools:

1. <i class="devicons devicons-npm"></i> [Node.js](https://nodejs.org/)
2. <i class="devicons devicons-bower"></i> [Bower](http://bower.io/)
3. <i class="devicons devicons-mongodb"></i> [MongoDB](https://www.mongodb.org/downloads)
4. <i class="devicons devicons-gulp"></i> [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
5. <i class="devicons devicons-nodejs"></i> [nodemon](https://github.com/remy/nodemon#nodemon)

## Step 1. New Express Project

Create a new directory **<i class="fa fa-folder-open"></i>newedenfaces**. Inside, create 2 empty files *package.json* and *server.js* using your favorite text editor or using the command line:

![](/images/blog/Screenshot 2015-03-22 04.50.51.png)

**July 22, 2015 Update:** I am using the default Terminal app in Mac OS X with [Monokai](https://github.com/stephenway/monokai.terminal) theme and [oh-my-fish](https://github.com/oh-my-fish/oh-my-fish) framework for the [Fish](http://fishshell.com/) shell.

Open *package.json* and paste the following:

```json
{
  "name": "newedenfaces",
  "description": "Character voting app for EVE Online",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/sahat/newedenfaces-react"
  },
  "main": "server.js",
  "scripts": {
    "start": "babel-node server.js",
    "watch": "nodemon --exec babel-node -- server.js",
    "postinstall": "bower install && gulp build"
  },
  "dependencies": {
    "alt": "^0.17.4",
    "async": "^1.4.2",
    "babel": "^5.8.23",
    "body-parser": "^1.14.1",
    "colors": "^1.1.2",
    "compression": "^1.6.0",
    "express": "^4.13.3",
    "history": "^1.12.5",
    "mongoose": "^4.1.12",
    "morgan": "^1.6.1",
    "react": "^0.14.0",
    "react-dom": "^0.14.0",
    "react-router": "^1.0.0-rc3",
    "request": "^2.65.0",
    "serve-favicon": "^2.3.0",
    "socket.io": "^1.3.7",
    "swig": "^1.4.2",
    "underscore": "^1.8.3",
    "xml2js": "^0.4.13"
  },
  "devDependencies": {
    "babelify": "^6.3.0",
    "bower": "^1.6.3",
    "browserify": "^11.2.0",
    "gulp": "^3.9.0",
    "gulp-autoprefixer": "^3.1.0",
    "gulp-concat": "^2.6.0",
    "gulp-cssmin": "^0.1.7",
    "gulp-if": "^2.0.0",
    "gulp-less": "^3.0.3",
    "gulp-plumber": "^1.0.1",
    "gulp-streamify": "1.0.2",
    "gulp-uglify": "^1.4.2",
    "gulp-util": "^3.0.6",
    "vinyl-source-stream": "^1.1.0",
    "watchify": "^3.4.0"
  },
  "license": "MIT"
}
```

**October 19, 2015 Update:** Updated package versions and added two new packages: [react-dom](https://www.npmjs.com/package/react-dom) (as part of the React 0.14 changes) and [history](https://www.npmjs.com/package/history) (as part of the React Router 1.0 changes).

These are all the packages that we will be using in this project. Let's briefly go over each package.

| Package Name          | Description   |
| ------------- |:-------------:|
| [alt](https://github.com/goatslacker/alt)      | Flux library for React. |
| [async](https://github.com/caolan/async)      | For managing asynchronous flow.      |
| [babel](http://babeljs.io) | ES6 compiler.      |
| [body-parser](https://github.com/expressjs/body-parser) | For parsing POST request data.      |
| [colors](https://github.com/marak/colors.js/) | Pretty console output messages.      |
| [compression](https://github.com/expressjs/compression) | Gzip compression.    |
| [express](http://expressjs.com) | Web framework for Node.js.      |
| [history](https://github.com/rackt/history) | Manage session history in browsers, used by react-router.      |
| [mongoose](http://mongoosejs.com/) | MongoDB ODM with validation and schema support.      |
| [morgan](https://github.com/expressjs/morgan) | HTTP request logger.      |
| [react](http://facebook.github.io/react/) | React.      |
| [react-dom](https://www.npmjs.com/package/react-dom) | React rendering, it is no longer bundled with React.      |
| [react-router](https://github.com/rackt/react-router) | Routing library for React.      |
| [request](https://github.com/request/request) | For making HTTP requests to EVE Online API.      |
| [serve-favicon](https://github.com/expressjs/serve-favicon) | For serving *favicon.png* icon.      |
| [socket.io](http://socket.io/) | To display how many users are online in real-time.      |
| [swig](http://paularmstrong.github.io/swig/) | To render the initial HTML template.      |
| [underscore](http://underscorejs.org/) | Helper JavaScript utilities.      |
| [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) | For parsing XML response from EVE Online API.      |

Run `npm install` in the Terminal to install the packages that we specified in the *package.json*.

![](/images/blog/Screenshot 2015-03-22 05.19.19.png)

<div class="admonition note">
  <div class="admonition-title">Note</div>
  If you are using Windows check out <a href="http://cmder.net/">cmder</a>
  console emulator. It is the closest thing to Mac OS X/Linux Terminal experience.
</div>

Open *server.js* and paste the following code. It's a very minimal Express application, just enough to get us started.

```js
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
```

<div class="admonition note">
  <div class="admonition-title">Note</div>
 Although we will be building the React app in ES6, I have decided to use ES5 here because this back-end code is mostly unchanged from when I built the original <a href="https://github.com/sahat/newedenfaces">New Eden Faces</a> app. Furthermore, if you are using ES6 for the first time, it won't be too overwhelming, since the Express app should still be familiar to you.
</div>

Next, create a new directory **<i class="fa fa-folder-open"></i>public**. This is where we are going to place *images*, *fonts*, compiled *CSS* and *JavaScript* files.

![](/images/blog/Screenshot 2015-03-22 05.41.53.png)

Run `npm start` in the Terminal to make sure our Express app is working without any issues.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  While you could technically use <code>node server.js</code> to start the app right now, as soon as we start writing the React app using ECMAScript 6 and pre-rendering it on the server, we will need the Babel compiler. Alternatively, you could use <code>babel-node server.js</code> to start the app.
</div>


You should see **Express server listening on port 3000** message in the Terminal.

## Step 2. Build System

If you have been around in the web community at all, then you may have heard about [Browserify](http://browserify.org/) and [Webpack](http://webpack.github.io/) tools. If not, then consider what it would be like having to manually include all these `<script>` tags in a specific order, because one file may depend on another file which depends on another file.

![](/images/blog/Screenshot 2015-06-20 22.56.37.png)

Additionally, we cannot use ECMAScript 6 directly in the browsers yet. Our code needs to be transformed by Babel into ECMAScript 5 before it can be served and interpreted by the browsers.

We will be using [Gulp](http://gulpjs.com/) and [Browserify](http://browserify.org/) in this tutorial instead of Webpack. I will not advocate for which tool is better or worse, but personally I found that Gulp + Browserify is a lot more straightforward to me than an equivalent Webpack config file. I have yet to find a React boilerplate project with an easy to understand *webpack.config.js* file.

Create a new file *gulpfile.js* and paste the following code:

```js
var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var streamify = require('gulp-streamify');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var less = require('gulp-less');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');

var production = process.env.NODE_ENV === 'production';

var dependencies = [
  'alt',
  'react',
  'react-dom',
  'react-router',
  'underscore'
];

/*
 |--------------------------------------------------------------------------
 | Combine all JS libraries into a single file for fewer HTTP requests.
 |--------------------------------------------------------------------------
 */
gulp.task('vendor', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/bootstrap/dist/js/bootstrap.js',
    'bower_components/magnific-popup/dist/jquery.magnific-popup.js',
    'bower_components/toastr/toastr.js'
  ]).pipe(concat('vendor.js'))
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile third-party dependencies separately for faster performance.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-vendor', function() {
  return browserify()
    .require(dependencies)
    .bundle()
    .pipe(source('vendor.bundle.js'))
    .pipe(gulpif(production, streamify(uglify({ mangle: false }))))
    .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile only project files, excluding all third-party dependencies.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify', ['browserify-vendor'], function() {
  return browserify('app/main.js')
    .external(dependencies)
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulpif(production, streamify(uglify({ mangle: false }))))
    .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Same as browserify task, but will also watch for changes and re-compile.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-watch', ['browserify-vendor'], function() {
  var bundler = watchify(browserify('app/main.js', watchify.args));
  bundler.external(dependencies);
  bundler.transform(babelify);
  bundler.on('update', rebundle);
  return rebundle();

  function rebundle() {
    var start = Date.now();
    return bundler.bundle()
      .on('error', function(err) {
        gutil.log(gutil.colors.red(err.toString()));
      })
      .on('end', function() {
        gutil.log(gutil.colors.green('Finished rebundling in', (Date.now() - start) + 'ms.'));
      })
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('public/js/'));
  }
});

/*
 |--------------------------------------------------------------------------
 | Compile LESS stylesheets.
 |--------------------------------------------------------------------------
 */
gulp.task('styles', function() {
  return gulp.src('app/stylesheets/main.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulpif(production, cssmin()))
    .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
  gulp.watch('app/stylesheets/**/*.less', ['styles']);
});

gulp.task('default', ['styles', 'vendor', 'browserify-watch', 'watch']);
gulp.task('build', ['styles', 'vendor', 'browserify']);
```

<div class="admonition note">
  <div class="admonition-title">Note</div>
   If you have not used Gulp before, this is a great starting point — <a href="http://www.sitepoint.com/introduction-gulp-js/">An Introduction to Gulp.js</a>.
</div>

Although the code should be more or less self-explanatory with those task names and code comments, let's briefly go over each task for completeness.

| Gulp Task           | Description   |
| ------------------- |:-------------:|
| `vendor`            | Concatenates all JS libraries into one file.   |
| `browserify-vendor` | For performance reasons, NPM modules specified in the `dependencies` array are compiled and bundled separately. As a result, *bundle.js* recompiles a few hundred milliseconds faster.      |
| `browserify`        | Compiles and bundles just the app files, without any external modules like *react* and *react-router*.       |
| `browserify-watch`  | Essentially the same task as above but it will also listen for changes and re-compile *bundle.js*.       |
| `styles`            | Compiles LESS stylesheets and automatically adds browser prefixes if necessary.    |
| `watch`             | Re-compiles LESS stylesheets on file changes.      |
| `default`           | Runs all of the above tasks and starts watching for file changes.      |
| `build`             | Runs all of the above tasks then exits.    |

Next, we will shift focus to the project structure by creating files and folders that *gulpfile.js* is expecting.

## Step 3. Project Structure

In the **<i class="fa fa-folder-open"></i>public** directory create 4 new folders **<i class="fa fa-folder-open"></i>css**, **<i class="fa fa-folder-open"></i>js**, **<i class="fa fa-folder-open"></i>fonts** and **<i class="fa fa-folder-open"></i>img**. Also, download this [favicon.png](https://raw.githubusercontent.com/sahat/newedenfaces-react/master/public/favicon.png) and place it here as well.

![](/images/blog/Screenshot 2015-06-21 00.47.32.png)


In the **<i class="fa fa-folder-open"></i>newedenfaces** directory (project root), create a new folder **<i class="fa fa-folder-open"></i>app**.

Then inside **<i class="fa fa-folder-open"></i>app** create 4 new folders **<i class="fa fa-folder-open"></i>actions**, **<i class="fa fa-folder-open"></i>components**, **<i class="fa fa-folder-open"></i>stores**, **<i class="fa fa-folder-open"></i>stylesheets** and 3 empty files *alt.js*, *routes.js* and *main.js*.

![](/images/blog/Screenshot 2015-06-21 00.58.43.png)

In the **<i class="fa fa-folder-open"></i>stylesheets** directory create a new file *main.less* which we will populate with CSS styles shortly.

Back in the project root directory (**<i class="fa fa-folder-open"></i>newedenfaces**), create a new file *bower.json* and paste the following:

```json
{
  "name": "newedenfaces",
  "dependencies": {
    "jquery": "^2.1.4",
    "bootstrap": "^3.3.5",
    "magnific-popup": "^1.0.0",
    "toastr": "^2.1.1"
  }
}
```

<div class="admonition note">
  <div class="admonition-title">Note</div>
Bower is a package manager that lets you easily download JavaScript libraries, such as the ones specified above, via a command line instead of visiting each individual website, downloading, extracting and adding it to the project manually.
</div>

Run `bower install` and wait for the packages to be downloaded and installed into the **<i class="fa fa-folder-open"></i>bower_components** directory. You can change that path using the [*.bowerrc*](http://bower.io/docs/config/#directory) file, but for the purposes of this tutorial we will stick with the defaults.

Similarly to **<i class="fa fa-folder-open"></i>node_modules**, you should not commit **<i class="fa fa-folder-open"></i>bower_components** into a Git repository. But wait a minute, if you don't add and commit it to Git, how will those files be loaded when you deploy your app? We will get back to this issue later during the deployment step of the tutorial.

Copy all glyphicons fonts from **<i class="fa fa-folder-open"></i>bower_components/bootstrap/fonts** into **<i class="fa fa-folder-open"></i>public/fonts** directory.

Download and extract the following background images and place them into **<i class="fa fa-folder-open"></i>public/img** directory:

- [Background Images.zip](/assets/Background Images.zip)

<div class="admonition note">
  <div class="admonition-title">Fun Fact</div>
 I have used the Gaussian blur in Adobe Photoshop in order to create that out of focus effect over 3 years ago when I built the original New Eden Faces project, but now it should be totally possible to achieve a similar effect using <a href="http://codepen.io/aniketpant/pen/DsEve">CSS filters<a/>.
</div>

Open *main.less* that we just created and paste the following styles from the link below. Due to the sheer length of it, I have decided to include it as a separate file.

- <a href="https://github.com/sahat/newedenfaces-react/blob/master/app/stylesheets/main.less"><i class="devicons devicons-css3"></i> main.less</a>

If you have used the [Bootstrap](http://getbootstrap.com/) CSS framework in the past, then most of it should be already familiar to you.

I don't know if you are aware of the latest [trend](https://speakerdeck.com/vjeux/react-css-in-js) to include styles directly inside React components, but I am not sure if I like this new practice. Perhaps when tooling gets better I will revisit this topic, until then I will use external stylesheets like I always have been. However, if you are interested in using modular CSS, check out [css-modulesify](https://github.com/css-modules/css-modulesify).

**October 19, 2015 Update:** If you are building reusable React components like [Elemental UI](http://elemental-ui.com/) and [Material UI](http://material-ui.com/) then by all means do it. I would actually prefer if I don't have to import accompanying "vendor" stylesheets like we do with pretty much every jQuery library.

Before we jump into building the React app, I have decided to dedicate the next three sections to ES6, React, Flux, otherwise it may be too overwhelming trying to learn everything at once. Personally, I had a very hard time following some React + Flux code examples written in ES6 because I was learning a new syntax, a new framework and a completely unfamiliar app architecture all at once.

Since I cannot cover everything in-depth, we will be going over only those topics that you need to know for this tutorial.

## Step 4. ES6 Crash Course

The best way to learn ES6 is by showing an equivalent ES5 code for every ES6 example. Again, I will only be covering what you need to know for this tutorial. There are plenty of blog posts that go in great detail about the new ES6 features.

**<i class="ion-archive"></i>Modules (Import)**

```js
// ES6
import React from 'react';
import {Route, DefaultRoute, NotFoundRoute} from 'react-router';
```

```js
// ES5
var React = require('react');
var Router = require('react-router');

var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
```

Using the ES6 [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) we can import a subset of a module which can be quite useful for modules like *react-router* and *underscore* where it exports more than one function.

One thing to keep in mind is that ES6 imports are hoisted. All dependent modules will be loaded before any of the module code is executed. In other words, you can't conditionally load a module like with CommonJS. That did throw me off a little when I tried to import a module inside an if-else condition.

For a detailed overview of the `import` statement see this [MDN page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

**<i class="ion-share"></i>Modules (Export)**

```js
// ES6
function Add(x) {
  return x + x;
}

export default Add;
```

```js
// ES5
function Add(x) {
  return x + x;
}

module.exports = Add;
```

To learn more about ES6 modules, as well as different ways of importing and exporting functions from a module, check out [ECMAScript 6 modules](http://www.2ality.com/2014/09/es6-modules-final.html) and [Understanding ES6 Modules](http://www.sitepoint.com/understanding-es6-modules/).

**<i class="ion-cube"></i>Classes**

ES6 classes are nothing more than a syntactic sugar over the existing prototype-based inheritance in JavaScript. As long as you remember that fact, the `class` keyword will not seem like a foreign concept to you.

```js
// ES6
class Box {
  constructor(length, width) {
    this.length = length;
    this.width = width;
  }
  calculateArea() {
    return this.length * this.width;
  }
}

let box = new Box(2, 2);

box.calculateArea(); // 4
```

```js
// ES5
function Box(length, width) {
  this.length = length;
  this.width = width;
}

Box.prototype.calculateArea = function() {
  return this.length * this.width;
}

var box = new Box(2, 2);

box.calculateArea(); // 4
```

With ES6 classes you can now use `extends` to create a subclass from an existing class:

```js
// ES6
class MyComponent extends React.Component {
  // Now MyComponent contains all React component methods
  // such as componentDidMount(), render() and etc.
}
```

```js
// ES5
var MyComponent = React.createClass({
  // Now MyComponent contains all React component methods
  // such as componentDidMount(), render() and etc.
})
```

**October 19, 2015 Update:** Added the ES5 example using `React.createClass`.

For more information about ES6 classes visit [Classes in ECMAScript 6](http://www.2ality.com/2015/02/es6-classes-final.html) blog post.


**<i class="ion-social-javascript"></i>`var` vs `let`**

The only difference between the two is that `var` is scoped to the nearest *function block* and `let` is scoped to the nearest *enclosing block*  - which could be a *function*, a *for-loop* or an *if-statement block*.

Here is a good [example](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) showing the difference between `var` and `let`:

```js
var a = 5;
var b = 10;

if (a === 5) {
  let a = 4; // The scope is inside the if-block
  var b = 1; // The scope is inside the function

  console.log(a);  // 4
  console.log(b);  // 1
}

console.log(a); // 5
console.log(b); // 1
```

Basically, `let` is block scoped, `var` is function scoped.

**<i class="ion-android-send"></i>Arrow Functions (Fat Arrow)**

An arrow function expression has a shorter syntax compared to function expressions and lexically binds the `this` value.

```js
// ES6
[1, 2, 3].map(n => n * 2); // [2, 4, 6]

// ES5
[1, 2, 3].map(function(n) { return n * 2; }); // [2, 4, 6]
```

<div class="admonition note">
  <div class="admonition-title">Note</div>
Parentheses around the single argument are optional, so it is up to you whether you want to enforce it or not. Some see it as a bad practice, others think it's fine.
</div>

Besides a shorter syntax, what else is it useful for?

Consider the following example, straight from this project before I converted it to ES6.

```js
$.ajax({ type: 'POST', url: '/api/characters', data: { name: name, gender: gender } })
  .done(function(data) {
    this.setState({ helpBlock: data.message });
  }.bind(this))
  .fail(function(jqXhr) {
    this.setState({ helpBlock: jqXhr.responseJSON.message });
  }.bind(this))
  .always(function() {
    this.setState({ name: '', gender: '' });
  }.bind(this));
```

Every function expression above creates its own `this` scope. Without binding `this` we would not be able to call `this.setState` in the example above, because `this` would have been *undefined*.

Alternatively, we could have assigned `this` to a variable, e.g. `var self = this` and then used `self.setState` instead of `this.setState` inside the [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) to get around this classic JavaScript problem.

In any case, here is an equivalent ES6 code using fat arrow functions which preserve the original `this` value:

```js
$.ajax({ type: 'POST', url: '/api/characters', data: { name: name, gender: gender } })
  .done((data) => {
    this.setState({ helpBlock: data.message });
  })
  .fail((jqXhr) => {
    this.setState({ helpBlock: jqXhr.responseJSON.message });
  })
  .always(() => {
    this.setState({ name: '', gender: '' });
  });
```

Next, let's talk about React, what makes it so special and why should we use it.

## Step 5. React Crash Course

<i class="devicons devicons-react"></i> React is a JavaScript library for building web user interfaces. You could say it competes against <i class="devicons devicons-angular"></i> AngularJS, <i class="devicons devicons-ember"></i> Ember.js, <i class="devicons devicons-backbone"></i> Backbone and <i class="devicons devicons-webplatform"></i> Polymer despite being much smaller in scope. React is just the **V** in the **MVC** (Model-View-Controller) architecture.

So, what is so special about React?

React components are written in a very declarative style. Unlike the "old way" using jQuery and such, you don't interact with DOM directly. React manages all UI updates when the underlying data changes.

React is also very fast thanks to the Virtual DOM and diffing algorithm under the hood. When the data changes, React calculates the minimum number of DOM manipulations needed, then efficiently re-renders the component. For example, if there are 10,000 rendered items on a page and only 1 item changes, React will update just that DOM element, leaving 9,999 other items unchanged. That's why React can get away with re-rendering the entire components without being ridiculously wasteful and slow.

Other notable features of React include:

- **Composability**, i.e. make bigger, more complex components out of smaller components.
- **Relatively easy to pick up** since there isn't that much to learn and it does not have a massive documentation like AngularJS and Ember.js.
- **Server-side rendering** allows us to easily build [Isomorphic JavaScript apps](https://medium.com/@mjackson/universal-javascript-4761051b7ae9).
- The most **helpful error and warning messages** that I have seen in any JavaScript library.
- **Components are self-contained**; markup and behavior ([and even styles](http://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html)) live in the same place, making components very reusable.

**October 19, 2015 Update:** We will not be building a true Isomorphic JavaScript app. If you disable JavaScript your Browser, a page will be rendered just fine for the most part, but it will not render any characters because that requires more work by fetching data from the database and then passing it to the root React component that will need to pass the data down to its children components, which is outside the scope of this tutorial. 

I really like this excerpt from the [React v0.14 Beta 1 blog post](http://facebook.github.io/react/blog/2015/07/03/react-v0.14-beta-1.html) announcement that sums up nicely what React is all about:

> It's become clear that the beauty and essence of React has nothing to do with browsers or the DOM. We think the true foundations of React are simply ideas of components and elements: being able to describe what you want to render in a declarative way.

---

Before going any further please watch this awesome video [React in 7 Minutes](https://egghead.io/lessons/react-react-in-7-minutes) by John Lindquist.

And while you are there, I highly recommend getting the **PRO** subscription ($24.99/month) to unlock over 94 React and [React Native](https://facebook.github.io/react-native/) video lessons. No, you will not become an expert just by watching these videos, but they are amazing at giving you short and straight to the point explanations on any particular topic. If you are on a budget, you can subscribe for 1 month, download all the videos, then cancel your subscription at the end of the month. Subscribing not only gives you access to React lessons, but also to [TypeScript](https://egghead.io/technologies/typescript), [Angular 2](https://egghead.io/technologies/angular2), [D3](https://egghead.io/technologies/d3), [ECMAScript 6](https://egghead.io/technologies/es6), [Node.js](https://egghead.io/technologies/node) and more.

**<i class="fa fa-hand-o-right"></i> Disclaimer:** I am not affiliated with *Egghead.io* and I do not get any commissions for referrals. 

While learning React, the biggest challenge for me was that it required a completely different thinking approach to building UIs. Which is why reading [Thinking in React](https://facebook.github.io/react/docs/thinking-in-react.html) guide is absolutely a must for anyone who is starting out with React.

In similar fashion to the *Product Table* from [Thinking in React](https://facebook.github.io/react/docs/thinking-in-react.html), if we are to break apart the *New Eden Faces* UI into potential components, this is what it would look like:

![](/images/blog/Screen Shot 2015-06-21 at 11.45.38 PM copy.png)

<div class="admonition note">
  <div class="admonition-title">Note</div>
  Each component should try to adhere to the <em>single responsibility principle</em>. If you find yourself working on a component that does too many things, perhaps it's best to split it into sub-components. Having said that, I typically write monolithic components first, just to get it working, then refactor it by splitting it into smaller sub-components.
</div>

The top-level <span style='color: #FF4136'>App</span> component contains <span style='color: #0074D9'>Navbar</span>, <span style='color: #0074D9'>Homepage</span> and <span style='color: #0074D9'>Footer</span> components. <span style='color: #0074D9'>Homepage</span> component contains two <span style='color: #2ECC40'>Character</span> components.

So, whenever you have a certain UI design in mind, start by breaking it apart from top-down and always be mindful of how your data propagates from parent to child, child to parent and between sibling components or you will quickly find yourself completely lost. It may be difficult initially, but it will become second nature to you after building a few React apps.

So, next time you decide to build a new app in React, before writing any code, do this hierarchy outline first. It will help you to visualize the relationships between multiple components and build them accordingly.

---

All components in React have a `render()` method. It always returns a *single child* element. Conversly, the following return statement is invalid because it contains 3 child elements:

```js
render() {
  // Invalid JSX
  return (
    <li>Achura</li>
    <li>Civire</li>
    <li>Deteis</li>
  );
}
```

The HTML markup above is actually called [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html). As far syntax goes, it is just slightly different from HTML, for example `className` instead of `class` to define CSS classes. You will learn more about it as we start building the app.

When I first saw that syntax, I was immediately repulsed by it. I am used to returning booleans, numbers, strings, objects and functions in JavaScript, but certaintly not that. However, JSX is actually just a syntactic sugar. After fixing the code above by wrapping it with a `<ul>` tag (must return a single element), here is what it looks like without JSX:

```js
render() {
  return React.createElement('ul', null,
    React.createElement('li', null, 'Achura'),
    React.createElement('li', null, 'Civire'),
    React.createElement('li', null, 'Deteis')
  );
}
```

I think you will agree that JSX is far more readable than plain JavaScript. Furthermore, [Babel](http://babeljs.io/) has a built-in support for JSX, so we don't need to install anything extra. If you have ever worked with AngularJS directives then you will appreciate working with React components, so instead of having two different files — *directive.js* (logic) and *template.html* (presentation), you have a single file containing both logic and presentation.

The [`componentDidMount`](https://facebook.github.io/react/docs/component-specs.html#mounting-componentdidmount) method in React is the closest thing to [`$(document).ready`](https://learn.jquery.com/using-jquery-core/document-ready/) in jQuery. This method runs once ([only on the client](https://facebook.github.io/react/docs/component-specs.html#mounting-componentdidmount)) immediately after initial rendering of the component. This is where you would typically initialize third-party libraries and jQuery plugins, or connect to Socket.IO.

You will be using [Ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) in the [`render`](https://facebook.github.io/react/docs/component-specs.html#render) method quite a lot: hiding an element when data is empty, conditionally using CSS classes depending on some value, hiding or showing certain elements based on the component's state and etc.

Consider the following example that conditionally sets the CSS class to <span style='color: #FF4136'>text-danger</span> or <span style='color: #2ECC40'>text-success</span> based on the props value.

```js
render() {
  let delta = this.props.delta ? (
    <strong className={this.props.delta > 0 ? 'text-success' : 'text-danger'}>
      {this.props.delta}
    </strong>
  ) : null;

  return (
    <div className='card'>
      {delta}
      {this.props.title}
    </div>
  );
}
```

We have only scratched the surface of everything there is to React, but this should be enough to give you a general idea about React as well as its benefits.

React on its own is actually really simple and easy to grasp. However, it is when we start talking about [Flux](https://facebook.github.io/flux/) architecture, things can get a little confusing.

## Step 6. Flux Architecture Crash Course

Flux is the application architecture that was developed at Facebook for building scalable client-side web applications.
 It complements React's components by utilizing a unidirectional data flow. Flux is more of a pattern than a framework, however, we will be using a Flux library called [Alt](http://alt.js.org) to minimize writing the boilerplate code.

Have you seen this diagram before? Did it make any sense to you? It did not make any sense to me, no matter how many times I looked at it.

![](/images/blog/flux-diagram.png)

Now that I understand it better, I am actually really amazed by how such simple architecture can be presented in a such complicated way. But to Facebook's credit, their [new Flux diagrams](https://facebook.github.io/flux/docs/overview.html#structure-and-data-flow) are much better than before.

<div class="admonition note">
  <div class="admonition-title">Fun Fact</div>
 When I first began writing this tutorial I decided not to use Flux in this project. I could not grasp it for the life of me, let alone teach it to others. But thankfully, I get to work on cool stuff at Yahoo where I get to play and experiment with different technologies during my work hours. Honestly, we could have built this app without Flux and it would have been less lines of code. We don't have here any complex or nested components. But I believe that showing a full-stack React app with server-side rendering and Flux architecture, to see how all pieces connect together, has a value in of itself.
</div>

Instead of reiterating the [Flux  Overview](https://facebook.github.io/flux/docs/overview.html), let's take a look at one of the real-world use cases in order to illustrate how Flux works:

![](/images/blog/Screenshot 2015-06-22 02.18.48.png)

1. On `componentDidLoad` (when the page is rendered) three actions are fired:

    ```js
    OverviewActions.getSummary();
    OverviewActions.getApps();
    OverviewActions.getCompanies();
    ```

2. Each one of those actions makes an AJAX request to the server to fetch the data.

3. When the data is fetched, each action fires another *"success"* action and passes the data along with it:

    ```js
    getSummary() {
      request
        .get('/api/overview/summary')
        .end((err, res) => {
          this.actions.getSummarySuccess(res.body);
        });
    }
    ```

4. Meanwhile, the *Overview* store (a place where we keep the state for *Overview* component) is listening for those *"success"* actions. When the `getSummarySuccess` action is fired, `onGetSummarySuccess` method in the *Overview* store is called and the store is updated:

    ```js
    class OverviewStore {

      constructor() {
        this.bindActions(OverviewActions);
        this.summary = {};
        this.apps = [];
        this.companies = [];
      }

      onGetSummarySuccess(data) {
        this.summary = data;
      }

      onGetAppsSuccess(data) {
        this.apps = data;
      }

      onGetCompaniesSuccess(data) {
        this.companies = data;
      }
    }
    ```

5. As soon as the store is updated, the *Overview* component will know about it because it has subscribed to the *Overview* store. When a store is updated/changed, a component will set its own state to whatever is in that store.

    ```js
    class Overview extends React.Component {

      constructor(props) {
        super(props);
        this.state = OverviewStore.getState();
        this.onChange = this.onChange.bind(this);
      }

      componentDidMount() {
        OverviewStore.listen(this.onChange);
      }

      onChange() {
        this.setState(OverviewStore.getState())
      }

      ...
    }
    ```

6. At this point the *Overview* component has been updated with the new data.

7. In screenshot above,when the date range is updated from the dropdown menu, the entire process is repeated all over again.

<div class="admonition note">
  <div class="admonition-title">Note</div>
 Action names do not matter, use whatever naming convention you want as long as it is descriptive and makes sense.
</div>

Ignoring the *Dispatcher* for a moment, can you see the one-way flow outlined above? If not, it's alright, it will start making more sense as we start building the app.

![](/images/blog/flux-simple-f8-diagram-1300w.png)

**Flux Summary**

Flux is really just a fancy term for **pub/sub** architecture, i.e. data always flows one way through the application and it is picked up along the way by various subscribers (stores) who are listening to it.

---

There are more than a dozen of Flux implementations at the time of this writing. Out of them all, I only have experience with [RefluxJS](https://github.com/spoike/refluxjs) and [Alt](http://alt.js.org/). Between the two, I personally prefer Alt for its simplicity, great support by [*@goatslacker*](https://github.com/goatslacker), server-side rendering support, great documentation and the project is actively maintained.

I strongly encourage you to go through the Alt's [Getting Started](http://alt.js.org/guide/) guide. It will take no more than 10 minutes to skim through it.

If you are undecided on the Flux library, consider the following [comment](https://news.ycombinator.com/item?id=9833099) by *glenjamin* on Hacker News, in response to having a hard time figuring out which Flux library to use:

> The dirty secret is: they're probably all fine.
It's unlikely that you will choose a flux lib that will be the make or break point of your application.
Even if a library stops being "maintained", most decent flux incarnations are really small (~100 LoC) - it's unlikely that there's some fatal flaw you'll be stuck with.
In summary: redux is neat, but don't beat yourself up over choosing the perfect flux lib - just grab one that you like the look of and move on with building your application.

---

Now that we have covered some basics behind ES6, React and Flux, it is time to move on to building the application.

## Step 7. React Routes (Client-Side)

Create a new file *App.js* inside **<i class="fa fa-folder-open"></i>app/components** with the following contents:

```js
import React from 'react';

class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default App;
```

~~`RouteHandler` is a component that~~ `{this.props.children}` now renders the active child route handler. It will render one of the following components depending on the URL path: *Home*, *Top 100*, *Profile* or *Add Character*.

**October 19, 2015 Update:** [RouteHandler is gone](https://github.com/rackt/react-router/blob/master/UPGRADE_GUIDE.md#routehandler). Router now automatically populates `this.props.children` of your components based on the active route.

<div class="admonition note">
  <div class="admonition-title">Note</div>
It is similar to <a href="https://docs.angularjs.org/api/ngRoute/directive/ngView"><code>&lt;div ng-view&gt;&lt;/div&gt;</code></a> in AngularJS, which includes the rendered template of current route into the main layout.
</div>

Next, open *routes.js* inside **<i class="fa fa-folder-open"></i>app** and paste the following:

```js
import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';

export default (
  <Route component={App}>
    <Route path='/' component={Home} />
  </Route>
);
```

**October 19, 2015 Update:** The `handler` prop is now called `component`. Named routes are gone as well.

The reason for nesting routes this particular way is because we are going to place *Navbar* and *Footer* components, above and below the active route, inside the *App* component. Unlike other components, *Navbar* and *Footer* do not change/disappear between route transitions. (See outlined screenshot from **Step 5**)

Lastly, we need to add a URL listener and render the application when it changes. Open *main.js* inside the **<i class="fa fa-folder-open"></i>app** directory that we created earlier and paste the following:

```js
import React from 'react';
import Router from 'react-router';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';

let history = createBrowserHistory();

ReactDOM.render(<Router history={history}>{routes}</Router>, document.getElementById('app'));
```

**October 19, 2015 Update:** `React.render` now lives in the [react-dom](https://www.npmjs.com/package/react-dom) package. `Router.HistoryLocation` is now handled by the [history](https://github.com/rackt/history) package. We use *history* to enable HTML5 History API and to programmatically transition between routes. Routes are now passed in to the `<Router>` component as children instead of prop.

<div class="admonition note">
  <div class="admonition-title">Note</div>
The <em>main.js</em> is the entry point for our React application. We use it in <em>gulpfile.js</em> where Browserify will traverse the entire tree of dependencies and generate the final <em>bundle.js</em> file. You will rarely have to touch this file after its initial setup.
</div>

[React Router](http://rackt.github.io/react-router/) bootstraps the routes from *routes.js* file, matches them against a URL, and then executes the appropriate callback handler, which in this case means rendering a React component into `<div id="app"></div>`. But how does it know which component to render? Well, for example, if we are on `/` URL path, then `{this.props.children}` will render the *Home* component, because that's what we have specified in *routes.js*. We will add more routes shortly.

Also, notice that we are using [`createBrowserHistory`](https://github.com/rackt/history) to enable HTML5 History API in order to make URLs look pretty. For example, it navigates to `http://localhost:3000/add` instead of  `http://localhost:3000/#add`. Since we are building an Isomorphic React application (rendered on the server and the client) we do not have to do any hacky [wildcard redirects on the server](https://github.com/sahat/tvshow-tracker/blob/master/server.js#L343-L345) to enable this support. It just works out of the box.

Let's create one last React component for this section. Create a new file *Home.js* inside **<i class="fa fa-folder-open"></i>app/components** with the following contents:

```js
import React from 'react';

class Home extends React.Component {
  render() {
    return (
      <div className='alert alert-info'>
        Hello from Home Component
      </div>
    );
  }
}

export default Home;
```

Below should be everything we have created up to this point. This would be a good time to double check your code.

![](/images/blog/Screenshot 2015-10-20 01.03.41.png)

One last thing, open *alt.js* in the **<i class="fa fa-folder-open"></i>app** directory and paste the following code. I will explain its purpose in **Step 9** when we actually get to use it.

```js
import Alt from 'alt';

export default new Alt();
```

Now we just need to set up a few more things on the back-end and then we can finally run the app.

## Step 8. React Routes (Server-Side)

Open *server.js* and import the following modules by adding them at the top of the file:

```js
var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var RoutingContext = Router.RoutingContext;
var routes = require('./app/routes');
```

**October 19, 2015 Update:** Previous `React.renderToString` now lives in the [`react-dom/server`](https://www.npmjs.com/package/react-dom#on-the-server) package.

Next, add the following [middleware](http://expressjs.com/guide/using-middleware.html) to *server.js*, somewhere after existing Express middlewares:

```js
app.use(function(req, res) {
  Router.match({ routes: routes, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var html = ReactDOM.renderToString(<RoutingContext {...renderProps} />);
      var page = swig.renderFile('views/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});
```

**October 19, 2015 Update:** Previous `React.renderToString` now lives in the [`react-dom/server`](https://www.npmjs.com/package/react-dom#on-the-server) package. Additionally, server-side rendering with React Router has changed quite a bit. See [Server Rendering Guide](https://github.com/rackt/react-router/blob/f81c8e46883e7838e2790fba14c10a4822e5163a/docs/guides/advanced/ServerRendering.md#server-rendering) for more details.

> **Note:** This screenshot is now outdated as of React 0.14 and React Router 1.0 but I left it here anyway to give you a better idea of where to place this middleware in *server.js*.

![](/images/blog/Screenshot 2015-06-22 22.01.53.png)

This middleware function will be executed on every request to the server, unless a request is handled by one the API endpoints that we will implement shortly.

Conditional statements within the `Router.match` should be self-explanatory. Depending on if we have *500 Error*, *302 Redirect*, *200 Success*, *404 Not Found*, we take different actions. The last two — *200 Success* and *404 Not Found* are usually the most common responses.

On the client-side, a rendered HTML markup gets inserted into `<div id="app"></div>`, while on the server a rendered HTML markup is sent to the *index.html* template where it is inserted into `<div id="app">{% raw %}{{ html|safe }}{% endraw %}</div>` by the [Swig](http://paularmstrong.github.io/swig/) template engine. *I chose Swig because I wanted to try something other than [Jade](http://jade-lang.com/) and [Handlebars](http://handlebarsjs.com/) this time*.

But do we really need a separate template for this? Why not just render everything inside the *App* component? Yes, you could do it, as long as you are okay with [invalid HTML markup](https://validator.w3.org/) and not being able to include inline script tags like Google Analytics directly in the *App* component. But having said that, invalid markup is probably not relevant to SEO anymore and there are [workarounds](https://github.com/hzdg/react-google-analytics/blob/master/src/index.coffee) to include inline script tags in React components. So it's up to you, but for the purposes of this tutorial we will be using a Swig template.

One last thing I need to explain are those JavaScript tripple dots. It is called the ES6 [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) used in `{...renderProps}` above. That's basically like saying "just pass me everything". Since `renderProps` contains multiple things - *routes*, *params*, *components*, *location*, *history*, it would be a hassle to pass them as individual props. Spread operator is a handy shortcut for situations like these.

**October 19, 2015 Update:** Added a new paragraph about the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) and new Router matching conditions.

![](/images/blog/Screenshot 2015-10-20 01.47.04.png)

Create a new folder **<i class="fa fa-folder-open"></i>views** in the project root directory  (next to *package.json* and *server.js*). Then inside **<i class="fa fa-folder-open"></i>views**, create a new file *index.html*:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>New Eden Faces</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,900"/>
  <link rel="stylesheet" href="/css/main.css"/>
</head>
<body>
<div id="app">{% raw %}{{ html|safe }}{% endraw %}</div>
<script src="/js/vendor.js"></script>
<script src="/js/vendor.bundle.js"></script>
<script src="/js/bundle.js"></script>
</body>
</html>
```

Open two Terminal tabs. In one tab run `gulp` to build the app, concatenate vendor files, compile LESS stylesheets and watch for file changes:
![](/images/blog/Screenshot 2015-06-22 22.47.05.png)

In another tab, run `npm run watch` to start the Node.js server and automatically restart the process on file changes:

![](/images/blog/Screenshot 2015-06-22 22.50.23.png)

**July 27, 2015 Update:** Once again, make sure you have installed [nodemon](https://github.com/remy/nodemon) via `sudo npm install -g nodemon` otherwise you will not be able to run the command above.

Open [http://localhost:3000](http://localhost:3000) and you should see our React app render successfully:

![](/images/blog/Screenshot 2015-06-22 22.53.01.png)

We did an impressive amount of work just to display an empty page with a simple alert message! Fortunately, the most difficult part is behind us. From here on we can relax and focus on building React components and implementing the REST API endpoints.

Both `gulp` and `npm run watch` processes will take care of everything for us. We no longer need to worry about re-compiling the app after adding new React components or restarting the Express app after making changes to *server.js*.


## Step 9. Footer and Navbar Components

Both *Navbar* and *Footer* are relatively simple components. The *Footer* component fetches and displays the Top 5 characters. The *Navbar* component fetches and displays the total character count and initializes a Socket.IO event listener for tracking the number of online visitors.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  This section will be slightly longer than the rest since I will be covering  a lot of new concepts that other sections are built upon.
</div>

**<i class="devicons devicons-react"></i> Component**

Create a new file *Footer.js* inside **<i class="fa fa-folder-open"></i>components** directory:

```js
import React from 'react';
import {Link} from 'react-router';
import FooterStore from '../stores/FooterStore'
import FooterActions from '../actions/FooterActions';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = FooterStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    FooterStore.listen(this.onChange);
    FooterActions.getTopCharacters();
  }

  componentWillUnmount() {
    FooterStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    let leaderboardCharacters = this.state.characters.map((character) => {
      return (
        <li key={character.characterId}>
          <Link to={'/characters/' + character.characterId}>
            <img className='thumb-md' src={'http://image.eveonline.com/Character/' + character.characterId + '_128.jpg'} />
          </Link>
        </li>
      )
    });

    return (
      <footer>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-5'>
              <h3 className='lead'><strong>Information</strong> and <strong>Copyright</strong></h3>
              <p>Powered by <strong>Node.js</strong>, <strong>MongoDB</strong> and <strong>React</strong> with Flux architecture and server-side rendering.</p>
              <p>You may view the <a href='https://github.com/sahat/newedenfaces-react'>Source Code</a> behind this project on GitHub.</p>
              <p>© 2015 Sahat Yalkabov.</p>
            </div>
            <div className='col-sm-7 hidden-xs'>
              <h3 className='lead'><strong>Leaderboard</strong> Top 5 Characters</h3>
              <ul className='list-inline'>
                {leaderboardCharacters}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
```

Just this once, I will show an ES5-equivalent code for this component in case you are still not comfortable with the new ES6 syntax. Also, see [Using Alt with ES5](http://alt.js.org/guides/es5/) guide for syntax differences when creating actions and creating stores.

```js
var React = require('react');
var Link = require('react-router').Link;
var FooterStore = require('../stores/FooterStore');
var FooterActions = require('../actions/FooterActions');

var Footer = React.createClass({
  getInitialState: function() {
    return FooterStore.getState();
  }

  componentDidMount: function() {
    FooterStore.listen(this.onChange);
    FooterActions.getTopCharacters();
  }

  componentWillUnmount: function() {
    FooterStore.unlisten(this.onChange);
  }

  onChange: function(state) {
    this.setState(state);
  }

  render() {
    var leaderboardCharacters = this.state.characters.map(function(character) {
      return (
        <li key={character.characterId}>
          <Link to={'/characters/' + character.characterId}>
            <img className='thumb-md' src={'http://image.eveonline.com/Character/' + character.characterId + '_128.jpg'} />
          </Link>
        </li>
      );
    });

    return (
      <footer>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-5'>
              <h3 className='lead'><strong>Information</strong> and <strong>Copyright</strong></h3>
              <p>Powered by <strong>Node.js</strong>, <strong>MongoDB</strong> and <strong>React</strong> with Flux architecture and server-side rendering.</p>
              <p>You may view the <a href='https://github.com/sahat/newedenfaces-react'>Source Code</a> behind this project on GitHub.</p>
              <p>© 2015 Sahat Yalkabov.</p>
            </div>
            <div className='col-sm-7 hidden-xs'>
              <h3 className='lead'><strong>Leaderboard</strong> Top 5 Characters</h3>
              <ul className='list-inline'>
                {leaderboardCharacters}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
});

module.exports = Footer;
```

If you can recall the previous section on Flux architecture, then this should all be familiar to you. When component is loaded it sets the initial component state to whatever is in the *FooterStore* and initialzes a store listener, likewise when component is unloaded (e.g. navigated to a different page) that store listener is removed. When the store is updated, `onChange` function is called, which in turn updates the *Footer's* state.

If by any chance you have used React before, there is something you need to keep in mind when creating React components using ES6 classes. Component methods no longer autobind `this` context. For example, when calling an internal component method that uses `this`, you need to bind `this` explicitly. Previously, `React.createClass()` was doing it for us internally:

> **Autobinding**: When creating callbacks in JavaScript, you usually need to explicitly bind a method to its instance such that the value of **this** is correct. With React, every method is automatically bound to its component instance.

That is why we have the following line in ES6, but not in ES5:

```js
this.onChange = this.onChange.bind(this);
```

Here is a more complete example on this issue:

```js
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = AppStore.getState();
    this.onChange = this.onChange; // Need to add `.bind(this)`.
  }

  onChange(state) {
    // Object `this` will be undefined without binding it explicitly.
    this.setState(state);
  }

  render() {
    return null;
  }
}
```

You may or may not be familiar with the [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method in JavaScript. Even if you have used it before, it may still be unclear how it works in the context of JSX. (Something that [React Tutorial](http://facebook.github.io/react/docs/tutorial.html#hook-up-the-data-model) regretfully does not explain very well.)

It is basically a *for-each* loop, similar to what you might see in [Jade](http://jade-lang.com/reference/iteration/) and [Handlebars](http://handlebarsjs.com/builtin_helpers.html#iteration), but here you can assign the results to a variable, which can then be used with JSX by wrapping it in curly braces. It's a very common pattern in React so you will be using it quite frequently.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  When rendering <a href="https://facebook.github.io/react/docs/multiple-components.html#dynamic-children">dynamic children</a>, such as <code>leaderboardCharacters</code> above, React requires that you use the <code>key</code> property to uniquely identify each child element.
</div>

A [`Link`](http://rackt.github.io/react-router/#Link) component will render a fully accesible anchor tag with the proper *href*. It also knows when the route it links to is active and automatically applies its "active" CSS class. If you are using React Router, then you need to be using `Link` for internal navigation between routes.

**<i class="devicons devicons-react"></i> Actions**

Next, we are going to create actions and a store for the *Footer*  component. Create a new file called *FooterActions.js* in **<i class="fa fa-folder-open"></i>app/actions** directory:

```js
import alt from '../alt';

class FooterActions {
  constructor() {
    this.generateActions(
      'getTopCharactersSuccess',
      'getTopCharactersFail'
    );
  }

  getTopCharacters() {
    $.ajax({ url: '/api/characters/top' })
      .done((data) => {
        this.actions.getTopCharactersSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.getTopCharactersFail(jqXhr)
      });
  }
}

export default alt.createActions(FooterActions);
```

First, notice that we import an instance of Alt (*alt.js* from **Step 7**), not the Alt module installed in **<i class="fa fa-folder-open"></i>node_modules**. It is an instance of Alt which instantiates [Flux dispatcher](http://facebook.github.io/flux/docs/dispatcher.html#content) and provides methods for creating Alt actions and stores. You can think of it as a glue between all of our stores and actions.

We have three actions here - the one that fetches the data using [`jQuery.ajax()`](http://api.jquery.com/jquery.ajax/) and two that notify the store whether that action was successful or unsuccessful. In this particular case, it is not very useful to know when `getTopCharacters` action is fired. What we really want to know is if that action was successful (*update the store, then re-render the component with new data*) or unsuccessful (*display an error notification*).

Actions can be as complex or as simple as you need them to be. Some actions are "actions" themselves, where we don't care what they do or what they send, the fact that action was fired is all we need to know. For example, `ajaxInProgress` and `ajaxComplete` to notify a store when AJAX request is in progress or complete.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  Alt actions can be created via a shorthand notation using <code>generateActions</code> method. From the documentation on <a href="http://alt.js.org/docs/createActions/">Creating Actions</a> — <em>If all of your actions are just straight through dispatches you can shorthand generate them using this function.</em>
</div>


The two shorthand actions above created via `generateActions` and the following two simple actions are equivalent, so use either notation based on your preference:

```js
getTopCharactersSuccess(payload) {
  this.dispatch(payload);
}

getTopCharactersFail(payload) {
  this.dispatch(payload);
}

// Equivalent to this...
this.generateActions(
  'getTopCharactersSuccess',
  'getTopCharactersFail'
);
```

And lastly, we wrap the *FooterActions* class with [`alt.createActions`](http://alt.js.org/docs/createActions/#createActions) and then export it, so that we could import and use it in the *Footer* component.

**<i class="devicons devicons-react"></i> Store**

Next, create a new file called *FooterStore.js* inside **<i class="fa fa-folder-open"></i>app/stores** directory:

```js
import alt from '../alt';
import FooterActions from '../actions/FooterActions';

class FooterStore {
  constructor() {
    this.bindActions(FooterActions);
    this.characters = [];
  }

  onGetTopCharactersSuccess(data) {
    this.characters = data.slice(0, 5);
  }

  onGetTopCharactersFail(jqXhr) {
    // Handle multiple response formats, fallback to HTTP status code number.
    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
  }
}

export default alt.createStore(FooterStore);
```

All instance variables of the store, i.e. values assigned to `this`, will become part of the state. When *Footer* component initially calls `FooterStore.getState()` it receives the current state of the store specified in the constructor (initially just an empty array, and mapping over an empty array returns another empty array, hence nothing is rendered when the *Footer* component is first loaded).

[`bindActions`](http://alt.js.org/docs/createStore/#storemodelbindactions) is a magic Alt method which binds actions to their handlers defined in the store. For example, an action with the name `foo` will match an action handler method defined in the store named `onFoo` or just `foo` but not both. That is why for actions `getTopCharactersSuccess` and `getTopCharactersFail` defined in *FooterActions.js* we have corresponding store handlers called `onGetTopCharactersSuccess` and `onGetTopCharactersFail` in *FooterStore.js*.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  For more precise control over which actions the store listens to and what handlers those actions are bound to, see <a href="http://alt.js.org/docs/createStore/#storemodelbindlisteners"><code>bindListeners</code></a> method.
</div>

I hope it's pretty clear by now that when `getTopCharactersSuccess` action is fired, `onGetTopCharactersSuccess` handler function is executed and the store is updated with the new data that contains *Top 5 Characters*. And since we have initialized the store listener in the *Footer* component, it will be notified when the *FooterStore* has been updated and the component will re-render accordingly.

We will be using [Toastr](http://codeseven.github.io/toastr/demo.html) JavaScript library for notifications. Why not just use pure React notification component you may ask? While you may find some notification components built specifically for React, I personally think it is one of the few areas that should not be handled by React (*along with tooltips*). I think it is far easier to display a notification imperatively from any part of your application than having to declaratively render notification component based on the current state. I have built a notification component with React and Flux before, but frankly it was a big pain dealing with hide/show states, animation and z-index positioning.

Open *App.js* inside **<i class="fa fa-folder-open"></i>app/components** and import the *Footer* component:

```js
import Footer from './Footer';
```

Then add `<Footer />` right after the `{this.props.children}` line:

```html
<div>
  {this.props.children}
  <Footer />
</div>
```

Refresh the browser and you should see the new footer.

![](/images/blog/Screenshot 2015-06-30 12.45.26.png)

We will implement Express API endpoints and populate the database with characters shortly, but for now let's continue on to the *Navbar* component. Since I have already covered the basics behind Alt actions and stores, and how they fit in with our app architecture, this will be a shorter sub-section.

---

**<i class="devicons devicons-react"></i> Component**

Create a new file *Navbar.js* inside **<i class="fa fa-folder-open"></i>app/components** directory:

```js
import React from 'react';
import {Link} from 'react-router';
import NavbarStore from '../stores/NavbarStore';
import NavbarActions from '../actions/NavbarActions';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = NavbarStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    NavbarStore.listen(this.onChange);
    NavbarActions.getCharacterCount();

    let socket = io.connect();

    socket.on('onlineUsers', (data) => {
      NavbarActions.updateOnlineUsers(data);
    });

    $(document).ajaxStart(() => {
      NavbarActions.updateAjaxAnimation('fadeIn');
    });

    $(document).ajaxComplete(() => {
      setTimeout(() => {
        NavbarActions.updateAjaxAnimation('fadeOut');
      }, 750);
    });
  }

  componentWillUnmount() {
    NavbarStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();

    let searchQuery = this.state.searchQuery.trim();

    if (searchQuery) {
      NavbarActions.findCharacter({
        searchQuery: searchQuery,
        searchForm: this.refs.searchForm,
        history: this.props.history
      });
    }
  }

  render() {
    return (
      <nav className='navbar navbar-default navbar-static-top'>
        <div className='navbar-header'>
          <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar'>
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
          </button>
          <Link to='/' className='navbar-brand'>
            <span ref='triangles' className={'triangles animated ' + this.state.ajaxAnimationClass}>
              <div className='tri invert'></div>
              <div className='tri invert'></div>
              <div className='tri'></div>
              <div className='tri invert'></div>
              <div className='tri invert'></div>
              <div className='tri'></div>
              <div className='tri invert'></div>
              <div className='tri'></div>
              <div className='tri invert'></div>
            </span>
            NEF
            <span className='badge badge-up badge-danger'>{this.state.onlineUsers}</span>
          </Link>
        </div>
        <div id='navbar' className='navbar-collapse collapse'>
          <form ref='searchForm' className='navbar-form navbar-left animated' onSubmit={this.handleSubmit.bind(this)}>
            <div className='input-group'>
              <input type='text' className='form-control' placeholder={this.state.totalCharacters + ' characters'} value={this.state.searchQuery} onChange={NavbarActions.updateSearchQuery} />
              <span className='input-group-btn'>
                <button className='btn btn-default' onClick={this.handleSubmit.bind(this)}><span className='glyphicon glyphicon-search'></span></button>
              </span>
            </div>
          </form>
          <ul className='nav navbar-nav'>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/stats'>Stats</Link></li>
            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Top 100 <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link to='/top'>Top Overall</Link></li>
                <li className='dropdown-submenu'>
                  <Link to='/top/caldari'>Caldari</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/top/caldari/achura'>Achura</Link></li>
                    <li><Link to='/top/caldari/civire'>Civire</Link></li>
                    <li><Link to='/top/caldari/deteis'>Deteis</Link></li>
                  </ul>
                </li>
                <li className='dropdown-submenu'>
                  <Link to='/top/gallente'>Gallente</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/top/gallente/gallente'>Gallente</Link></li>
                    <li><Link to='/top/gallente/intaki'>Intaki</Link></li>
                    <li><Link to='/top/gallente/jin-mei'>Jin-Mei</Link></li>
                  </ul>
                </li>
                <li className='dropdown-submenu'>
                  <Link to='/top/minmatar'>Minmatar</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/top/minmatar/brutor'>Brutor</Link></li>
                    <li><Link to='/top/minmatar/sebiestor'>Sebiestor</Link></li>
                    <li><Link to='/top/minmatar/vherokior'>Vherokior</Link></li>
                  </ul>
                </li>
                <li className='dropdown-submenu'>
                  <Link to='/top/amarr'>Amarr</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/top/amarr/amarr'>Amarr</Link></li>
                    <li><Link to='/top/amarr/ni-kunni'>Ni-Kunni</Link></li>
                    <li><Link to='/top/amarr/khanid'>Khanid</Link></li>
                  </ul>
                </li>
                <li className='divider'></li>
                <li><Link to='/shame'>Hall of Shame</Link></li>
              </ul>
            </li>
            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Female <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link to='/female'>All</Link></li>
                <li className='dropdown-submenu'>
                  <Link to='/female/caldari'>Caldari</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/female/caldari/achura'>Achura</Link></li>
                    <li><Link to='/female/caldari/civire/'>Civire</Link></li>
                    <li><Link to='/female/caldari/deteis'>Deteis</Link></li>
                  </ul>
                </li>
                <li className='dropdown-submenu'>
                  <Link to='/female/gallente'>Gallente</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/female/gallente/gallente'>Gallente</Link></li>
                    <li><Link to='/female/gallente/intaki'>Intaki</Link></li>
                    <li><Link to='/female/gallente/jin-mei'>Jin-Mei</Link></li>
                  </ul>
                </li>
                <li className='dropdown-submenu'>
                  <Link to='/female/minmatar'>Minmatar</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/female/minmatar/brutor'>Brutor</Link></li>
                    <li><Link to='/female/minmatar/sebiestor'>Sebiestor</Link></li>
                    <li><Link to='/female/minmatar/vherokior'>Vherokior</Link></li>
                  </ul>
                </li>
                <li className='dropdown-submenu'>
                  <Link to='/female/amarr'>Amarr</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/female/amarr/amarr'>Amarr</Link></li>
                    <li><Link to='/female/amarr/ni-kunni'>Ni-Kunni</Link></li>
                    <li><Link to='/female/amarr/khanid'>Khanid</Link></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Male <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link to='/male'>All</Link></li>
                <li className='dropdown-submenu'>
                  <Link to='/male/caldari'>Caldari</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/male/caldari/achura'>Achura</Link></li>
                    <li><Link to='/male/caldari/civire'>Civire</Link></li>
                    <li><Link to='/male/caldari/deteis'>Deteis</Link></li>
                  </ul>
                </li>
                <li className='dropdown-submenu'>
                  <Link to='/male/gallente'>Gallente</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/male/gallente/gallente'>Gallente</Link></li>
                    <li><Link to='/male/gallente/intaki'>Intaki</Link></li>
                    <li><Link to='/male/gallente/jin-mei'>Jin-Mei</Link></li>
                  </ul>
                </li>
                <li className='dropdown-submenu'>
                  <Link to='/male/minmatar'>Minmatar</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/male/minmatar/brutor'>Brutor</Link></li>
                    <li><Link to='/male/minmatar/sebiestor'>Sebiestor</Link></li>
                    <li><Link to='/male/minmatar/vherokior'>Vherokior</Link></li>
                  </ul>
                </li>
                <li className='dropdown-submenu'>
                  <Link to='/male/amarr'>Amarr</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/male/amarr/amarr'>Amarr</Link></li>
                    <li><Link to='/male/amarr/ni-kunni'>Ni-Kunni</Link></li>
                    <li><Link to='/male/amarr/khanid'>Khanid</Link></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><Link to='/add'>Add</Link></li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
```

**October 19, 2015 Update:** Removed `Navbar.contextTypes` that was previously used to get an instance of the router and removed `getDOMNode()` method call since `this.refs.searchForm` already returns a DOM node now.

Yes it is certainly possible to write most of the above markup dynamically with less lines of code by iterating through all races, then through all bloodlines, however, this was one of those things that I copy & pasted from my original project and didn't want to focus on too much.

~~One thing you will probably notice right away is the class variable `contextTypes`. We need it for referencing an instance of the router, which in turn gives us access to current *path*, current *query parameters*, *route parameters* and *transitions* to other routes.~~ Now the `history` object (navigation) will be passed as a prop from the *App* component. We actually do not use it directly in the *Navbar* component but instead pass it as an argument to *Navbar* actions so that it could navigate to a particular character profile page from the *Navbar* store, after successfully fetching data from the server. We obviously cannot navigate from within the component since no action has been fired yet and no character data has been received. There are certainly other ways to get `history` or `router` object references inside a Flux store, but this is the least complicated solution I could think of.

![](/images/blog/Screenshot 2015-07-02 17.06.40.png)

`componentDidMount` is where we establish connection with Socket.IO and initialize [`ajaxStart`](https://api.jquery.com/ajaxStart/) and [`ajaxComplete`](http://api.jquery.com/ajaxcomplete/) event listeners used for fading in/out the loading indicator on AJAX requests, which is located next to the **NEF** logo.

<style>
.triangles {
  display: inline-block;
  height: 27px;
  width: 30px;
  transform: translate(-50%, -50%);
}
.navbar-brand:hover .tri {
  animation-play-state: paused;
}
.tri {
  position: absolute;
  animation: pulse 750ms ease-in infinite;
  border-top: 9px solid #363f34;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 0;
}
.tri.invert {
  border-top: 0;
  border-bottom: 9px solid #363f34;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
}
.tri:nth-child(1) {
  left: 10px;
}
.tri:nth-child(2) {
  left: 5px;
  top: 9px;
  animation-delay: -125ms;
}
.tri:nth-child(3) {
  left: 10px;
  top: 9px;
}
.tri:nth-child(4) {
  left: 15px;
  top: 9px;
  animation-delay: -625ms;
}
.tri:nth-child(5) {
  top: 18px;
  animation-delay: -250ms;
}
.tri:nth-child(6) {
  top: 18px;
  left: 5px;
  animation-delay: -250ms;
}
.tri:nth-child(7) {
  top: 18px;
  left: 10px;
  animation-delay: -375ms;
}
.tri:nth-child(8) {
  top: 18px;
  left: 15px;
  animation-delay: -500ms;
}
.tri:nth-child(9) {
  top: 18px;
  left: 20px;
  animation-delay: -500ms;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  16.666% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-webkit-keyframes pulse {
  0% {
    opacity: 1;
  }
  16.666% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-moz-keyframes pulse {
  0% {
    opacity: 1;
  }
  16.666% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>

<div class='text-center'>
  <div class='triangles'>
    <div class='tri invert'></div>
    <div class='tri invert'></div>
    <div class='tri'></div>
    <div class='tri invert'></div>
    <div class='tri invert'></div>
    <div class='tri'></div>
    <div class='tri invert'></div>
    <div class='tri'></div>
    <div class='tri invert'></div>
  </div>
</div>

`handleSubmit` is a form submit handler that gets executed by pressing the *Enter* key or clicking the *<i class="fa fa-search"></i> (Search)* button. It essentially does some input cleanup and validation, then fires the `findCharacter` action. In addition to the search query and the router instance, we also pass a reference to the search field DOM Node so that we could display a shaking animation when a character name is not found.


**<i class="devicons devicons-react"></i> Actions**

Let's create a new file *NavbarActions.js* in the **<i class="fa fa-folder-open"></i>app/actions** directory:

```js
import alt from '../alt';
import {assign} from 'underscore';

class NavbarActions {
  constructor() {
    this.generateActions(
      'updateOnlineUsers',
      'updateAjaxAnimation',
      'updateSearchQuery',
      'getCharacterCountSuccess',
      'getCharacterCountFail',
      'findCharacterSuccess',
      'findCharacterFail'
    );
  }

  findCharacter(payload) {
    $.ajax({
      url: '/api/characters/search',
      data: { name: payload.searchQuery }
    })
      .done((data) => {
        assign(payload, data);
        this.actions.findCharacterSuccess(payload);
      })
      .fail(() => {
        this.actions.findCharacterFail(payload);
      });
  }

  getCharacterCount() {
    $.ajax({ url: '/api/characters/count' })
      .done((data) => {
        this.actions.getCharacterCountSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.getCharacterCountFail(jqXhr)
      });
  }
}

export default alt.createActions(NavbarActions);
```

Most of these actions should be pretty self-explanatory, but if it is unclear, see brief descriptions below.

| Action                     | Description   |
| -------------------------- |:-------------:|
| `updateOnlineUsers`        | Sets online users count on Socket.IO event update. |
| `updateAjaxAnimation`      | Adds "fadeIn" or "fadeOut" CSS class to the loading indicator. |
| `updateSearchQuery`        | Update search query value on keypress. |
| `getCharacterCount`        | Fetch total number of characters from the server. |
| `getCharacterCountSuccess` | Returns total number of characters. |
| `getCharacterCountFail`    | Returns jQuery [`jqXhr`](http://api.jquery.com/jQuery.ajax/#jqXHR) object. |
| `findCharacter`            | Find a character by name. |

The reason why we add the `shake` CSS class and then remove it one second later is so that we could repeat this animation, otherwise if we just keep on adding the `shake` it will not animate again.


**<i class="devicons devicons-react"></i> Store**

Create a new file *NavbarStore.js* in the **<i class="fa fa-folder-open"></i>app/stores** directory:

```js
import alt from '../alt';
import NavbarActions from '../actions/NavbarActions';

class NavbarStore {
  constructor() {
    this.bindActions(NavbarActions);
    this.totalCharacters = 0;
    this.onlineUsers = 0;
    this.searchQuery = '';
    this.ajaxAnimationClass = '';
  }

  onFindCharacterSuccess(payload) {
    payload.history.pushState(null, '/characters/' + payload.characterId);
  }

  onFindCharacterFail(payload) {
    payload.searchForm.classList.add('shake');
    setTimeout(() => {
      payload.searchForm.classList.remove('shake');
    }, 1000);
  }

  onUpdateOnlineUsers(data) {
    this.onlineUsers = data.onlineUsers;
  }

  onUpdateAjaxAnimation(className) {
    this.ajaxAnimationClass = className; //fadein or fadeout
  }

  onUpdateSearchQuery(event) {
    this.searchQuery = event.target.value;
  }

  onGetCharacterCountSuccess(data) {
    this.totalCharacters = data.count;
  }

  onGetCharacterCountFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(NavbarStore);
```

**October 19, 2015 Update:** Changed [`router.transitionTo`](https://github.com/rackt/react-router/blob/master/UPGRADE_GUIDE.md#navigation-mixin) to [`history.pushState`](https://github.com/rackt/react-router/blob/master/UPGRADE_GUIDE.md#navigation-mixin) for page navigation.

Recall this line in the *Navbar* component that we created above:

```html
<input type='text' className='form-control' placeholder={this.state.totalCharacters + ' characters'} value={this.state.searchQuery} onChange={NavbarActions.updateSearchQuery} />
```

Since [`onChange`](https://facebook.github.io/react/docs/forms.html#interactive-props) handler returns and *event* object, we are using `event.target.value` to get the text field value inside `onUpdateSearchQuery` function.

Open **App.js** again and import the *Navbar* component:

```js
import Navbar from './Navbar';
```

Then add `<Navbar />` right before the `this.props.children` component:

```html
<div>
  <Navbar history={this.props.history} />
  {this.props.children}
  <Footer />
</div>
```

**October 19, 2015 Update:** If you recall, we created a `history` object via `createBrowserHistory` inside *main.js* and passed it as a prop to the `<Router>`. That's why this prop is available in the *App.js* component. Here, we are just passing it even further down to the *Navbar* component.

![](/images/blog/Screenshot 2015-07-04 13.02.12.png)

Since we haven't yet configured Socket.IO on the server or implemented any of the API routes, you will not see the total number of online visitors (*red circle next to the logo*) or total characters (*search placeholder text*).

## Step 10. Socket.IO - Real-time User Count

Unlike the previous section, this one will be fairly short and focused specifically on the server-side aspect of Socket.IO.

Open *server.js* and find the following line:

```js
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
```

Then replace it with the following code:

```js
/**
 * Socket.io stuff.
 */
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var onlineUsers = 0;

io.sockets.on('connection', function(socket) {
  onlineUsers++;

  io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

  socket.on('disconnect', function() {
    onlineUsers--;
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
  });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
```

In a nutshell, when a WebSocket connection is established, it increments the `onlineUsers` count (global variable) and broadcasts a message — *"Hey, I have this many online visitors now."*. When someone closes the browser and leaves, the `onlineUsers` count is decremented and it yet again broadcasts a message *"Hey, someone just left, I have this many online visitors now."*.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  If you have never used Socket.IO then <a href="http://socket.io/get-started/chat/">Chat application</a> tutorial is a great starting point.
</div>

Open *index.html* in the **<i class="fa fa-folder-open"></i>views** directory and add the following line right next with other scripts:

```html
<script src="/socket.io/socket.io.js"></script>
```

![](/images/blog/Screenshot 2015-07-04 13.02.15.png)

Refresh the browser and open http://localhost:3000 in multiple tabs to simulate multiple user connections. You should now see the total number of visitors in the red circle next to the logo.


![](/images/blog/Screenshot 2015-07-04 13.25.42.png)

At this point we are neither finished with the front-end nor do we have any working API endpoints. We could have focused on building just the front-end in the first half of the tutorial and then the back-end in the second half of the tutorial, or vice versa, but personally, I have never built an app like that. I typically go back and forth between back-end and front-end parts of the application during my development flow.

We can't display any characters until they are added to the database. In order to add new characters to the database we need to build a UI for it and implement an API endpoint. That's exactly what we will do next.

## Step 11. Add Character Component

This component consists of a simple form with a text field, radio buttons and a submit button. Success and error messages will be displayed within [`help-block`](http://getbootstrap.com/css/#forms-help-text) under the text field.

**<i class="devicons devicons-react"></i> Component**

Create a new file *AddCharacter.js* in **<i class="fa fa-folder-open"></i>app/components** directory:

```js
import React from 'react';
import AddCharacterStore from '../stores/AddCharacterStore';
import AddCharacterActions from '../actions/AddCharacterActions';

class AddCharacter extends React.Component {
  constructor(props) {
    super(props);
    this.state = AddCharacterStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    AddCharacterStore.listen(this.onChange);
  }

  componentWillUnmount() {
    AddCharacterStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();

    var name = this.state.name.trim();
    var gender = this.state.gender;

    if (!name) {
      AddCharacterActions.invalidName();
      this.refs.nameTextField.getDOMNode().focus();
    }

    if (!gender) {
      AddCharacterActions.invalidGender();
    }

    if (name && gender) {
      AddCharacterActions.addCharacter(name, gender);
    }
  }

  render() {
    return (
      <div className='container'>
        <div className='row flipInX animated'>
          <div className='col-sm-8'>
            <div className='panel panel-default'>
              <div className='panel-heading'>Add Character</div>
              <div className='panel-body'>
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <div className={'form-group ' + this.state.nameValidationState}>
                    <label className='control-label'>Character Name</label>
                    <input type='text' className='form-control' ref='nameTextField' value={this.state.name}
                           onChange={AddCharacterActions.updateName} autoFocus/>
                    <span className='help-block'>{this.state.helpBlock}</span>
                  </div>
                  <div className={'form-group ' + this.state.genderValidationState}>
                    <div className='radio radio-inline'>
                      <input type='radio' name='gender' id='female' value='Female' checked={this.state.gender === 'Female'}
                             onChange={AddCharacterActions.updateGender}/>
                      <label htmlFor='female'>Female</label>
                    </div>
                    <div className='radio radio-inline'>
                      <input type='radio' name='gender' id='male' value='Male' checked={this.state.gender === 'Male'}
                             onChange={AddCharacterActions.updateGender}/>
                      <label htmlFor='male'>Male</label>
                    </div>
                  </div>
                  <button type='submit' className='btn btn-primary'>Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddCharacter;
```

You should start to see by now what all these components have in common:

1. Set the initial component state to what's in the store.
2. Add a store listener in `componentDidMount`, remove it in `componentWillUnmount`.
3. Add `onChange` method which updates component's state whenever the store is updated.

`handleSubmit` does exactly what you might think — handles the form submission for adding a new character. While it is true that we could have done form validation inside `addCharacter` action instead, however, doing so would also require us to pass the text field DOM reference, because when `nameTextField` is invalid, it needs to be "focused" so that a user can start typing again without having to click the text field.

![](/images/blog/Screenshot 2015-07-10 01.23.19.png)

**<i class="devicons devicons-react"></i> Actions**

Create a new file *AddCharacterActions.js* in **<i class="fa fa-folder-open"></i>app/actions** directory:

```js
import alt from '../alt';

class AddCharacterActions {
  constructor() {
    this.generateActions(
      'addCharacterSuccess',
      'addCharacterFail',
      'updateName',
      'updateGender',
      'invalidName',
      'invalidGender'
    );
  }

  addCharacter(name, gender) {
    $.ajax({
      type: 'POST',
      url: '/api/characters',
      data: { name: name, gender: gender }
    })
      .done((data) => {
        this.actions.addCharacterSuccess(data.message);
      })
      .fail((jqXhr) => {
        this.actions.addCharacterFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(AddCharacterActions);
```

We are firing `addCharacterSuccess` action when character has been added to the database successfully and `addCharacterFail` when character could not be added, perhaps due to an invalid name or because it already exists in the database. Both `updateName` and `updateGender` actions are fired when the *Character Name* text field and *Gender* radio button is updated via `onChange`, respectively. And likewise, `invalidName` and `invalidGender` actions are fired when you a user submits the form without entering a name or selecting a gender.


**<i class="devicons devicons-react"></i> Store**

Create a new file *AddCharacterStore.js* in **<i class="fa fa-folder-open"></i>app/stores** directory:

```js
import alt from '../alt';
import AddCharacterActions from '../actions/AddCharacterActions';

class AddCharacterStore {
  constructor() {
    this.bindActions(AddCharacterActions);
    this.name = '';
    this.gender = '';
    this.helpBlock = '';
    this.nameValidationState = '';
    this.genderValidationState = '';
  }

  onAddCharacterSuccess(successMessage) {
    this.nameValidationState = 'has-success';
    this.helpBlock = successMessage;
  }

  onAddCharacterFail(errorMessage) {
    this.nameValidationState = 'has-error';
    this.helpBlock = errorMessage;
  }

  onUpdateName(event) {
    this.name = event.target.value;
    this.nameValidationState = '';
    this.helpBlock = '';
  }

  onUpdateGender(event) {
    this.gender = event.target.value;
    this.genderValidationState = '';
  }

  onInvalidName() {
    this.nameValidationState = 'has-error';
    this.helpBlock = 'Please enter a character name.';
  }

  onInvalidGender() {
    this.genderValidationState = 'has-error';
  }
}

export default alt.createStore(AddCharacterStore);
```

`nameValidationState` and `genderValidationState` refers to the [validation states](http://getbootstrap.com/css/#forms-control-validation) on form controls provided by Bootstrap.  

`helpBlock` is a status message which gets displayed below the text field, e.g. *Character has been added successfully*.

`onInvalidName` handler is fired when *Character Name* field is empty. If the name does not exist in EVE Online database it will be a different error message provided by `onAddCharacterFail` handler.

Finally, open *routes.js* and add a new route `/add` with the `AddCharacter` component handler:

```js
import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import AddCharacter from './components/AddCharacter';

export default (
  <Route handler={App}>
    <Route path='/' handler={Home} />
    <Route path='/add' handler={AddCharacter} />
  </Route>
);
```



Here is a quick demonstration of the entire flow from the moment you start typing a character's name:

1. Fire `updateName` action, passing the *event* object as its payload.
2. Call `onUpdateName` store handler.
3. Update the state with the new name.

![](/images/blog/Screenshot 2015-07-15 15.34.55.png)

In the next few sections we will implement the back-end code for adding and saving new characters to the database.



## Step 12. Database Schema

In the top-level directory (next to *package.json* and *server.js* files) create a new folder **<i class="fa fa-folder-open"></i>models**, then inside create a new file *character.js* and paste the following:

```js
var mongoose = require('mongoose');

var characterSchema = new mongoose.Schema({
  characterId: { type: String, unique: true, index: true },
  name: String,
  race: String,
  gender: String,
  bloodline: String,
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  reports: { type: Number, default: 0 },
  random: { type: [Number], index: '2d' },
  voted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Character', characterSchema);
```

![](/images/blog/Screenshot 2015-07-10 17.04.51.png)

A schema is just a representation of your data in MongoDB. This is where you can enforce a certain field to be of particular type. A field can also be required, unique or contain only specified characters.

While a schema is just an abstract representation of the data, a model on the other hand is a more practical object with methods to query, remove, update and save data from/to MongoDB. Above, we create a `Character` model and immediately export it.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  Why yet another tutorial using MongoDB? Why not use MySQL, PostgreSQL, CouchDB or even <a href="http://rethinkdb.com/">RethinkDB</a>? That's because I don't really care enough about the database layer for the types of apps I am building. I would much rather focus on the front-end stack, because that's one of my primary interests, not databases. MongoDB may not best-suited for all use cases, but it's a decent general-purpose database and it has worked well for me in the past 3 years.
</div>

Most of these fields are pretty self-explanatory, but `random` and `voted` may need some context:

 - `random` - an array of two numbers generated by `[Math.random(), 0]`. It is a [geospatial](http://docs.mongodb.org/manual/applications/geospatial-indexes/) point as far as MongoDB is concerned. In order to grab a random character from the database we are going to use the [`$near`](http://docs.mongodb.org/manual/reference/operator/query/near/) operator. I found about this "trick" from [Random record from MongoDB](http://stackoverflow.com/questions/2824157/random-record-from-mongodb) on StackOverflow.
 - `voted` - a boolean for identifying which characters have already been voted. Previously, people were abusing the website by voting for the same character multiple times in a row. But now, when querying for two characters, only those characters that have not been voted will be fetched. Even if someone were to hit the API directly, a vote will not count for already voted characters.

Back in *server.js*, add the following lines at the beginning of the file, along with all other module dependencies:

```js
var mongoose = require('mongoose');
var Character = require('./models/character');
```

Just to be consistent and systematic, I usually organize my module imports in the following order:

1. Core Node.js modules — *path*, *querystring*, *http*.
2. Third-party NPM libraries — *mongoose*, *express*, *request*.
3. Application files — *controllers*, *models*, *config*.

And finally, to connect to the database, add the following code somewhere between module dependencies and Express middlewares. This will establish a connection pool with MongoDB when we start the Express app.

```js
mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});
```

<div class="admonition note">
  <div class="admonition-title">Note</div>
  We will set the database hostname in <em>config.js</em> to avoid hard-coding the value here.
</div>

Create another file in the top-level directory called *config.js* and paste the following:

```js
module.exports = {
  database: process.env.MONGO_URI || 'localhost'
};
```

It will use an environment variable (if available) and fallback to "localhost". Using this approach allows us to use one hostname for local development and another hostname for production without updating any code, and it is especially useful when [dealing with OAuth client keys and client secrets](https://github.com/sahat/hackathon-starter/blob/master/config/secrets.js).

Now let's import it back in *server.js*:

```js
var config = require('./config');
```

Open a new tab in Terminal and run `mongod`. If you are on Windows, you will need to open *mongod.exe* in the directory where you installed MongoDB.

![](/images/blog/Screenshot 2015-07-13 13.40.40.png)

## Step 13. Express API Routes (1 of 2)

In this section we will implement an Express route for fetching character information and storing it in database. We will be using [EVE Online API](http://wiki.eve-id.net/APIv2_Page_Index) for fetching *Character ID*, *Race* and *Bloodline* for a given character name.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  Character gender is not a public data; it requires an API key. In my opinion, what makes New Eden Faces so great is its open nature - a user does not need to be authenticated and anyone can add any other character to the roster. That is why we have two radio buttons for gender selection on the <em>Add Character</em> page. It does depend on user's honesty, however.
</div>

Below is a table that outlines each route's responsibility. However, we will not be implementing all routes, because that is something you can do on your own if necessary.

| Route          | POST    | GET       | PUT      | DELETE  |
| -------------- |:---------------:| -----------------:| -----------------:| -----------------:|
| */api/characters*     | Add a new character | Get random two characters  | Update wins/losses for two characters | Delete all characters |
| */api/characters/:id* | N/A  | Get a character   | Update a character  | Delete a character |


In *server.js* add the following dependencies at the top:

```js
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');
```

We will use [async.waterfall](https://github.com/caolan/async#waterfalltasks-callback) for managing multiple asynchronous operations and [request](https://github.com/request/request) module for making HTTP requests to the EVE Online API.

Add our first route right after Express middlewares but before the "React middleware" that we created earlier in **Step 8. React Routes (Server-Side)**.

```js
/**
 * POST /api/characters
 * Adds new character to the database.
 */
app.post('/api/characters', function(req, res, next) {
  var gender = req.body.gender;
  var characterName = req.body.name;
  var characterIdLookupUrl = 'https://api.eveonline.com/eve/CharacterID.xml.aspx?names=' + characterName;

  var parser = new xml2js.Parser();

  async.waterfall([
    function(callback) {
      request.get(characterIdLookupUrl, function(err, request, xml) {
        if (err) return next(err);
        parser.parseString(xml, function(err, parsedXml) {
          if (err) return next(err);
          try {
            var characterId = parsedXml.eveapi.result[0].rowset[0].row[0].$.characterID;

            Character.findOne({ characterId: characterId }, function(err, character) {
              if (err) return next(err);

              if (character) {
                return res.status(409).send({ message: character.name + ' is already in the database.' });
              }

              callback(err, characterId);
            });
          } catch (e) {
            return res.status(400).send({ message: 'XML Parse Error' });
          }
        });
      });
    },
    function(characterId) {
      var characterInfoUrl = 'https://api.eveonline.com/eve/CharacterInfo.xml.aspx?characterID=' + characterId;

      request.get({ url: characterInfoUrl }, function(err, request, xml) {
        if (err) return next(err);
        parser.parseString(xml, function(err, parsedXml) {
          if (err) return res.send(err);
          try {
            var name = parsedXml.eveapi.result[0].characterName[0];
            var race = parsedXml.eveapi.result[0].race[0];
            var bloodline = parsedXml.eveapi.result[0].bloodline[0];

            var character = new Character({
              characterId: characterId,
              name: name,
              race: race,
              bloodline: bloodline,
              gender: gender,
              random: [Math.random(), 0]
            });

            character.save(function(err) {
              if (err) return next(err);
              res.send({ message: characterName + ' has been added successfully!' });
            });
          } catch (e) {
            res.status(404).send({ message: characterName + ' is not a registered citizen of New Eden.' });
          }
        });
      });
    }
  ]);
});
```

<div class="admonition note">
  <div class="admonition-title">Note</div>
  I typically add block comments above my routes specifying the full path and a brief description. This allows me to quickly find the routes I am looking for using the <strong>Find...(⌘F)</strong> command as shown below.
</div>

![](/images/blog/Screenshot 2015-07-15 09.31.03.png)

Here is a step-by-step breakdown of how it works:

1. Get a *Character ID* from a *Character Name*.
  ![](/images/blog/Screenshot 2015-07-14 19.39.00.png)
2. Parse XML response.
3. Query the database to check if this character is already in the database.
4. Pass *Character ID* to the next function in the [`async.waterfall`](https://github.com/caolan/async#waterfall) stage.
5. Get basic character information from a *Character ID*.
  ![](/images/blog/Screenshot 2015-07-14 19.49.46.png)
6. Parse XML response.
7. Add a new character to the database.

Go to http://localhost:3000/add then add a few characters. You could use some of the following names:

- Daishan Auergni
- CCP Falcon
- Celeste Taylor

![](/images/blog/Screenshot 2015-07-15 14.05.53.png)

Or better yet, download this MongoDB file dump that contains over 4000 characters and import it into your database. Please ignore "duplicate key errors" if you have already added some of the characters earlier.

- [<i class="fa fa-cloud-download"></i> newedenfaces.bson](https://dl.dropboxusercontent.com/u/14131013/newedenfaces.bson)

And then run this command to import the *characters* collection into MongoDB:

```bash
$ mongorestore newedenfaces.bson -d nef -c characters
```

**October 11, 2015 Update:** Use explicit *database* and *collection* flags in the command above.

You will not see updated character count in the search field just yet, since we haven't implemented an API endpoint for it. We will do that after the next section.

Next, let's create the *Home* component - initial page that displays 2 characters side by side.

## Step 15. Home Component

This is one of the simpler components whose only responsibility is to display 2 images and handle click events to know which one is the winning and which one is the losing character between the two.

**<i class="devicons devicons-react"></i> Component**

Create a new file *Home.js* inside **<i class="fa fa-folder-open"></i>components** directory:

```js
import React from 'react';
import {Link} from 'react-router';
import HomeStore from '../stores/HomeStore'
import HomeActions from '../actions/HomeActions';
import {first, without, findWhere} from 'underscore';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = HomeStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    HomeStore.listen(this.onChange);
    HomeActions.getTwoCharacters();
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleClick(character) {
    var winner = character.characterId;
    var loser = first(without(this.state.characters, findWhere(this.state.characters, { characterId: winner }))).characterId;
    HomeActions.vote(winner, loser);
  }

  render() {
    var characterNodes = this.state.characters.map((character, index) => {
      return (
        <div key={character.characterId} className={index === 0 ? 'col-xs-6 col-sm-6 col-md-5 col-md-offset-1' : 'col-xs-6 col-sm-6 col-md-5'}>
          <div className='thumbnail fadeInUp animated'>
            <img onClick={this.handleClick.bind(this, character)} src={'http://image.eveonline.com/Character/' + character.characterId + '_512.jpg'}/>
            <div className='caption text-center'>
              <ul className='list-inline'>
                <li><strong>Race:</strong> {character.race}</li>
                <li><strong>Bloodline:</strong> {character.bloodline}</li>
              </ul>
              <h4>
                <Link to={'/characters/' + character.characterId}><strong>{character.name}</strong></Link>
              </h4>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className='container'>
        <h3 className='text-center'>Click on the portrait. Select your favorite.</h3>
        <div className='row'>
          {characterNodes}
        </div>
      </div>
    );
  }
}

export default Home;
```

**July 27, 2015 Update:** Fixed the error *Cannot read property 'characterId' of undefined*. I have updated how the "losing" Character ID is obtained inside `handleClick()` method. It uses [`_.findWhere`](http://underscorejs.org/#findWhere) to find the "winning" character object within the array, then using [`_.without`](http://underscorejs.org/#without) we get a new array without the "winning" character. Since we only have 2 characters in the array, the other object must be the "losing" character. And finally, using [`_.first`](http://underscorejs.org/#first) we get the first (and only) object in the array.

It is not really necessary to map over the `characters` array since we only have 2 characters to display, but it is one way to do it. Another way would be to create a separate markup for `characters[0]` and `characters[1]` like so:

```js
render() {
    return (
      <div className='container'>
        <h3 className='text-center'>Click on the portrait. Select your favorite.</h3>
        <div className='row'>
          <div className='col-xs-6 col-sm-6 col-md-5 col-md-offset-1'>
            <div className='thumbnail fadeInUp animated'>
              <img onClick={this.handleClick.bind(this, characters[0])} src={'http://image.eveonline.com/Character/' + characters[0].characterId + '_512.jpg'}/>
              <div className='caption text-center'>
                <ul className='list-inline'>
                  <li><strong>Race:</strong> {characters[0].race}</li>
                  <li><strong>Bloodline:</strong> {characters[0].bloodline}</li>
                </ul>
                <h4>
                  <Link to={'/characters/' + characters[0].characterId}><strong>{characters[0].name}</strong></Link>
                </h4>
              </div>
            </div>
          </div>
          <div className='col-xs-6 col-sm-6 col-md-5'>
            <div className='thumbnail fadeInUp animated'>
              <img onClick={this.handleClick.bind(this, characters[1])} src={'http://image.eveonline.com/Character/' + characters[1].characterId + '_512.jpg'}/>
              <div className='caption text-center'>
                <ul className='list-inline'>
                  <li><strong>Race:</strong> {characters[1].race}</li>
                  <li><strong>Bloodline:</strong> {characters[1].bloodline}</li>
                </ul>
                <h4>
                  <Link to={'/characters/' + characters[1].characterId}><strong>{characters[1].name}</strong></Link>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  ```

The first image is offset via `col-md-offset-1` Bootstrap CSS class so both images are perfectly center-aligned.

Notice we are not just binding `this.handleClick` to a click event, but instead we do `{this.handleClick.bind(this, character)`. Simply passing an *event* object is not enough, it will not give us any useful information, unlike text field, checkbox or radio button group elements.

From the [MSDN Documentation](https://msdn.microsoft.com/en-us/library/ff841995%28v=vs.94%29.ASPx?f=255&MSPPError=-2147217396):

```js
function.bind(thisArg[, arg1[, arg2[, ...]]])
```

- **thisArg (Required)** - An object to which the `this` keyword can refer inside the new function.
- **arg1, arg2, ... (Optional)** - A list of arguments to be passed to the new function.

To put it simply, we need to pass `this` context because we are referencing `this.state` inside `handleClick` method, we are passing a custom object containing character information that was clicked instead of the default *event* object.

Inside `handleClick` method, the `character` parameter is our winning character, because that's the character that was clicked on. Since we only have two characters it is not that hard to figure out the losing character. We then pass both `winner` and `loser` *Character IDs* to the `HomeActions.vote` action.

**<i class="devicons devicons-react"></i> Actions**

Create a new file *HomeActions.js* inside **<i class="fa fa-folder-open"></i>actions** directory:

```js
import alt from '../alt';

class HomeActions {
  constructor() {
    this.generateActions(
      'getTwoCharactersSuccess',
      'getTwoCharactersFail',
      'voteFail'
    );
  }

  getTwoCharacters() {
    $.ajax({ url: '/api/characters' })
      .done(data => {
        this.actions.getTwoCharactersSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.getTwoCharactersFail(jqXhr.responseJSON.message);
      });
  }

  vote(winner, loser) {
    $.ajax({
      type: 'PUT',
      url: '/api/characters' ,
      data: { winner: winner, loser: loser }
    })
      .done(() => {
        this.actions.getTwoCharacters();
      })
      .fail((jqXhr) => {
        this.actions.voteFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(HomeActions);
```

We do not need `voteSuccess` action here because `getTwoCharacters` already does exactly what we need. In other words, after a successful vote, we need to fetch two more random characters from the database.

**<i class="devicons devicons-react"></i> Store**

Create a new file *HomeStore.js* inside **<i class="fa fa-folder-open"></i>stores** directory:

```js
import alt from '../alt';
import HomeActions from '../actions/HomeActions';

class HomeStore {
  constructor() {
    this.bindActions(HomeActions);
    this.characters = [];
  }

  onGetTwoCharactersSuccess(data) {
    this.characters = data;
  }

  onGetTwoCharactersFail(errorMessage) {
    toastr.error(errorMessage);
  }

  onVoteFail(errorMessage) {
    toastr.error(errorMessage);
  }
}

export default alt.createStore(HomeStore);
```

Next, let's implement the remaining Express routes for fetching and updating two characters in *Home* component, retrieving total characters count and more.
<!-- And there you have it. Refresh the browser once again and you should see two character images on the home page. Try clicking on one of them. After clicking on one of the images you should see a new set of characters appear. -->

## Step 14. Express API Routes (2 of 2)

Switch back to *server.js*. I hope it is clear by now where you need to include all of the following routes - after Express middlewares but before the "React middleware".

<div class="admonition note">
  <div class="admonition-title">Note</div>
  Understand that we are including all routes in <em>server.js</em> because it is convenient to do so for the purposes of this tutorial. In the dashboard project that I had to build at work, all routes were split into separate files inside the <strong><i class="fa fa-folder-open"></i>routes</strong> directory, furthermore all route handlers were split into separate files inside the <strong><i class="fa fa-folder-open"></i>controllers</strong> directory.
</div>

Let's start with the route for fetching two characters in the *Home* component.

**GET /api/characters**

```js
/**
 * GET /api/characters
 * Returns 2 random characters of the same gender that have not been voted yet.
 */
app.get('/api/characters', function(req, res, next) {
  var choices = ['Female', 'Male'];
  var randomGender = _.sample(choices);

  Character.find({ random: { $near: [Math.random(), 0] } })
    .where('voted', false)
    .where('gender', randomGender)
    .limit(2)
    .exec(function(err, characters) {
      if (err) return next(err);

      if (characters.length === 2) {
        return res.send(characters);
      }

      var oppositeGender = _.first(_.without(choices, randomGender));

      Character
        .find({ random: { $near: [Math.random(), 0] } })
        .where('voted', false)
        .where('gender', oppositeGender)
        .limit(2)
        .exec(function(err, characters) {
          if (err) return next(err);

          if (characters.length === 2) {
            return res.send(characters);
          }

          Character.update({}, { $set: { voted: false } }, { multi: true }, function(err) {
            if (err) return next(err);
            res.send([]);
          });
        });
    });
});
```
Be sure to add the [Underscore.js](http://underscorejs.org) module at the top, since we are using it for [`_.sample()`](http://underscorejs.org/#sample), [`_.first()`](http://underscorejs.org/#first) and [`_.without()`](http://underscorejs.org/#without) functions:

```js
var _ = require('underscore');
```

I have tried to make this code as readable as possible, so it should be fairly easy to understand how it fetches two random characters. It will randomly select *Male* or *Female* gender and query the database for two characters. If we get back less than 2 characters, it will attempt another query with the opposite gender. For example, if we have 10 male characters and 9 of them have already been voted, displaying 1 character makes no sense. If don't get back 2 characters for either *Male* or *Female* gender, that means we have exhausted all unvoted characters and the vote count should be reset by setting `voted: false` for all characters.

---

**PUT /api/characters**

This route is related to the previous one since it updates `wins` and `losses` fields of winning and losing characters respectively.

```js
/**
 * PUT /api/characters
 * Update winning and losing count for both characters.
 */
app.put('/api/characters', function(req, res, next) {
  var winner = req.body.winner;
  var loser = req.body.loser;

  if (!winner || !loser) {
    return res.status(400).send({ message: 'Voting requires two characters.' });
  }

  if (winner === loser) {
    return res.status(400).send({ message: 'Cannot vote for and against the same character.' });
  }

  async.parallel([
      function(callback) {
        Character.findOne({ characterId: winner }, function(err, winner) {
          callback(err, winner);
        });
      },
      function(callback) {
        Character.findOne({ characterId: loser }, function(err, loser) {
          callback(err, loser);
        });
      }
    ],
    function(err, results) {
      if (err) return next(err);

      var winner = results[0];
      var loser = results[1];

      if (!winner || !loser) {
        return res.status(404).send({ message: 'One of the characters no longer exists.' });
      }

      if (winner.voted || loser.voted) {
        return res.status(200).end();
      }

      async.parallel([
        function(callback) {
          winner.wins++;
          winner.voted = true;
          winner.random = [Math.random(), 0];
          winner.save(function(err) {
            callback(err);
          });
        },
        function(callback) {
          loser.losses++;
          loser.voted = true;
          loser.random = [Math.random(), 0];
          loser.save(function(err) {
            callback(err);
          });
        }
      ], function(err) {
        if (err) return next(err);
        res.status(200).end();
      });
    });
});
```

Here we are using [`async.parallel`](https://github.com/caolan/async#paralleltasks-callback) to make two database queries simultaneously, since one query does not depend on another. However, because we have two separate MongoDB documents, that's two independent asynchronous operations, hence another `async.parallel`. Basically, we respond with a success only when both characters have finished updating and there were no errors.

---

**GET /api/characters/count**

MongoDB has a built-in [`count()`](http://docs.mongodb.org/manual/reference/method/db.collection.count/) method for returning the number of results that match the query.

```js
/**
 * GET /api/characters/count
 * Returns the total number of characters.
 */
app.get('/api/characters/count', function(req, res, next) {
  Character.count({}, function(err, count) {
    if (err) return next(err);
    res.send({ count: count });
  });
});
```
<div class="admonition note">
  <div class="admonition-title">Note</div>
  You may notice we are starting to diverge from the RESTful API design pattern with this one-off route for returning total count. Unfortunately that's just a reality. I have never worked on a project where I could perfectly map out all URLs in a RESTful way. See <a href="https://blog.apigee.com/detail/restful_api_design_what_about_counts">this post</a> by Apigee.
</div>

---

**GET/api/characters/search**

Last I checked MongoDB does not support case-insensitive queries, which explains why we have to use a regex here. The next best thing you could do is to use the [`$regex`](http://docs.mongodb.org/manual/reference/operator/query/regex/) operator.

```js
/**
 * GET /api/characters/search
 * Looks up a character by name. (case-insensitive)
 */
app.get('/api/characters/search', function(req, res, next) {
  var characterName = new RegExp(req.query.name, 'i');

  Character.findOne({ name: characterName }, function(err, character) {
    if (err) return next(err);

    if (!character) {
      return res.status(404).send({ message: 'Character not found.' });
    }

    res.send(character);
  });
});
```

---

**GET /api/characters/top**

When I first built this project, I initially had around 7-9 almost identical routes for retrieving the Top 100 characters. After some code refactoring I ended up with just a single route below.

```js
/**
 * GET /api/characters/top
 * Return 100 highest ranked characters. Filter by gender, race and bloodline.
 */
app.get('/api/characters/top', function(req, res, next) {
  var params = req.query;
  var conditions = {};

  _.each(params, function(value, key) {
    conditions[key] = new RegExp('^' + value + '$', 'i');
  });

  Character
    .find(conditions)
    .sort('-wins') // Sort in descending order (highest wins on top)
    .limit(100)
    .exec(function(err, characters) {
      if (err) return next(err);

      // Sort by winning percentage
      characters.sort(function(a, b) {
        if (a.wins / (a.wins + a.losses) < b.wins / (b.wins + b.losses)) { return 1; }
        if (a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)) { return -1; }
        return 0;
      });

      res.send(characters);
    });
});
```

For example, if we are interested in the Top 100 male characters with Caldari race and Civire bloodline, this would be the URL path for it:

> GET /api/characters/top?race=caldari&bloodline=civire&gender=male

![](/images/blog/Screenshot 2015-07-17 18.16.21.png)

If you are still having trouble understanding how we construct the `conditions` object, this documented code should clarify it:

```js
// Query params object
req.query = {
  race: 'caldari',
  bloodline: 'civire',
  gender: 'male'
};

var params = req.query;
var conditions = {};

// This each loop is equivalent...
_.each(params, function(value, key) {
  conditions[key] = new RegExp('^' + value + '$', 'i');
});

// To this code
conditions.race = new RegExp('^' + params.race + '$', 'i'); // /caldari$/i
conditions.bloodline = new RegExp('^' + params.bloodline + '$', 'i'); // /civire$/i
conditions.gender = new RegExp('^' + params.gender + '$', 'i'); // /male$/i

// Which ultimately becomes this...
Character
    .find({ race: /caldari$/i, bloodline: /civire$/i, gender: /male$/i })
```

After we retrieve characters with the highest number of wins, we are doing another sort by winning percentage, so that we don't end up with the oldest characters always being on top.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  Be careful with accepting user's input directly. Ideally we should have first checked for query params before blindly constructing the <code>conditions</code> object and passing it to MongoDB.
</div>

---

**GET /api/characters/shame**

Similar to the previous route, this one retrieves 100 characters with the most losses.

```js
/**
 * GET /api/characters/shame
 * Returns 100 lowest ranked characters.
 */
app.get('/api/characters/shame', function(req, res, next) {
  Character
    .find()
    .sort('-losses')
    .limit(100)
    .exec(function(err, characters) {
      if (err) return next(err);
      res.send(characters);
    });
});
```

---

**GET /api/characters/:id**

**October 11, 2015 Update:** I have left this Express route for last, so that other routes starting with */api/characters/*, do not get clobbered by the this route with the `:id` parameter.

This route is used by the profile page (*Character* component that we will build next) as shown at the beginning of the tutorial.

```js
/**
 * GET /api/characters/:id
 * Returns detailed character information.
 */
app.get('/api/characters/:id', function(req, res, next) {
  var id = req.params.id;

  Character.findOne({ characterId: id }, function(err, character) {
    if (err) return next(err);

    if (!character) {
      return res.status(404).send({ message: 'Character not found.' });
    }

    res.send(character);
  });
});
```

---

**POST /api/report**

Some characters do not have a valid avatar (gray silhouette) while other avatars are nearly pitch-black and shouldn't be added to the database in the first place. But since anyone can add everyone, sometimes you end up with those characters that need be removed. A character that has been reported by visitors at least 4 times will be removed from the database.

```js
/**
 * POST /api/report
 * Reports a character. Character is removed after 4 reports.
 */
app.post('/api/report', function(req, res, next) {
  var characterId = req.body.characterId;

  Character.findOne({ characterId: characterId }, function(err, character) {
    if (err) return next(err);

    if (!character) {
      return res.status(404).send({ message: 'Character not found.' });
    }

    character.reports++;

    if (character.reports > 4) {
      character.remove();
      return res.send({ message: character.name + ' has been deleted.' });
    }

    character.save(function(err) {
      if (err) return next(err);
      res.send({ message: character.name + ' has been reported.' });
    });
  });
});
```

---

**GET /api/stats**

And last but not least, a route for character stats. Yes, it could be simplified with [`async.each`](https://github.com/caolan/async#each) or [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), but keep in mind when I first built New Eden Faces I was not familiar with either solutions. Most of the back-end code is unchanged since then. Although the code is verbose, at least it is explicit and very readable.

```js
/**
 * GET /api/stats
 * Returns characters statistics.
 */
app.get('/api/stats', function(req, res, next) {
  async.parallel([
      function(callback) {
        Character.count({}, function(err, count) {
          callback(err, count);
        });
      },
      function(callback) {
        Character.count({ race: 'Amarr' }, function(err, amarrCount) {
          callback(err, amarrCount);
        });
      },
      function(callback) {
        Character.count({ race: 'Caldari' }, function(err, caldariCount) {
          callback(err, caldariCount);
        });
      },
      function(callback) {
        Character.count({ race: 'Gallente' }, function(err, gallenteCount) {
          callback(err, gallenteCount);
        });
      },
      function(callback) {
        Character.count({ race: 'Minmatar' }, function(err, minmatarCount) {
          callback(err, minmatarCount);
        });
      },
      function(callback) {
        Character.count({ gender: 'Male' }, function(err, maleCount) {
          callback(err, maleCount);
        });
      },
      function(callback) {
        Character.count({ gender: 'Female' }, function(err, femaleCount) {
          callback(err, femaleCount);
        });
      },
      function(callback) {
        Character.aggregate({ $group: { _id: null, total: { $sum: '$wins' } } }, function(err, totalVotes) {
            var total = totalVotes.length ? totalVotes[0].total : 0;
            callback(err, total);
          }
        );
      },
      function(callback) {
        Character
          .find()
          .sort('-wins')
          .limit(100)
          .select('race')
          .exec(function(err, characters) {
            if (err) return next(err);

            var raceCount = _.countBy(characters, function(character) { return character.race; });
            var max = _.max(raceCount, function(race) { return race });
            var inverted = _.invert(raceCount);
            var topRace = inverted[max];
            var topCount = raceCount[topRace];

            callback(err, { race: topRace, count: topCount });
          });
      },
      function(callback) {
        Character
          .find()
          .sort('-wins')
          .limit(100)
          .select('bloodline')
          .exec(function(err, characters) {
            if (err) return next(err);

            var bloodlineCount = _.countBy(characters, function(character) { return character.bloodline; });
            var max = _.max(bloodlineCount, function(bloodline) { return bloodline });
            var inverted = _.invert(bloodlineCount);
            var topBloodline = inverted[max];
            var topCount = bloodlineCount[topBloodline];

            callback(err, { bloodline: topBloodline, count: topCount });
          });
      }
    ],
    function(err, results) {
      if (err) return next(err);

      res.send({
        totalCount: results[0],
        amarrCount: results[1],
        caldariCount: results[2],
        gallenteCount: results[3],
        minmatarCount: results[4],
        maleCount: results[5],
        femaleCount: results[6],
        totalVotes: results[7],
        leadingRace: results[8],
        leadingBloodline: results[9]
      });
    });
});
```

The last operation with the [`aggregate()`](http://docs.mongodb.org/manual/reference/method/db.collection.aggregate/) method is a bit more tricky. Admittedly, I had to get help with that part. In MongoDB, aggregations operations process data records and return computed results. In our case it computes the total number of casted votes by summing up all `wins` counts. Because this is a zero-sum game, the number of wins should be exactly the same as the number of losses, so we could have used `losses` counts here as well.

---

And we are all done here. At the end of the tutorial I will post some ideas for you to extend this project further with additional features.

## Step 16. Character (Profile) Component

In this section we are going to build the profile page for a character. It is slightly different from other components primarily because of the following:

1. It has a full page image background.
2. Navigating from one profile page to another profile page does not unmount the component, and as a result, the `getCharacter` action inside `componentDidMount` is never called more than once, i.e. it updates the URL but it does not fetch new data.

**<i class="devicons devicons-react"></i> Component**

Create a new file *Character.js* inside **<i class="fa fa-folder-open"></i>app/components** with the following contents:

```js
import React from 'react';
import CharacterStore from '../stores/CharacterStore';
import CharacterActions from '../actions/CharacterActions'

class Character extends React.Component {
  constructor(props) {
    super(props);
    this.state = CharacterStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    CharacterStore.listen(this.onChange);
    CharacterActions.getCharacter(this.props.params.id);

    $('.magnific-popup').magnificPopup({
      type: 'image',
      mainClass: 'mfp-zoom-in',
      closeOnContentClick: true,
      midClick: true,
      zoom: {
        enabled: true,
        duration: 300
      }
    });
  }

  componentWillUnmount() {
    CharacterStore.unlisten(this.onChange);
    $(document.body).removeClass();
  }

  componentDidUpdate(prevProps) {
    // Fetch new charachter data when URL path changes
    if (prevProps.params.id !== this.props.params.id) {
      CharacterActions.getCharacter(this.props.params.id);
    }
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className='container'>
        <div className='profile-img'>
          <a className='magnific-popup' href={'https://image.eveonline.com/Character/' + this.state.characterId + '_1024.jpg'}>
            <img src={'https://image.eveonline.com/Character/' + this.state.characterId + '_256.jpg'} />
          </a>
        </div>
        <div className='profile-info clearfix'>
          <h2><strong>{this.state.name}</strong></h2>
          <h4 className='lead'>Race: <strong>{this.state.race}</strong></h4>
          <h4 className='lead'>Bloodline: <strong>{this.state.bloodline}</strong></h4>
          <h4 className='lead'>Gender: <strong>{this.state.gender}</strong></h4>
          <button className='btn btn-transparent'
                  onClick={CharacterActions.report.bind(this, this.state.characterId)}
                  disabled={this.state.isReported}>
            {this.state.isReported ? 'Reported' : 'Report Character'}
          </button>
        </div>
        <div className='profile-stats clearfix'>
          <ul>
            <li><span className='stats-number'>{this.state.winLossRatio}</span>Winning Percentage</li>
            <li><span className='stats-number'>{this.state.wins}</span> Wins</li>
            <li><span className='stats-number'>{this.state.losses}</span> Losses</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Character;
```

On `componentDidMount` we pass the current *Character ID* (from URL) to the `getCharacter` action and initialize the Magnific Popup lightbox plugin.
<div class="admonition note">
  <div class="admonition-title">Note</div>
  I haven't had any success with using <code>ref="magnificPopup"</code> to initialize the plugin, that's why I left it as is. This might not be the best way, but it works.
</div>

Since the *Character* component has a full-page background image, during `componentWillUnmount` it is removed from the `<body>` tag so that users do not see it when navigating back to *Home* or *Add Character* components which do not have a background image. But when is this background image added? In the store when a character data is successfully fetched.

One last thing that is worth mentioning again is what's happening in `componentDidUpdate`. If we are transitioning from one character page to another character page, we are still within the *Character* component, i.e. it is never unmounted. And if it isn't unmounted, `componentDidMount` doesn't fetch new character data. So in `componentDidUpdate` — as long as we are in the same *Character* component and URL paths are different, e.g. transition from **/characters/1807823526** to **/characters/467078888**, it needs to fetch new character data.

**<i class="devicons devicons-react"></i> Actions**

Create a new file *CharacterActions.js* inside **<i class="fa fa-folder-open"></i>app/actions** directory:

```js
import alt from '../alt';

class CharacterActions {
  constructor() {
    this.generateActions(
      'reportSuccess',
      'reportFail',
      'getCharacterSuccess',
      'getCharacterFail'
    );
  }

  getCharacter(characterId) {
    $.ajax({ url: '/api/characters/' + characterId })
      .done((data) => {
        this.actions.getCharacterSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getCharacterFail(jqXhr);
      });
  }

  report(characterId) {
    $.ajax({
      type: 'POST',
      url: '/api/report',
      data: { characterId: characterId }
    })
      .done(() => {
        this.actions.reportSuccess();
      })
      .fail((jqXhr) => {
        this.actions.reportFail(jqXhr);
      });
  }
}

export default alt.createActions(CharacterActions);
```

**<i class="devicons devicons-react"></i> Store**

Create a new file *CharacterStore.js* inside **<i class="fa fa-folder-open"></i>app/store** directory:

```js
import {assign, contains} from 'underscore';
import alt from '../alt';
import CharacterActions from '../actions/CharacterActions';

class CharacterStore {
  constructor() {
    this.bindActions(CharacterActions);
    this.characterId = 0;
    this.name = 'TBD';
    this.race = 'TBD';
    this.bloodline = 'TBD';
    this.gender = 'TBD';
    this.wins = 0;
    this.losses = 0;
    this.winLossRatio = 0;
    this.isReported = false;
  }

  onGetCharacterSuccess(data) {
    assign(this, data);
    $(document.body).attr('class', 'profile ' + this.race.toLowerCase());
    let localData = localStorage.getItem('NEF') ? JSON.parse(localStorage.getItem('NEF')) : {};
    let reports = localData.reports || [];
    this.isReported = contains(reports, this.characterId);
    // If is NaN (from division by zero) then set it to "0"
    this.winLossRatio = ((this.wins / (this.wins + this.losses) * 100) || 0).toFixed(1);
  }

  onGetCharacterFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onReportSuccess() {
    this.isReported = true;
    let localData = localStorage.getItem('NEF') ? JSON.parse(localStorage.getItem('NEF')) : {};
    localData.reports = localData.reports || [];
    localData.reports.push(this.characterId);
    localStorage.setItem('NEF', JSON.stringify(localData));
    toastr.warning('Character has been reported.');
  }

  onReportFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(CharacterStore);
```

Here we are using two Underscore's helper functions [`assign`](http://underscorejs.org/#extendOwn) and [`contains`](http://underscorejs.org/#contains) to merge two objects and check if array contains a certain value, respectively.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  At the time of writing Babel.js does not support <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign"><code>Object.assign</code></a> method and I find <code>contains</code> to be more readable than <code>Array.indexOf() > -1</code> for checking if an array contains some value.
</div>

As I have explained before, this component looks significantly different from all other components. Adding `profile` CSS class to `<body>` pretty much changes the entire look and feel due to how some CSS styles are composed in *main.less*. While the second CSS class, which could be either `caldari`, `gallente`, `minmatar`, `amarr` (case-sensitive) determine which background image to use. I would generally avoid messing with the DOM that is not part of the `render()` of that component, but this is a one-off exception. And finally, inside the `onGetCharacterSuccess` handler we need to check if a character has already been reported by the same user. If they have, the report button will be grayed out and disabled. *Since it is fairly easy to get around this restriction, it's probably a good idea to do an IP check on the server if you do not wish to allow your users to report a character more than once.*

If a character is being reported for the first time, it is saved to Local Storage under the *NEF* namespace. Since you cannot store objects and arrays in Local Storage, we have to [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) it first.

![](/images/blog/Screenshot 2015-07-19 01.14.26.png)

Again, open *routes.js* and a new route for `/characters/:id`. This route uses a dynamic segment `id` that will match any valid *Character ID*. Also, don't forget to import the *Character* component.

```js
import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import AddCharacter from './components/AddCharacter';
import Character from './components/Character';

export default (
  <Route handler={App}>
    <Route path='/' handler={Home} />
    <Route path='/add' handler={AddCharacter} />
    <Route path='/characters/:id' handler={Character} />
  </Route>
);
```

Refresh the browser, click on one of the characters and you should see the new profile page.

![](/images/blog/Screenshot 2015-07-19 01.32.44.png)

Up next is the *CharacterList* component for *Top 100* characters - filtered by gender, race, bloodline and overall. The *Hall of Shame* is also part of this component.

## Step 17. Top 100 Component

This component uses Bootstrap's [Media Object](http://getbootstrap.com/components/#media) as its main interface. Here is what it looks like:

![](/images/blog/Screenshot 2015-07-19 14.01.37.png)

**<i class="devicons devicons-react"></i> Component**

Create a new file *CharacterList.js* inside **<i class="fa fa-folder-open"></i>app/components** with the following contents:

```js
import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';
import CharacterListStore from '../stores/CharacterListStore';
import CharacterListActions from '../actions/CharacterListActions';

class CharacterList extends React.Component {
  constructor(props) {
    super(props);
    this.state = CharacterListStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    CharacterListStore.listen(this.onChange);
    CharacterListActions.getCharacters(this.props.params);
  }

  componentWillUnmount() {
    CharacterListStore.unlisten(this.onChange);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.params, this.props.params)) {
      CharacterListActions.getCharacters(this.props.params);
    }
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    let charactersList = this.state.characters.map((character, index) => {
      return (
        <div key={character.characterId} className='list-group-item animated fadeIn'>
          <div className='media'>
            <span className='position pull-left'>{index + 1}</span>
            <div className='pull-left thumb-lg'>
              <Link to={'/characters/' + character.characterId}>
                <img className='media-object' src={'http://image.eveonline.com/Character/' + character.characterId + '_128.jpg'} />
              </Link>
            </div>
            <div className='media-body'>
              <h4 className='media-heading'>
                <Link to={'/characters/' + character.characterId}>{character.name}</Link>
              </h4>
              <small>Race: <strong>{character.race}</strong></small>
              <br />
              <small>Bloodline: <strong>{character.bloodline}</strong></small>
              <br />
              <small>Wins: <strong>{character.wins}</strong> Losses: <strong>{character.losses}</strong></small>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className='container'>
        <div className='list-group'>
          {charactersList}
        </div>
      </div>
    );
  }
}

export default CharacterList;
```

Since our array of characters is already sorted by the winning percentage, we can use `index + 1` (1 through 100) to display the position number. It's a position only within that list, not globally across all characters.

**<i class="devicons devicons-react"></i> Actions**

Create a new file *CharacterListActions.js* inside **<i class="fa fa-folder-open"></i>app/actions** directory:

```js
import alt from '../alt';

class CharacterListActions {
  constructor() {
    this.generateActions(
      'getCharactersSuccess',
      'getCharactersFail'
    );
  }

  getCharacters(payload) {
    let url = '/api/characters/top';
    let params = {
      race: payload.race,
      bloodline: payload.bloodline
    };

    if (payload.category === 'female') {
      params.gender = 'female';
    } else if (payload.category === 'male') {
      params.gender = 'male';
    }

    if (payload.category === 'shame') {
      url = '/api/characters/shame';
    }

    $.ajax({ url: url, data: params })
      .done((data) => {
        this.actions.getCharactersSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getCharactersFail(jqXhr);
      });
  }
}

export default alt.createActions(CharacterListActions);
```

The `payload`, in this case, contains React Router params that we will specify in *routes.js* shortly:

```xml
<Route path=':category' handler={CharacterList}>
  <Route path=':race' handler={CharacterList}>
    <Route path=':bloodline' handler={CharacterList} />
  </Route>
</Route>
```

For example, if we go to http://localhost:3000/female/gallente/intaki, then the `payload` object would contain the following data:

```js
{
  category: 'female',
  race: 'gallente',
  bloodline: 'intaki'
}
```

**<i class="devicons devicons-react"></i> Store**

Create a new file *CharacterListStore.js* inside **<i class="fa fa-folder-open"></i>app/store** directory:

```js
import alt from '../alt';
import CharacterListActions from '../actions/CharacterListActions';

class CharacterListStore {
  constructor() {
    this.bindActions(CharacterListActions);
    this.characters = [];
  }

  onGetCharactersSuccess(data) {
    this.characters = data;
  }

  onGetCharactersFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(CharacterListStore);
```

Open *routes.js* and the following routes. All three nested routes use dynamic segments so we don't have to repeat ourselves multiple times. Make sure they are the last routes in the file, otherwise `:category` can override `/stats`, `/add` and `/shame` routes, because it will treat those routes as "categories" instead of being separate routes. Don't forget to import the *CharacterList* component.

```js
import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import AddCharacter from './components/AddCharacter';
import Character from './components/Character';
import CharacterList from './components/CharacterList';

export default (
  <Route handler={App}>
    <Route path='/' handler={Home} />
    <Route path='/add' handler={AddCharacter} />
    <Route path='/characters/:id' handler={Character} />
    <Route path=':category' handler={CharacterList}>
      <Route path=':race' handler={CharacterList}>
        <Route path=':bloodline' handler={CharacterList} />
      </Route>
    </Route>
  </Route>
);
```

**September 22, 2015 Update:** Fixed a bug with Hall of Shame not fetching the right characters
by removing the `/shame` route, since it is already passed as `category` to a dynamic route below it.

Here are all the valid values for dynamic segments above:

- **`:category`** — *male, female, top*.
- **`:race`** — *caldari, gallente, minmatar, amarr*.
- **`:bloodline`** — *civire, deteis, achura, intaki, gallente, jin-mei, amarr, ni-kunni, khanid, brutor, sebiestor, vherokior*.

As you can see, *routes.js* could have been much longer if we hard-coded all those routes instead of using dynamic segments.

## Step 18. Stats Component

Our last component is really simple, it's just a table with general statistics such as the total number of characters by race, by gender, overall, total votes cast, leading race, leading bloodline, etc. I won't even need to explain any code because it is that simple.

**<i class="devicons devicons-react"></i> Component**

Create a new file *Stats.js* inside **<i class="fa fa-folder-open"></i>app/components** directory:

```js
import React from 'react';
import StatsStore from '../stores/StatsStore'
import StatsActions from '../actions/StatsActions';

class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = StatsStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    StatsStore.listen(this.onChange);
    StatsActions.getStats();
  }

  componentWillUnmount() {
    StatsStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className='container'>
        <div className='panel panel-default'>
          <table className='table table-striped'>
            <thead>
            <tr>
              <th colSpan='2'>Stats</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Leading race in Top 100</td>
              <td>{this.state.leadingRace.race} with {this.state.leadingRace.count} characters</td>
            </tr>
            <tr>
              <td>Leading bloodline in Top 100</td>
              <td>{this.state.leadingBloodline.bloodline} with {this.state.leadingBloodline.count} characters
              </td>
            </tr>
            <tr>
              <td>Amarr Characters</td>
              <td>{this.state.amarrCount}</td>
            </tr>
            <tr>
              <td>Caldari Characters</td>
              <td>{this.state.caldariCount}</td>
            </tr>
            <tr>
              <td>Gallente Characters</td>
              <td>{this.state.gallenteCount}</td>
            </tr>
            <tr>
              <td>Minmatar Characters</td>
              <td>{this.state.minmatarCount}</td>
            </tr>
            <tr>
              <td>Total votes cast</td>
              <td>{this.state.totalVotes}</td>
            </tr>
            <tr>
              <td>Female characters</td>
              <td>{this.state.femaleCount}</td>
            </tr>
            <tr>
              <td>Male characters</td>
              <td>{this.state.maleCount}</td>
            </tr>
            <tr>
              <td>Total number of characters</td>
              <td>{this.state.totalCount}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Stats;
```

**<i class="devicons devicons-react"></i> Actions**

Create a new file *Stats.js* inside **<i class="fa fa-folder-open"></i>app/actions** directory:

```js
import alt from '../alt';

class StatsActions {
  constructor() {
    this.generateActions(
      'getStatsSuccess',
      'getStatsFail'
    );
  }

  getStats() {
    $.ajax({ url: '/api/stats' })
      .done((data) => {
        this.actions.getStatsSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getStatsFail(jqXhr);
      });
  }
}

export default alt.createActions(StatsActions);
```

**<i class="devicons devicons-react"></i> Store**

Create a new file *Stats.js* inside **<i class="fa fa-folder-open"></i>app/store** directory:

```js
import {assign} from 'underscore';
import alt from '../alt';
import StatsActions from '../actions/StatsActions';

class StatsStore {
  constructor() {
    this.bindActions(StatsActions);
    this.leadingRace = { race: 'Unknown', count: 0 };
    this.leadingBloodline = { bloodline: 'Unknown', count: 0 };
    this.amarrCount = 0;
    this.caldariCount = 0;
    this.gallenteCount = 0;
    this.minmatarCount = 0;
    this.totalVotes = 0;
    this.femaleCount = 0;
    this.maleCount = 0;
    this.totalCount = 0;
  }

  onGetStatsSuccess(data) {
    assign(this, data);
  }

  onGetStatsFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(StatsStore);
```

Open *routes.js* and add our new route — `/stats`. Again, we have to place it before the `:category` route, so that it takes a higher precedence.

```js
import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import AddCharacter from './components/AddCharacter';
import Character from './components/Character';
import CharacterList from './components/CharacterList';
import Stats from './components/Stats';

export default (
  <Route handler={App}>
    <Route path='/' handler={Home} />
    <Route path='/add' handler={AddCharacter} />
    <Route path='/characters/:id' handler={Character} />
    <Route path='/shame' handler={CharacterList} />
    <Route path='/stats' handler={Stats} />
    <Route path=':category' handler={CharacterList}>
      <Route path=':race' handler={CharacterList}>
        <Route path=':bloodline' handler={CharacterList} />
      </Route>
    </Route>
  </Route>
);
```


Refresh the browser and you should see the new *Stats* component:

![](/images/blog/Screenshot 2015-07-19 14.53.00.png)

## Step 19. Deployment

Now that our project is complete we can finally deploy it. There are many hosting providers out there, but if you have followed any of my projects or tutorials then you should know why I like [Heroku](https://www.heroku.com/) so much. Although deployment steps should not differ that much with other hosting providers.

Let's start by creating a *.gitignore* file in the top-level directory of the project. You can create it either by typing `touch .gitignore` in the Terminal or using your IDE / Text Editor.

Add the following contents to *.gitignore*, where most of it is directly from the [gitignore](https://github.com/github/gitignore) repository on GitHub:

```
# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage

# Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Compiled binary addons (http://nodejs.org/api/addons.html)
build/Release

# Dependency directory
# Commenting this out is preferred by some people, see
# https://www.npmjs.org/doc/misc/npm-faq.html#should-i-check-my-node_modules-folder-into-git-
node_modules
bower_components

# Users Environment Variables
.lock-wscript

# Project
.idea
*.iml
.DS_Store

# Compiled files
public/css/*
public/js/*
```

<div class="admonition note">
  <div class="admonition-title">Note</div>
  Remember, we are only checking in source code files to Git, not compiled CSS and JavaScript generated by Gulp.
</div>

You will also need to add the following line to *package.json*, inside the [`"scripts"`](https://github.com/sahat/newedenfaces-react/blob/master/package.json#L13) object:

```js
"postinstall": "bower install && gulp build"
```

Since we will not be checking in compiled CSS and JavaScript to the Git repository, or third-party libraries in **<i class="fa fa-folder-open"></i>bower_components**, we need this `postinstall` command so that Heroku could compile the app and download Bower packages after deployment, otherwise it will not have access to *main.css*, *vendor.js*, *vendor.bundle.js* and *bundle.js* files inside **<i class="fa fa-folder-open"></i>public** directory.

Next, let's initialize a new Git repository inside **<i class="fa fa-folder-open"></i>newedenfaces** directory:

```bash
$ git init
$ git add .gitignore
$ git commit -m 'initial commit'
```

All of our code is now checked in and we are ready to push it to Heroku. However, first we need to create a new app on Heroku. After creating a new app follow the instructions on this page:

![](/images/blog/Screenshot 2015-07-19 15.17.01.png)

Since we already initialized a new Git repository, all you really need to do is run the following command, where *newedenfaces* is the name of my app, so for you it will be something else:

```bash
$ heroku git:remote -a newedenfaces
```

One last thing, click on the *Settings* tab, then *Reveal Config Vars*, then *Edit* button and add the following environment variable, matching what we have in *config.js*:

| KEY         | VALUE |
| ----------- |:-----:|
| `MONGO_URI` | `mongodb://admin:1234@ds061757.mongolab.com:61757/newedenfaces-tutorial` |

I have provided a sandbox database for the purposes of this tutorial, but if you wish to create your own database you can easily do so for free at [MongoLab](https://mongolab.com/) or [Compose](https://www.compose.io/) or even directly through [Heroku Addons](https://addons.heroku.com/).

Run the following command and we are all done!

```bash
$ git push heroku master
```

You should now be able to see your app live at *http://&lt;app_name&gt;.herokuapp.com*.

## Step 20. Additional Resources

Below is a list of resources that I found interesting and/or helpful during my own learning phase of React, Flux and ES6.

Link | Description
---- | -----------
[Elemental UI](http://elemental-ui.com/) | Beautiful UI toolkit for React containing buttons, forms, spinners, modals and other components.
[Navigating the React Ecosystem](http://www.toptal.com/react/navigating-the-react-ecosystem) | Excellent blog post by Tomas Holas exploring ES6, Generators, Babel, React, React Router, Alt, Flux, React Forms, Typeahead and Calendar widgets. In many ways it complements this tutorial. Highly recommend.
[A Quick Tour Of ES6](http://jamesknelson.com/es6-the-bits-youll-actually-use/) | Supplemental resource for learning more about new ES6 features. Very practical and easy to read blog post.
[Atomic CSS](http://acss.io/) | A radical new approach for styling your app. It takes time getting used to it, but when you do, its advantages are quite nice. You no longer have to abstract styles with CSS classes, instead you style React components with "atomic" classes inside your components.
[classnames](https://github.com/JedWatson/classnames) | A JavaScript utility for conditionally joining `classNames` together. It's a more elegant solution than using ternary operator and string concatenation.
[Iso](https://github.com/goatslacker/iso) | Helper class for Alt that allows you to pass initial data from server to client.

## In Closing

In my [previous](https://hackhands.com/building-instagram-clone-angularjs-satellizer-nodejs-mongodb/) blog post that I published on December 9th, 2014 I said:

> Congratulations on making it this far! It is now the longest blog post I have published to date. Funny, I said the exact same thing in my TV Show Tracker blog post.

But now, this post is even longer than my previous one. I seriously didn't expect it to be this long, neither was I trying to beat my old record. But I do hope this tutorial has been helpful and informative. If you learned at least something from this post, then all this writing effort wasn't for nothing.

If you liked this project, consider extending it or perhaps build a new app based on New Eden Faces. All this code is available on [GitHub](http://github.com/sahat/newedenfaces-react) and it is completely free, so use or modify it however you want. Here are some ideas for you to work on:

- Admin UI for resetting stats, swapping incorrect gender, deleting characters.
- Email subscription for weekly stats similar to [Fitbit Weekly Progress Report](https://www.google.com/search?q=fitbit+weekly+progress+report&source=lnms&tbm=isch&sa=X&ved=0CAgQ_AUoAmoVChMItIX17r_oxgIVCVyICh2NUQhh&biw=964&bih=656).
- Head-to-head matches between two characters.
- Smarter matching algorithm, e.g. high winning characters matched with other high winning characters.
- [List of all characters](http://www.newedenfaces.com/#browse) with pagination.
- Store character images on Amazon S3 or MongoDB [GridFS](http://docs.mongodb.org/manual/core/gridfs/) to avoid hitting EVE Online API each time.
- Image processing algorithm to reject [placeholder avatars](http://image.eveonline.com/Character/1_512.jpg) when adding a new character.
- Automatically reset stats every X number of rounds.
- Display voting history on the character profile page.
- Archives page to view Top 100 characters from previous rounds.
- Convert API to Relay + GraphQL.

From all the emails that I have received since publishing the [TV Show Tracker](http://sahatyalkabov.com/create-a-tv-show-tracker-using-angularjs-nodejs-and-mongodb/) tutorial, I have learned that this blog attracts readers of all levels - from long-time JavaScript gurus to those who are just starting out with coding, as well as everyone in between.

*If you are someone who is struggling with JavaScript:*

- Trust me, I have been there before. Coming from the C++ and Java background that they teach you in school, I just didn't get all that asynchronous and callbacks bullshit. At one point I got so angry and frustrated that I thought I would never use JavaScript ever again. The trick was to stop pretending like you know JavaScript and instead learn it from the ground up with an open mind.

*If you are someone who is struggling with the new ES6 syntax:*

- I used to loathe ES6. It did not look anything like the JavaScript I've grown to love in the past 2-3 years. Although ES6 is mostly just a syntactical sugar, it felt alien to me. Give it some time and you will grow to like it eventually. Whether someone likes it or not, that's the direction JavaScript is heading to.

*If you are someone who is struggling with React:*

- I remember using React for the first time and my initial thought was "What is HTML doing in my JavaScript? F that, I'll stick with AngularJS." But I don't think I need to convince you in 2015 why React is such a great library. A year ago - perhaps, but now just look at all the [sites using React](https://github.com/facebook/react/wiki/Sites-Using-React). React does require a new way of thinking for building apps, but once you get past that hurdle building apps in React is really fun and enjoyable. I have read a lot of React and Flux tutorials, but to be honest I did not fully understand it until I built my own project with it. I just want to reinforce that idea again - building a small project is the best way to learn any technology, not passively reading tutorials and books or watching screencasts and training videos.

*If you are someone who is struggling with coding in general:*

- You *must* learn how to persevere and deal with frustration that will no doubt arise along the way. Don't ever give up. If I gave up in 2009 I wouldn't have majored in Computer Science. If I gave up in 2012 I would've dropped out of college and never would have got my college degree. If I gave up on my Hacker School project in 2014 I would have never released [Satellizer](https://github.com/sahat/satellizer) which is currently being used all over the world by thousands of developers. There will always be struggle and frustration, especially with how fast this industry is moving. Despite what you might think, I am not an expert, I still struggle just like you almost every day. It is extremely rare that I go to work and know exactly what and how needs to be done - easy breezy. If that was typically the case, then I am not advancing anywhere and probably should look for a new job.

*If you are a college student seeking advice:*

- Start building your portfolio right now. Go create a GitHub account and start contributing to open-source projects or build some of your own projects. Do not expect the school to teach you all the skills required from you on the job market. Don't worry too much if you have a low GPA, as long as you can compensate with a solid portfolio and open-source contributions. Companies that place too much emphasis on your GPA and school prestige are probably not the companies you want to work for, unless that's your thing. Be sure to have a goal in life and work hard towards it. Everything that I have achieved to this date is not because I am gifted and talented, or really bright, or very exceptional, or very lucky, no I am none of the above. It is because I wanted those things and I relentlessly worked hard to get it.

This is likely my last tutorial until 2016. I would like to switch back to building open-source apps and libraries so I could create more projects like [Hackathon Starter](https://github.com/sahat/hackathon-starter) and [Satellizer](https://github.com/sahat/satellizer).

For questions, comments and general feedback send me an [email](mailto:sahat@me.com). Also due to the high volume of emails from my previous tutorials, I am enabling comments for this post so that other readers could potentially answer some of the questions.
