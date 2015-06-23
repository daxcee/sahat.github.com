---
layout: post
title: Create a character voting game using React, Node.js, MongoDB and Socket.IO
excerpt: "In this tutorial we are going to build a character voting game (inspired by Hot or Not) for EVE Online - a massively multiplayer online game."
gradient: 1
image: blog/create-an-eve-online-character-voting-game-using-react-nodejs-mongodb-and-socketio-cover.jpg
---

## Overview

In this tutorial we are going to build a character voting game (inspired by *Facemash* and *Hot or Not*) for [EVE Online](http://www.eveonline.com/) - massively multiplayer online game. If you are not familiar with EVE Online, check out this [video](https://www.youtube.com/watch?v=e2X1MIR1KMs).
 
![](/images/blog/Screenshot 2015-03-31 23.05.36.png)

<ul class="list-inline text-center">
  <li><a href="#"><i class="ion-monitor"></i> Live Demo</a></li>
  <li><a href="#"><i class="fa fa-github"></i> Source Code</a></li>
</ul>



In the same spirit as [Create a TV Show Tracker using AngularJS, Node.js and MongoDB](http://sahatyalkabov.com/create-a-tv-show-tracker-using-angularjs-nodejs-and-mongodb/) and [Build an Instagram clone with AngularJS, Satellizer, Node.js and MongoDB](https://hackhands.com/building-instagram-clone-angularjs-satellizer-nodejs-mongodb/) this is a full-stack JavaScript tutorial where we build a fully functioning app from the ground up.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  This is a remake of the original <a href="http://www.newedenfaces.com/">New Eden Faces</a> (2013) project, which was my first single-page application written in Backbone.js.
</div>

I usually try to make as few assumptions as possible, but having said that, you need to have at least some experience with client-side JavaScript frameworks and Node.js to follow along this tutorial.


Before proceeding, you will need to download and install the following tools:

1. <i class="devicons devicons-npm"></i> [Node.js](https://nodejs.org/) (or [io.js](https://iojs.org/en/index.html))
2. <i class="devicons devicons-bower"></i> [Bower](http://bower.io/)
3. <i class="devicons devicons-mongodb"></i> [MongoDB](https://www.mongodb.org/downloads)
4. <i class="devicons devicons-gulp"></i> [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

## Step 1. New Express Project

Create a new directory **<i class="fa fa-folder-open"></i>newedenfaces**. Inside, create 2 empty files *package.json* and *server.js* using a text editor or via command line:

![](/images/blog/Screenshot 2015-03-22 04.50.51.png)

Open *package.json* and paste the following:

```json
{
  "name": "newedenfaces",
  "description": "Hot or Not for EVE Online",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/sahat/newedenfaces-react"
  },
  "main": "server.js",
  "scripts": {
    "start": "babel-node server.js",
    "watch": "nodemon --exec babel-node -- server.js",
  },
  "dependencies": {
    "alt": "^0.16.10",
    "async": "^1.2.1",
    "babel": "^5.5.8",
    "body-parser": "^1.13.1",
    "colors": "^1.1.2",
    "compression": "^1.5.0",
    "express": "^4.12.4",
    "mongoose": "^4.0.5",
    "morgan": "^1.6.0",
    "react": "^0.13.3",
    "react-router": "^0.13.3",
    "request": "^2.58.0",
    "serve-favicon": "^2.3.0",
    "socket.io": "^1.3.5",
    "swig": "^1.4.2",
    "underscore": "^1.8.3",
    "xml2js": "^0.4.9"
  },
  "devDependencies": {
    "babelify": "^6.1.2",
    "browserify": "^10.2.4",
    "gulp": "^3.9.0",
    "gulp-autoprefixer": "^2.3.1",
    "gulp-concat": "^2.5.2",
    "gulp-cssmin": "^0.1.7",
    "gulp-if": "^1.2.5",
    "gulp-less": "^3.0.3",
    "gulp-plumber": "^1.0.1",
    "gulp-streamify": "0.0.5",
    "gulp-uglify": "^1.2.0",
    "gulp-util": "^3.0.5",
    "vinyl-source-stream": "^1.1.0",
    "watchify": "^3.2.2"
  },
  "license": "MIT"
}
```

These are all the packages that we will be using for this project. I will briefly go over the purpose behind each package.

| Package Name          | Description   |
| ------------- |:-------------:|
| [alt](https://github.com/goatslacker/alt)      | Flux library for React. |
| [async](https://github.com/caolan/async)      | For managing asynchronous flow.      |
| [babel](http://babeljs.io) | ES6 compiler.      |
| [body-parser](https://github.com/expressjs/body-parser) | For parsing POST request data.      |
| [colors](https://github.com/marak/colors.js/) | Pretty console output messages.      |
| [compression](https://github.com/expressjs/compression) | Gzip compression.    |
| [express](http://expressjs.com/) | Web framework for Node.js.      |
| [mongoose](http://mongoosejs.com/) | MongoDB ODM with validation and schema support.      |
| [morgan](https://github.com/expressjs/morgan) | HTTP request logger.      |
| [react](http://facebook.github.io/react/) | We will be using it on the server and the client.      |
| [react-router](https://github.com/rackt/react-router) | Routing library for React.      |
| [request](https://github.com/request/request) | For making HTTP requests to EVE Online API.      |
| [serve-favicon](https://github.com/expressjs/serve-favicon) | For serving *favicon.png* icon.      |
| [socket.io](http://socket.io/) | To display how many users are online in real-time.      |
| [swig](http://paularmstrong.github.io/swig/) | To render the initial HTML template.      |
| [underscore](http://underscorejs.org/) | Helper JavaScript utilities.      |
| [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) | For parsing XML response from EVE Online API.      |

Run `npm install` in the Terminal to install the packages specified in *package.json*.

![](/images/blog/Screenshot 2015-03-22 05.19.19.png)

<div class="admonition note">
  <div class="admonition-title">Note</div>
  If you are on a Windows machine, be sure to check out the <a href="http://bliker.github.io/cmder">cmder</a>
  console emulator for Windows.
</div>

Open `server.js` and paste the following code. This is pretty much the most minimal Express application.

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
 Although we will be building the React app in ES6, I have decided to use ES5 here because this back-end code is mostly unchanged from when I first built the original <a href="https://github.com/sahat/newedenfaces">New Eden Faces</a> project. Additionally, if you are using ES6 for the first time, then at least the Express app will still be familiar to you.
</div>

Next, create a new directory called **<i class="fa fa-folder-open"></i>public**. This is where we will place images, fonts, as well as compiled CSS and JavaScript files.

![](/images/blog/Screenshot 2015-03-22 05.41.53.png)

Run `npm start` to make sure our Express app is working without any issues.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  While you could technically use <code>node server.js</code> to start the app right now, as soon as we start writing the React app using ECMAScript 6 and pre-rendering it on the server, we will need the Babel compiler. This is also why we do not have to include <a href="https://www.npmjs.com/package/node-jsx"><code>require('node-jsx').install()</code></a> in <em>server.js</em>. Babel takes care of JSX.
</div>


You should see **"Express server listening on port 3000"** message in the Terminal.

## Step 2. Build System

If you have been around the web community then you may have heard about [Browserify](http://browserify.org/) and [Webpack](http://webpack.github.io/). If not, then consider the chaos that would ensue from having to include so many `<script>` tags in the HTML, in just the right order.

![](/images/blog/Screenshot 2015-06-20 22.56.37.png)

Furthermore, we cannot use ES6 syntax directly in the browser yet; it needs to be transformed by Babel into ES5 beforehand.

We will be using [Gulp](http://gulpjs.com/) and [Browserify](http://browserify.org/) in this tutorial instead of Webpack. I will not advocate for which tool is better or worse, but I will say that Gulp + Browserify is a lot more straightforward than an equivalent Webpack file. I have yet to find any React boilerplate project with an easy to understand *webpack.config.js* file.

Create a new file `gulpfile.js` and paste the following code:

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

Although the code should be more or less self-explanatory with those task names and code comments, let's just briefly go over each task:

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


Next, let's shift focus to the project structure by creating files and folders that *gulpfile.js* expects.
 
## Step 3. Project Structure

In the **<i class="fa fa-folder-open"></i>public** directory create 4 new folders **<i class="fa fa-folder-open"></i>css**, **<i class="fa fa-folder-open"></i>js**, **<i class="fa fa-folder-open"></i>fonts** and **<i class="fa fa-folder-open"></i>img**. Also, download this [favicon.png](https://raw.githubusercontent.com/sahat/newedenfaces-react/master/public/favicon.png) and place it here as well.

![](/images/blog/Screenshot 2015-06-21 00.47.32.png)


In the root directory **<i class="fa fa-folder-open"></i>newedenfaces**, create a new folder **<i class="fa fa-folder-open"></i>app**, then inside it create 4 new folders **<i class="fa fa-folder-open"></i>actions**, **<i class="fa fa-folder-open"></i>components**, **<i class="fa fa-folder-open"></i>stores**, **<i class="fa fa-folder-open"></i>stylesheets**. Create 3 empty files *alt.js*, *routes.js* and *main.js*.

![](/images/blog/Screenshot 2015-06-21 00.58.43.png)

In the **<i class="fa fa-folder-open"></i>stylesheets** directory create a new file *main.less* which we will populate with styles shortly.

Back in the root directory, create a new file *bower.json* and paste the following:

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

Run `bower install` and wait for the components to be downloaded and installed into **<i class="fa fa-folder-open"></i>bower_components**. You can change that path via [.bowerrc](http://bower.io/docs/config/#directory), but for the purposes of this tutorial we will stick with the defaults.

Similarly to **<i class="fa fa-folder-open"></i>node_modules**, you do not want to commit **<i class="fa fa-folder-open"></i>bower_components** into Git. But if you don't commit it, how will those files be loaded when you deploy your app? We will get back to this issue during the *Deployment* step of the tutorial.

Copy all glyphicons fonts from **<i class="fa fa-folder-open"></i>bower_components/bootstrap/fonts** into **<i class="fa fa-folder-open"></i>public/fonts** directory.

Download the following background images and place them into **<i class="fa fa-folder-open"></i>public/img** directory:

- [amarr_bg.jpg](https://raw.githubusercontent.com/sahat/newedenfaces-react/master/public/img/amarr_bg.jpg)
- [caldari_bg.jpg](https://raw.githubusercontent.com/sahat/newedenfaces-react/master/public/img/caldari_bg.jpg)
- [gallente_bg.jpg](https://raw.githubusercontent.com/sahat/newedenfaces-react/master/public/img/gallente_bg.jpg)
- [minmatar_bg.jpg](https://raw.githubusercontent.com/sahat/newedenfaces-react/master/public/img/minmatar_bg.jpg)

<div class="admonition note">
  <div class="admonition-title">Fun Fact</div>
 I have used the Gaussian blur in Adobe Photoshop in order to create that out of focus effect over 3 years ago when I first built the New Eden Faces project, but it should be totally possible to achieve this effect with only CSS.
</div>

Open *main.less* that we have just created and paste the following CSS styles:

```css
@import '../../bower_components/bootstrap/less/bootstrap';
@import '../../bower_components/toastr/toastr';
@import (less) '../../bower_components/magnific-popup/dist/magnific-popup.css';

/*
 * Bootstrap overrides.
 */
@body-bg: #f0f3f4;
@text-color: #58666f;
@font-family-base: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
@link-color: #363f34;
@link-hover-color: #141718;

@navbar-default-bg: #fff;
@navbar-default-link-color: #353f44;
@navbar-default-link-hover-bg: #f6f7f7;
@navbar-default-link-active-bg: #f6f7f7;

@btn-default-color: #58666e;
@btn-default-border: #dee5e7;

@btn-primary-color: #fff;
@btn-primary-bg: #7266bb;
@btn-primary-border: #7266bb;

@btn-success-color: #fff;
@btn-success-bg: #27d24b;
@btn-success-border: #27d24b;

@btn-info-color: #fff;
@btn-info-bg: #23b7f5;
@btn-info-border: #23b7f5;

@btn-warning-color: #fff;
@btn-warning-bg: #fac732;
@btn-warning-border: #fac732;

@btn-danger-color: #fff;
@btn-danger-bg: #f15051;
@btn-danger-border: #f15051;

@panel-default-border: #dee5e7;
@panel-border-radius: 2px;
@panel-default-heading-bg: #f6f8f8;

@screen-sm: 800px;

html {
  position: relative;
  min-height: 100%;
}

body {
  margin-bottom: 220px;
  -webkit-font-smoothing: antialiased;
}

footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  color: #fff;
  background-color: #3b3f51;
}

footer a {
  color: #fff;
  text-decoration: underline;

  &:hover,
  &:focus {
    color: #fff;
    text-decoration: none;
  }
}

footer .thumb-md {
  border: 1px solid rgba(255,255,255,.15);
  transition: border .1s linear;

  &:hover {
    border-color: rgba(255,255,255,.3);
  }
}

.badge-danger {
  color: #fff;
  background-color: #f05150;
}

.badge-up {
  position: relative;
  top: -10px;
  padding: 2px 5px;
}

/*
 * Character profile page styles.
 */

.profile {
  color: #fff;
  background-size: cover;
}

.profile.amarr {
  background-image: url('/img/amarr_bg.jpg');
}

.profile.caldari {
  background-image: url('/img/caldari_bg.jpg');
}

.profile.gallente {
  background-image: url('/img/gallente_bg.jpg');
}

.profile.minmatar {
  background-image: url('/img/minmatar_bg.jpg');
}

.profile footer {
  color: #fff;
  background: transparent;
  border-top: 1px solid rgba(255,255,255,.15);
}

.profile .navbar-default {
  background-color: transparent;
  border-bottom: 1px solid rgba(255,255,255,.15);
  box-shadow: none;
}

.profile .navbar-default .navbar-brand {
  color: #fff;
}


.profile .form-control {
  color: #fff;
  background: rgba(255,255,255,.15);
  border-color: rgba(255,255,255,.15);
  border-right: 0;

  &:focus {
    border-color: rgba(255,255,255,.3);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.055),0 0 8px rgba(255,255,255,.3);
  }
}

.profile .input-group-btn:last-child > .btn {
  margin-left: 0;
}

.profile .btn-default {
  color: #fff;
  background-color: rgba(255,255,255,.15);
  border-color: rgba(255,255,255,.15);
  transition: background-color .3s;

  &:focus,
  &:hover {
    color: #fff;
    background-color: rgba(255,255,255,.3);
  }
}


.profile .tri {
  border-top-color: #fff;

  &.invert {
    border-bottom-color: #fff;
  }
}

.profile .navbar-default .navbar-nav > .open > a,
.profile .navbar-default .navbar-nav > .open > a:hover,
.profile .navbar-default .navbar-nav > .open > a:focus {
  background-color: rgba(255,255,255,.15);
}

.profile .navbar-default .navbar-nav > li > a:hover,
.profile .navbar-default .navbar-nav > li > a:focus {
  color: #fff;
  background-color: rgba(255,255,255,.15);
}

.profile .navbar-default .navbar-nav > li > a {
  color: #fff;
}

.profile footer .col-sm-5 {
  border-right: 1px solid rgba(255,255,255,.15);
}

.table {
  font-size: inherit;
}

.table > thead > tr > th {
  padding: 8px 15px;
  border-bottom: 1px solid #eaeef0;
}

.table > tbody > tr > td {
  padding: 8px 15px;
  border-top: 1px solid #eaeef0;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: #f9f9f9;
}

.list-group {
  border-radius: 2px;
}

.list-group .list-group-item {
  margin-bottom: 5px;
  border-radius: 3px;
}

.list-group-item:hover,
.list-group-item:focus {
  background-color: #f6f8f8;
}

.thumb-md {
  display: inline-block;
  width: 64px;
}

.thumb-lg {
  display: inline-block;
  width: 96px;
  margin-right: 15px;
}

.thumb-lg img {
  height: auto;
  max-width: 100%;
  vertical-align: middle;
}

.position {
  font-size: 40px;
  font-weight: bold;
  color: #ddd;
  margin-right: 5px;
  line-height: 96px;
}

.btn {
  font-weight: 500;
  border-radius: 2px;
  outline: 0 !important;
}

.btn-addon i {
  position: relative;
  float: left;
  width: 34px;
  height: 34px;
  margin: -6px -12px;
  margin-right: 12px;
  line-height: 34px;
  text-align: center;
  background-color: rgba(0,0,0,.1);
  border-radius: 2px 0 0 2px;
}

.btn-addon i.pull-right {
  margin-right: -12px;
  margin-left: 12px;
  border-radius: 0 2px 2px 0;
}

.btn-addon.btn-sm i.pull-right {
  margin-right: -10px;
  margin-left: 10px;
}

.btn-default {
  box-shadow: 0 1px 1px rgba(91,91,91,.1);
}

.navbar {
  border: 0;
  box-shadow: 0 2px 2px rgba(0,0,0,.05), 0 1px 0 rgba(0,0,0,.05);
}

.navbar-default .navbar-brand {
  margin-left: 40px;
  font-size: 20px;
  font-weight: 700;
}

.dropdown-menu {
  box-shadow: 0 2px 6px rgba(0,0,0,.1);
}

.dropdown-submenu {
  position: relative;
}

.dropdown-submenu > .dropdown-menu {
  top: 0;
  left: 100%;
  margin-top: 0;
  margin-left: 1px;
  border-radius: 0 6px 6px 6px;
}

.dropdown-submenu:hover > .dropdown-menu {
  display: block;
}

.dropdown-submenu > a:after {
  display: block;
  content: '';
  float: right;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-right-width: 0;
  border-left-color: #353f44;
  margin-top: 5px;
  margin-right: -10px;
}

.panel {
  box-shadow: 0 1px 1px rgba(0,0,0,.05);
}

.panel-default > .panel-heading {
  color: #333;
  font-weight: 700;
  border-color: #edf2f2;
}

.dropdown-submenu.pull-left {
  float: none;
}

.dropdown-submenu.pull-left > .dropdown-menu {
  left: -100%;
  margin-left: 10px;
  border-radius: 6px 0 6px 6px;
}

.form-control {
  border-color: #cfdadc;
  border-radius: 2px;

  &:focus {
    border-color: #24b7e4;
    box-shadow: none;
  }
}

.thumbnail {
  background-color: #fff;
  padding: 0;
  border-radius: 2px;
  border-color: #dee5e7;
  box-shadow: 0 1px 1px rgba(0,0,0,.05);
}

.thumbnail img {
  padding: 6px;
  border-radius: 2px 2px 0 0;
  border: 0;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: @btn-info-bg;
  }
  &:active {
    position: relative;
    top: 2px;
  }
}

.form-control {
  box-shadow: none;
}

label {
  font-weight: normal;
}

.profile-img {
  position: relative;
  margin-bottom: 20px;
  float: left;
  width: 256px;
  height: 256px;
  box-shadow: 0 2px 25px rgba(0,0,0,.25);
}

.profile-info {
  margin: 0 0 20px 286px;
  max-width: 405px;
  color: #fff;
}

.btn-transparent {
  border: 1px solid white;
  border-radius: 3px;
  padding: 10px 20px;
  color: #fff;
  text-transform: uppercase;
  cursor: pointer;
  background-color: transparent;
  box-shadow: none;
  transition: background-color .3s;

  &:focus,
  &:hover {
    color: #fff;
    background-color: rgba(255,255,255,.3);
  }
}

.profile-stats {
  margin: 30px 0 30px 0;
  padding: 20px 0;
  border-top: 1px solid #2098ca;
  border-bottom: 1px solid #2098ca;
  border-top: 1px solid rgba(255,255,255,.15);
  border-bottom: 1px solid rgba(255,255,255,.15)
}

@media (max-width: 510px) {
  .profile-stats {
    font-size: 12px
  }
}

@media (max-width: 360px) {
  .profile-stats {
    padding: 10px 0
  }
}

.profile-stats {
  display: block;
  color: #fff
}

.profile-stats ul {
  list-style-type: none
}

.profile-stats li {
  position: relative;
  float: left;
  width: 33.3%;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  overflow: hidden
}

@media (max-width: 360px) {
  .profile-stats li {
    font-size: 10px
  }
}

.profile-stats li .stats-number {
  display: block;
  margin-bottom: 15px;
  font-size: 40px;
  font-weight: 600;
  line-height: 40px
}

@media (max-width: 360px) {
  .profile-stats li .stats-number {
    margin-bottom: 5px;
    font-size: 34px
  }
}

.profile-stats li:first-child:after {
  content: '';
  position: absolute;
  display: block;
  top: 50%;
  right: 0;
  margin-top: -27px;
  width: 1px;
  height: 55px;
  background: rgba(255,255,255,.15)
}

.profile-stats li:last-child:before {
  content: '';
  position: absolute;
  display: block;
  top: 50%;
  left: 0;
  margin-top: -27px;
  width: 1px;
  height: 55px;
  background: rgba(255,255,255,.15)
}

.profile-stats li.last-child:before {
  background: #fff
}

.radio {
  margin-bottom: 10px;
  margin-top: 10px;
  padding-left: 20px;
}

.radio-inline + .radio-inline {
  margin-top: 10px;
}

.radio-inline,
.checkbox-inline {
  cursor: default;
}

.radio label {
  display: inline-block;
  cursor: pointer;
  position: relative;
  padding-left: 5px;
  margin-right: 10px;
}

.radio label:before {
  content: '';
  display: inline-block;
  width: 17px;
  height: 17px;
  margin-left: -20px;
  position: absolute;
  left: 0;
  background-color: #fff;
  border: 1px solid #d0d0d0;
}

.radio label:before {
  bottom: 2.5px;
  border-radius: 100px;
  transition: border .2s 0s cubic-bezier(.45,.04,.22,1.30);
}

.radio input[type=radio]:checked + label:before {
  border-width: 5px;
}

.radio input[type=radio] {
  display: none;
}

.radio input[type=radio][disabled] + label {
  opacity: .65;
}

.radio input[type=radio]:checked + label:before {
  border-color: #10cebd;
}

.animated {
  animation-fill-mode: both;
  animation-duration: 1s;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.fadeInUp {
  animation-name: fadeInUp;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.fadeIn {
  animation-name: fadeIn;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.fadeOut {
  animation-name: fadeOut;
}

@keyframes flipInX {
  0% {
    transform: perspective(800px) rotate3d(1,0,0,90deg);
    transition-timing-function: ease-in;
    opacity: 0;
  }

  40% {
    transform: perspective(800px) rotate3d(1,0,0,-20deg);
    transition-timing-function: ease-in;
  }

  60% {
    transform: perspective(800px) rotate3d(1,0,0,10deg);
    opacity: 1;
  }

  80% {
    transform: perspective(800px) rotate3d(1,0,0,-5deg);
  }

  100% {
    transform: perspective(800px);
  }
}

.flipInX {
  backface-visibility: visible !important;
  animation-name: flipInX;
}

@keyframes flipOutX {
  0% {
    transform: perspective(400px);
  }

  30% {
    transform: perspective(400px) rotate3d(1,0,0,-20deg);
    opacity: 1;
  }

  100% {
    transform: perspective(400px) rotate3d(1,0,0,90deg);
    opacity: 0;
  }
}

.flipOutX {
  animation-name: flipOutX;
  backface-visibility: visible !important;
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

@keyframes shake {
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }

  10%, 30%, 50%, 70%, 90% {
    transform: translate3d(-10px, 0, 0);
  }

  20%, 40%, 60%, 80% {
    transform: translate3d(10px, 0, 0);
  }
}

.shake {
  animation-name: shake;
}

  @tricolor: @link-color;
  @triw: 10px;
  @trih: @triw*0.9;

.triangles {
  position: absolute;
  top: 25px;
  left: 30px;
  height: @trih * 3;
  width: @triw * 3;
  transform: translate(-50%, -50%);
  opacity: 0;
}

.navbar-brand:hover .tri {
  animation-play-state: paused;
}

.tri {
  position: absolute;
  animation: pulse 750ms ease-in infinite;
  border-top: @trih solid @tricolor;
  border-left: @triw/2 solid transparent;
  border-right: @triw/2 solid transparent;
  border-bottom: 0;

  &.invert {
    border-top: 0;
    border-bottom: @trih solid @tricolor;
    border-left: @triw/2 solid transparent;
    border-right: @triw/2 solid transparent;
  }
  &:nth-child(1) {
    left: @triw;
  }
  &:nth-child(2) {
    left: @triw/2;
    top: @trih;
    animation-delay: -125ms;
  }
  &:nth-child(3) {
    left: @triw;
    top: @trih;
  }
  &:nth-child(4) {
    left: @triw*1.5;
    top: @trih;
    animation-delay: -625ms;
  }
  &:nth-child(5) {
    top: @trih*2;
    animation-delay: -250ms;
  }
  &:nth-child(6) {
    top: @trih*2;
    left: @triw/2;
    animation-delay: -250ms;
  }
  &:nth-child(7) {
    top: @trih*2;
    left: @triw;
    animation-delay: -375ms;
  }
  &:nth-child(8) {
    top: @trih*2;
    left: @triw*1.5;
    animation-delay: -500ms;
  }
  &:nth-child(9) {
    top: @trih*2;
    left: @triw*2;
    animation-delay: -500ms;
  }
}
```

If you have used the [Bootstrap framework](http://getbootstrap.com/) at all, then everything above should be pretty familar to you.


<div class="admonition note">
  <div class="admonition-title">Note</div>
  I have spent many hours designing this UI, tweaking fonts and colors, adding subtle transition effects, so if you get a chance, explore it in greater detail after you finish this tutorial.
</div>

Before we jump into building the React app, I have decided to dedicate the next three sections to ES6 and React basics. It may be too overwhelming trying to grasp everything at once. Personally, I had a very hard time following some React + Flux examples written in ES6 because I was learning the new syntax, a new framework and a completely unfamiliar app architecture all at the same time.

Since I can't cover everything, I will only be covering topics that you need to know specifically for this tutorial.

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

Using the [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) in ES6 we can import a subset of a module which can be quite useful for modules like *react-router* and *underscore* where it exports more than one function.

One thing to keep in mind is that ES6 imports are hoisted. All dependent modules will be loaded before any of the module code is executed. In other words, you can't conditionally load a module like with CommonJS. That threw me off a little when I tried to put the import statement inside the if-condition.

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

ES6 classes are nothing more than a syntactic sugar over the existing prototype-based inheritance in JavaScript. As long as you remember that fact, the new `class` keyword will not seem like a foreign concept.

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

With ES6 classes you can also use `extends` to create a subclass of an existing class:

```js
class MyComponent extends React.Component {
  // Now MyComponent class contains all React component methods
  // such as componentDidMount(), render() and etc.
}
```

For more information about ES6 classes visit [Classes in ECMAScript 6](http://www.2ality.com/2015/02/es6-classes-final.html) blog post.


**<i class="ion-social-javascript"></i>`var` vs `let`**

The only difference between the two is that `var` is scoped to the nearest *function block* and `let` is scoped to the nearest *enclosing block*  - which could be a *function*, a *for-loop* or an *if-statement block*.

For the most part there is no reason to use `var` anymore, so just use `let`.

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

Every function expression above has its own `this` value. Without binding `this` we would not be able to call `this.setState` in the example above, because `this` would have been *undefined*.

Alternatively, we could have assigned `this` to a variable (typically `var self = this`), then used `self` instead of `this` inside the [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).

In any case, here is an equivalent ES6 code using fat arrow functions which preserve `this` value:

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

<i class="devicons devicons-react"></i> React is a JavaScript library for building web user interfaces. You could say it competes against <i class="devicons devicons-angular"></i> AngularJS, <i class="devicons devicons-ember"></i> Ember.js, <i class="devicons devicons-backbone"></i> Backbone and <i class="devicons devicons-webplatform"></i> Polymer despite being much smaller in scope. React is just the **V** in **MVC** (Model-View-Controller) architecture.

So, what is so special about React?

React components are written in a very declarative style. Unlike the "old way" using jQuery and such, you don't touch the DOM directly. React manages all UI updates for you when the underlying data changes.

React is also very fast all thanks to the Virtual DOM and diffing algorithm under the hood. When the data changes, React calculates the minimum number of DOM manipulations needed then efficiently re-renders the component. For example, if there are 10,000 rendered items on a page and only 1 item changes, React will update just that DOM element, leaving 9,999 other items unchanged. That's why React can get away with re-rendering the entire component without being ridiculously wasteful.

Other notable React features include:

- **Composability**, i.e. make bigger, more complex components out of smaller components.
- **Relatively easy to pick up** since there isn't that much to learn and it does not have a massive documentation like AngularJS and Ember.js.
- **Server-side rendering**.
- The most **helpful error and warning messages** in any JavaScript library.
- **Components are self-contained**; markup and behavior live in the same place, making components very reusable.

---

Before going any further please watch this awesome video [React in 7 Minutes](https://egghead.io/lessons/react-react-in-7-minutes) by John Lindquist.

While learning React, the biggest challenge for me was that it required a completely different thinking approach to building UIs. Which is why reading [Thinking in React](https://facebook.github.io/react/docs/thinking-in-react.html) guide is an absolute must for anyone who is starting out with React.

If we are to break apart New Eden Faces UI into components this is what it would look like:

![](/images/blog/Screen Shot 2015-06-21 at 11.45.38 PM copy.png)

<div class="admonition note">
  <div class="admonition-title">Note</div>
  Each component should try to adhere to the <em>single responsibility principle</em>. If you find yourself working on a component that does too many things, perhaps it's best to split it into sub-components. Having said that, I typically write monolithic components first, just to get it working, then refactor it by breaking it into smaller sub-components.
</div>

The top-level <span style='color: #FF4136'>App</span> component contains <span style='color: #0074D9'>Navbar</span>, <span style='color: #0074D9'>Homepage</span> and <span style='color: #0074D9'>Footer</span> components. <span style='color: #0074D9'>Homepage</span> component contains two <span style='color: #2ECC40'>Character</span> components.

So, whenever you have a certain UI design in mind, start by breaking it apart from top-down and always be mindful of how your data propagates from parent to child, child to parent and between sibling components or you will quickly find yourself thinking *"WTF, how do I do this in React? This would have been so much simpler with jQuery... To hell with React."*.

---

All components in React have a `render()` method. It always returns a *single child* element. In other words, the following return block is invalid because it contains 3 child elements:

```html
render() {
    return (
      <li>Achura</li>
      <li>Civire</li>
      <li>Deteis</li>
    );
  }
```

The HTML markup above is actually called [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html). As far syntax goes, it is just slightly different from HTML, e.g. `className` instead of `class` to define CSS classes. You will learn more about it as we start building the app.

The [`componentDidMount`](https://facebook.github.io/react/docs/component-specs.html#mounting-componentdidmount) method in React is the closest thing to [`$(document).ready`](https://learn.jquery.com/using-jquery-core/document-ready/) in jQuery. This method runs once, only on the client (not on the server) immediately after initial rendering of the component. This is where you would initialize third-party libraries and jQuery plugins, or connect to Socket.IO.

You will be using [Ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) in the [`render`](https://facebook.github.io/react/docs/component-specs.html#render) method quite a lot: hiding an element when data is empty, conditionally using CSS classes depending on some value, hiding or showing certain elements based on the component's state and etc.

```js
render() {
  let delta = this.props.delta ? (
    <strong className={this.props.delta > 0 ? 'text-success' : 'text-danger'}>
      {this.props.delta}
    </strong>
  ) : null;

  return (
    <div className='card'>
      <div className='card-body'>
        {delta}
        {this.props.title}
        {this.props.description}
      </div>
    </div>
  );
}
```

We have only scratched the surface of everything there is to React, but this should be enough to give you a general idea about it.

React by itself is actually very simple and easy to grasp. However, it is when we start talking about [Flux](https://facebook.github.io/flux/) application architecture, things get a bit confusing.

## Step 6. Flux Architecture Crash Course

Have you seen this diagram before? Did it make any sense to you? It did not make any sense to me, no matter how many times I looked at it.

![](/images/blog/flux-diagram.png)

Now that I understand it better, I am actually really amazed by how such simple architecture can be presented in a such complicated manner. But to Facebook's credit, their [new diagrams](https://facebook.github.io/flux/docs/overview.html#structure-and-data-flow) are much better.

<div class="admonition note">
  <div class="admonition-title">Fun Fact</div>
 When I first began writing this tutorial I decided not to use Flux in this project. I could not grasp it for the life of me, let alone teach it to others. But thankfully, I get to work on cool stuff at Yahoo! where I get to play and experiment with different technologies during my work hours.
</div>

Instead of reiterating the [Flux: Overview](https://facebook.github.io/flux/docs/overview.html), let's take a look at one of the real-world use cases in order to illustrate how Flux works:

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

6. At this point the *Overview* component has all the data it needs, which is then passed down to all children components.

7. When the date range is updated from the dropdown menu, the whole process is repeated all over again.

<div class="admonition note">
  <div class="admonition-title">Note</div>
 Action names are irrelevant, use whatever naming convention you want as long as it is descriptive.
</div>

Ignoring the *Dispatcher* for a moment, can you see the one-way flow outlined above?

![](/images/blog/flux-simple-f8-diagram-1300w.png)

**Flux Summary**

Flux is really just a fancy term for **pub/sub** architecture, i.e. data always flows one way through the application and it is picked up along the way by various subscribers who are listening to it.

---

There are more than a dozen of Flux implementations at the time of writing. Out of them all, I only have experience with [RefluxJS](https://github.com/spoike/refluxjs) and [Alt](http://alt.js.org/) libraries. Between those two, personally I prefer Alt for its simplicity, excellent support from *@goatslacker* in Gitter chatroom, extremely easy enable server-side rendering, great documentation and the project is actively maintained.

I strongly encourage you to go through the Alt's [Getting Started](http://alt.js.org/guide/) guide. It will take no more than 10 minutes to skim through it.
 
 
## Step 7. React Routes (Client-Side)

Create a new file *App.js* inside **<i class="fa fa-folder-open"></i>app/components** with the following contents:

```js
import React from 'react';
import {RouteHandler} from 'react-router';

class App extends React.Component {
  render() {
    return (
      <div>
        <RouteHandler />
      </div>
    );
  }
}

export default App;
```

`RouteHandler` is a component that renders the active child route handler. It will render the following components: *Home*, *Top 100*, *Profile* or *Add Character*, depending on the URL.


<div class="admonition note">
  <div class="admonition-title">Note</div>
It is similar to <a href="https://docs.angularjs.org/api/ngRoute/directive/ngView"><code>&lt;div ng-view&gt;&lt;/div&gt;</code></a> in AngularJS, which includes the rendered template of current route into the main layout.
</div>

Next, create another file called *routes.js* inside **<i class="fa fa-folder-open"></i>app** and paste the following:

```js
import React from 'react';
import {Route, NotFoundRoute} from 'react-router';
import App from './components/App';
import Home from './components/Home';

export default (
  <Route handler={App}>
    <Route path='/' handler={Home} />
  </Route>
);
```

The reason why we nested the routes this way is that we are going to add *Navbar* and *Footer* components into the *App* component, before and after the `RouteHandler` respectively. Unlike other components, *Navbar* and *Footer* do not change between the route transitions. (See outlined screenshot from **Step 5**)

Lastly, we need to listen to the url and render the application. Create a new file *main.js* inside **<i class="fa fa-folder-open"></i>app** and paste the following:

```js
import React from 'react';
import Router from 'react-router';
import routes from './routes';

Router.run(routes, Router.HistoryLocation, function(Handler) {
  React.render(<Handler />, document.getElementById('app'));
});
```

<div class="admonition note">
  <div class="admonition-title">Note</div>
The <em>main.js</em> is the entry point for our React application. We use it in <em>gulpfile.js</em> where Browserify will traverse the entire tree of dependencies and generate the final <em>bundle.js</em> file. You will rarely have to touch this file after the initial setup.
</div>

The [react-router](http://rackt.github.io/react-router/) runs the routes from *routes.js*, matches them against a URL, and then executes the callback, which in this case means rendering a React component into `<div id="app"></div>`. Which component? If we are on the `/` URL path, then `<Handler />` is *Home* component, because that is what we have specified in *routes.js*. We will add more routes shortly.

Also, notice that we are using [`HistoryLocation`](http://rackt.github.io/react-router/#HistoryLocation) to enable HTML5 History API in order to make URLs look pretty. For example, it navigates to `http://localhost:3000/add` instead of  `http://localhost:3000/#add`. Since we are building an Isomorphic React application (rendered on the server and the client) we do not have to do any [wildcard redirects on the server](https://github.com/sahat/tvshow-tracker/blob/master/server.js#L343-L345) to enable this support.

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

This should be everything we have created so far. Perhaps now would be a good time to double check your code.

![](/images/blog/Screenshot 2015-06-22 21.09.21.png)

We just need to set up a couple more things on the back-end, then we can finally run the app.

## Step 8. React Routes (Server-Side)

Open *server.js*, then "require" the following modules:

```js
var swig  = require('swig');
var React = require('react');
var Router = require('react-router');
var routes = require('./app/routes');
```

Next, add this [Express middleware](http://expressjs.com/guide/using-middleware.html) somewhere in *server.js*:

```js
app.use(function(req, res) {
  Router.run(routes, req.path, function(Handler) {
    var html = React.renderToString(React.createElement(Handler));
    var page = swig.renderFile('views/index.html', { html: html });
    res.send(page);
  });
});
```

![](/images/blog/Screenshot 2015-06-22 22.01.53.png)

This middleware function will be executed on every request to the server. The main difference between `Router.run` in *server.js* and `Router.run` in *main.js* is how the app renders.

On the client-side, a rendered HTML markup gets inserted into `<div id="app"></div>`, whereas on the server-side a rendered HTML markup is sent to the *index.html* template where it is inserted into `<div id="app">{% raw %}{{ html|safe }}{% endraw %}</div>` by the [Swig](http://paularmstrong.github.io/swig/) template engine. *I chose Swig because I wanted to try something other than [Jade](http://jade-lang.com/) and [Handlebars](http://handlebarsjs.com/) this time*.

But do we really need a separate template for this? Why not just render everything inside the *App* component? Yes, you could do it, as long as you are okay with [invalid HTML markup](https://validator.w3.org/) and not being able to include inline script tags like Google Analytics directly in the *App* component. But having said that, invalid markup is probably not relevant to SEO anymore and there are [workarounds](https://github.com/hzdg/react-google-analytics/blob/master/src/index.coffee) to include inline script tags in React components. So it's up to you, but for the purposes of this tutorial we will be using a Swig template.

Create a new folder **<i class="fa fa-folder-open"></i>views** in the root directory, next to *package.json* and *server.js*. Then inside **<i class="fa fa-folder-open"></i>views**, create a new file *index.html*:

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

Open two Terminal tabs. In one tab run `gulp` to build the React app, concatenate JS libraries and compile LESS stylesheets, and then start watching for file changes:
![](/images/blog/Screenshot 2015-06-22 22.47.05.png)

In another tab, run `npm run watch` to start the Node.js server and automatically restart the process on file changes:

![](/images/blog/Screenshot 2015-06-22 22.50.23.png)

Now visit [`http://localhost:3000`](http://localhost:3000) and you should see our React app render successfully:

![](/images/blog/Screenshot 2015-06-22 22.53.01.png)

We did an impressive amount of work just to display an empty page with a simple alert message! Fortunately for us, the most difficult part is behind. Now we can chillax and focus on building new React components and implementing the REST API endpoints. 

Both `gulp` and `npm run watch` processes will take care of everything for us. We no longer need to worry about re-compiling the app after adding new React components or restarting the Express app after making changes to *server.js*.


## Step 9. Footer and Navbar Components

Both *Navbar* and *Footer* components are both relatively simple. The *Footer* component fetches the Top 5 characters from the server. The *Navbar* component fetches the total character count and it also intializes Socket.IO even listeners to display how many users are currently online.


## Step 10. Socket.IO - Real-time User Count
























Here is a more practical example in the context of React:

```js
// ES6
class Hello extends React.Component {
  render() {
    return <div>Hello World!</div>;
  }
}

export default Hello;
```

```js
// ES5
var Hello = React.createClass({
  render: function() {
    return <div>Hello World!</div>;
  }
});

module.exports = Hello;
```

If you have used React before, there is something you need to keep in mind when creating React components using ES6 classes. Component methods no longer autobind `this` context. For example, when calling an internal component method that uses `this`, you have to `.bind(this)` explicitly. Previously, `React.createClass()` was doing it for us internally:

> **Autobinding**: When creating callbacks in JavaScript, you usually need to explicitly bind a method to its instance such that the value of **this** is correct. With React, every method is automatically bound to its component instance.

```js
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = AppStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    // `this` will be undefined without binding it explicitly.
    this.setState(AppStore.getState())
  }

  render() {
    return null;
  }
}
```
