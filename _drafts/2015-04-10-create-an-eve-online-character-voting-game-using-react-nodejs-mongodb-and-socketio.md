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
  <li><a href="#"><i class="fa fa-flash"></i> Live Demo</a></li>
  <li><a href="#"><i class="fa fa-github"></i> Source Code</a></li>
</ul>



In the same spirit as [Create a TV Show Tracker using AngularJS, Node.js and MongoDB](http://sahatyalkabov.com/create-a-tv-show-tracker-using-angularjs-nodejs-and-mongodb/) and [Build an Instagram clone with AngularJS, Satellizer, Node.js and MongoDB](https://hackhands.com/building-instagram-clone-angularjs-satellizer-nodejs-mongodb/) this is a full-stack JavaScript tutorial where we build a fully functioning app from the ground up.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  This is a remake of the original <a href="http://newedenfaces.com">New Eden Faces</a> (2013) project, which was my first single-page application written in Backbone.js.
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

{% highlight js %}
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
{% endhighlight %}

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

{% highlight js %}
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
{% endhighlight %}

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

{% highlight js %}
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
{% endhighlight %}

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

{% highlight js %}
{
  "name": "newedenfaces",
  "dependencies": {
    "jquery": "^2.1.4",
    "bootstrap": "^3.3.5",
    "magnific-popup": "^1.0.0",
    "toastr": "^2.1.1"
  }
}
{% endhighlight %}

<div class="admonition note">
  <div class="admonition-title">Note</div>
 <i class="devicons devicons-bower"></i>Bower is a package manager that lets you easily download JavaScript libraries, such as the ones specified above, via a command line instead of visiting each individual website, downloading, extracting and adding it to the project manually.
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

Before we jump into building the React app, I have decided to dedicate the next two sections to ES6 and React. Since I can't cover everything, I will only be covering topics that you need to know specifically for this tutorial, no more and no less.

## 3. ES6 Crash Course

I assume that everyone is familiar with the current JavaScript (ES5). The best way to learn this is by showing an equivalent ES5 code for every ES6 snippet.

**Modules**

{% highlight js %}
// ES6
import React from 'react';
import {Route, DefaultRoute, NotFoundRoute} from 'react-router';
{% endhighlight %}

{% highlight js %}
// ES5
var React = require('react');
var Router = require('react-router');

var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
{% endhighlight %}

Using the [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) in ES6 we can import a subset of a module which can be quite handy for modules like *react-router* and *underscore* where it exports more than one function.

One thing to keep in mind is that ES6 imports are hoisted. All dependent modules will be loaded before any of the module code is executed. In other words, you can't conditionally load a module like with CommonJS. That threw me off a little when I tried to put the import statement inside the if-condition.

To learn more about ES6 modules check out this [2ality blog post](http://www.2ality.com/2014/09/es6-modules-final.html). For a detailed overview of the `import` statement see this [MDN page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

**Modules**














## 3. React Crash Course

U

