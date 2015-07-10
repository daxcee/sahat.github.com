---
layout: post
title: Create a character voting game using React, Node.js, MongoDB and Socket.IO
excerpt: "In this tutorial we are going to build a character voting game (inspired by Hot or Not) for EVE Online - a massively multiplayer online game. You will learn how to build a REST API with <strong>Node.js</strong>, save and retrieve data from <strong>MongoDB</strong>, track online visitors in real-time using <strong>Socket.IO</strong>, build a single-page app experience using <strong>React</strong> + <strong>Flux</strong> and then finally deploy it to the cloud."
gradient: 1
image: blog/create-an-eve-online-character-voting-game-using-react-nodejs-mongodb-and-socketio-cover.jpg
---

## Overview

In this tutorial we are going to build a character voting game (inspired by *Facemash* and *Hot or Not*) for [EVE Online](http://www.eveonline.com/) - massively multiplayer online game. If you are not familiar with EVE Online, see this [video](https://www.youtube.com/watch?v=e2X1MIR1KMs).

![](/images/blog/Screenshot 2015-03-31 23.05.36.png)

<ul class="list-inline text-center">
  <li><a href="#"><i class="ion-monitor"></i> Live Demo</a></li>
  <li><a href="#"><i class="fa fa-github"></i> Source Code</a></li>
</ul>

In the same spirit as [Create a TV Show Tracker using AngularJS, Node.js and MongoDB](http://sahatyalkabov.com/create-a-tv-show-tracker-using-angularjs-nodejs-and-mongodb/) and [Build an Instagram clone with AngularJS, Satellizer, Node.js and MongoDB](https://hackhands.com/building-instagram-clone-angularjs-satellizer-nodejs-mongodb/) this is a full-stack JavaScript tutorial where we build a fully functioning app from the ground up.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  This is a remake of the original <a href="http://www.newedenfaces.com/">New Eden Faces</a> (2013) project, which was my first ever single-page application written in Backbone.js.
</div>

Usually, I try to make as few assumptions as possible about a particular topic, which is why my tutorials are so lengthy, but having said that, you need to have at least some prior experience with client-side JavaScript frameworks and Node.js to get the most out of this tutorial. I will not be going over [Express](http://expressjs.com/) and [Mongoose](http://mongoosejs.com/) basics all over again because I have already covered it [here](http://sahatyalkabov.com/create-a-tv-show-tracker-using-angularjs-nodejs-and-mongodb/) and [here](http://sahatyalkabov.com/build-an-instagram-clone-using-angularjs-satellizer-nodejs-and-mongodb/) and [here](https://github.com/sahat/hackathon-starter#how-it-works-mini-guides) and [here](http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/).

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

Open *main.less* that we have just created and paste the CSS styles from the following file. Due to the sheer length of it, I have decided not to include it in this post.

- <a href="https://github.com/sahat/newedenfaces-react/blob/master/app/stylesheets/main.less"><i class="devicons devicons-css3"></i> main.less</a>

If you have used the [Bootstrap framework](http://getbootstrap.com/) at all, then most of it should be pretty familiar to you.


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

Alternatively, we could have assigned `this` to a variable, e.g. `var self = this` and then used `self.setState` instead of `this.setState` inside the [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).

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

I really like this excerpt from the [React v0.14 Beta 1 blog post](http://facebook.github.io/react/blog/2015/07/03/react-v0.14-beta-1.html) announcement:

> It's become clear that the beauty and essence of React has nothing to do with browsers or the DOM. We think the true foundations of React are simply ideas of components and elements: being able to describe what you want to render in a declarative way.

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

The HTML markup above is actually called [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html). As far syntax goes, it is just slightly different from HTML, e.g. `className` instead of `class` to define CSS classes. You will learn more about it as we start building the app.

When I first saw that syntax, I was immediately repulsed by it. I am used to returning booleans, numbers, strings, objects and functions in JavaScript, but certaintly not that. However, JSX is actually just a syntactic sugar. After fixing the markup above by wrapping it with a `<ul>` tag, here is what it would look like without JSX:

```js
render() {
  return React.createElement('ul', null,
    React.createElement('li', null, 'Achura'),
    React.createElement('li', null, 'Civire'),
    React.createElement('li', null, 'Deteis')
  );
}
```

I think you will agree that JSX is far more readable than plain JavaScript. Furthermore, [Babel](http://babeljs.io/) has a built-in support for JSX, so we don't need to do anything extra. If you have ever worked with AngularJS directives then you will appreciate working with self-contained components, instead of having two different files: *directive.js* (logic) and *template.html* (presentation).

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

Flux is the application architecture that was developed at Facebook for building scalable client-side web applications.
 It complements React's components by utilizing a unidirectional data flow. Flux is more of a pattern than a framework, however, we will be using a Flux library called [Alt](http://alt.js.org) to minimize writing boilerplate code.

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

There are more than a dozen of Flux implementations at the time of writing. Out of them all, I only have experience with [RefluxJS](https://github.com/spoike/refluxjs) and [Alt](http://alt.js.org/) libraries. Between  two, I personally prefer Alt for its simplicity, great support by [*@goatslacker*](https://github.com/goatslacker), server-side rendering support, great documentation and the project is actively maintained at the time of writing.

I strongly encourage you to go through the Alt's [Getting Started](http://alt.js.org/guide/) guide. It will take no more than 10 minutes to skim through it.

If you are undecided on the Flux library, consider the following [comment](https://news.ycombinator.com/item?id=9833099) by *glenjamin* on Hacker News, in response to having a hard time figuring out which Flux library to use:

> The dirty secret is: they're probably all fine.
It's unlikely that you will choose a flux lib that will be the make or break point of your application.
Even if a library stops being "maintained", most decent flux incarnations are really small (~100 LoC) - it's unlikely that there's some fatal flaw you'll be stuck with.
In summary: redux is neat, but don't beat yourself up over choosing the perfect flux lib - just grab one that you like the look of and move on with building your application.


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

Next, open *routes.js* inside **<i class="fa fa-folder-open"></i>app** and paste the following:

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

Lastly, we need to listen to the url and render the application. Open *main.js* inside **<i class="fa fa-folder-open"></i>app** that we created earlier and paste the following:

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

One last thing, open *alt.js* in **<i class="fa fa-folder-open"></i>app** and paste the following code. I will explain its purpose in **Step 9** when we actually get to use it.

```js
import Alt from 'alt';

export default new Alt();
```

Now we just need to set up a few more things on the back-end and then we can finally run the app.

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

We did an impressive amount of work just to display an empty page with a simple alert message! Fortunately, the most difficult part is behind us. Now we can chillax and focus on building new React components and implementing the REST API endpoints.

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

Just this once, I will show an ES5-equivalent code for this component in case you are still not comfortable with the ES6 syntax. Also, see [Using Alt with ES5](http://alt.js.org/guides/es5/) guide for syntax differences when creating actions and creating stores.

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

You may or may not be familiar with the [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method in JavaScript. Even if you have used it before, it may still be unclear how it works in the context of JSX. (Something that [React Tutorial](http://facebook.github.io/react/docs/tutorial.html#hook-up-the-data-model) regretfully does not explain well.)

It is basically a *for-each* loop, similar to what you might see in [Jade](http://jade-lang.com/reference/iteration/) and [Handlebars](http://handlebarsjs.com/builtin_helpers.html#iteration), but here you can assign the results to a variable, which can then be used with JSX by wrapping it in curly braces. It's a very common pattern in React so you will be using it quite frequently.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  When rendering <a href="https://facebook.github.io/react/docs/multiple-components.html#dynamic-children">dynamic children</a>, such as <code>leaderboardCharacters</code> above, React requires that you use the <code>key</code> property to uniquely identify each child element.
</div>

The [`Link`](http://rackt.github.io/react-router/#Link) component will render a fully accesible anchor tag with the proper *href*. A [`Link`](http://rackt.github.io/react-router/#Link) also knows when the route it links to is active and automatically applies its "active" CSS class.

**<i class="devicons devicons-react"></i> Action**

Next, we are going to create an action and a store for the *Footer*  component. Create a new file called *FooterActions.js* in **<i class="fa fa-folder-open"></i>app/actions** directory:

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


The two shorthand actions above created via `generateActions` and the following two actions are equivalent, so use either notation based on your preference:

```js
getTopCharactersSuccess(payload) {
  this.dispatch(payload);
}

getTopCharactersFail(payload) {
  this.dispatch(payload);
}
```

And lastly, we wrap the *FooterActions* class with [`alt.createActions`](http://alt.js.org/docs/createActions/#createActions) and then export it, so that we could import and use it in the *Footer* component.

**<i class="devicons devicons-react"></i> Store**

Next, create a new file called *FooterStore.js* in **<i class="fa fa-folder-open"></i>app/stores** directory:

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

All instance variables of the store, i.e. values assigned to `this`, will become part of state. When *Footer* component initially calls `FooterStore.getState()` it receives the current state of the store specified in the constructor.

[`bindActions`](http://alt.js.org/docs/createStore/#storemodelbindactions) is a magic Alt method which binds actions to their handlers defined in the store. For example, an action with the name `foo` will match an action handler method defined in the store named `onFoo` or just `foo` but not both. That is why for actions `getTopCharactersSuccess` and `getTopCharactersFail` defined in *FooterActions.js* we have corresponding store handlers called `onGetTopCharactersSuccess` and `onGetTopCharactersFail`.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  For more precise control over which actions the store listens to and what handlers those actions are bound to, see <a href="http://alt.js.org/docs/createStore/#storemodelbindlisteners"><code>bindListeners</code></a> method.
</div>

I hope it's pretty clear by now that when `getTopCharactersSuccess` action is fired, `onGetTopCharactersSuccess` handler function is executed and the store is updated with the new data that contains *Top 5 Characters*. And since we have initialized the store listener in *Footer* component, it will be notified that the store has been updated and the component will re-render accordingly.

We will be using [Toastr](http://codeseven.github.io/toastr/demo.html) JavaScript library for notifications. Why not just use pure React notification component you may ask? While you may find some notification components built specifically for React, I personally think it is one of the few areas that should not be handled by React (*along with tooltips*). I think it is far easier to display a notification imperatively from any part of your application than having to declaratively render notification component based on the current state. I have built a notification component with React and Flux before, but frankly, it wasn't very intuitive to me.

Open *App.js* component, then add `<Footer />` right after the `<RouterHandler />` component:

```html
<div>
  <RouteHandler />
  <Footer />
</div>
```

![](/images/blog/Screenshot 2015-06-30 12.45.26.png)

We will implement Express API endpoints and populate the database with characters shortly. Alright, let's move on to the *Navbar* component. Since I have already covered the basics behind Alt actions and stores, and how they fit in our app architecture, this will be a relatively short sub-section.

---

**<i class="devicons devicons-react"></i> Component**

Create a new file *Navbar.js* inside **<i class="fa fa-folder-open"></i>components** directory:

```js
import React from 'react';
import {Link} from 'react-router';
import NavbarStore from '../stores/NavbarStore'
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

  onChange() {
    this.setState(NavbarStore.getState());
  }

  handleSubmit(event) {
    event.preventDefault();

    let searchQuery = this.state.searchQuery.trim();

    if (searchQuery) {
      NavbarActions.findCharacter({
        searchQuery: searchQuery,
        searchFormNode: this.refs.searchForm.getDOMNode(),
        router: this.context.router
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
            <span ref='triangles' className={'triangles animated ' + this.state.ajaxAnimation}>
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

Navbar.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default Navbar;
```

Ok, I'll admit, it is certainly possible to write most of the above markup dynamically with less lines of code by iterating through all races, then through all bloodlines, but to me writing out was the most straightforward approach.

One thing you will probably notice right away is the class variable `contextTypes`. We need it for referencing an instance of the router, which in turn gives us access to current *path*, current *query parameters*, *route parameters* and *transitions* to other routes. We do not use it directly in the *Navbar* component but instead pass it as an argument to *Navbar* actions so it could navigate to a particular character profile page after fetching character data from the server.

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


**<i class="devicons devicons-react"></i> Action**

Let's create a new file *NavbarActions.js* in **<i class="fa fa-folder-open"></i>app/actions** directory:

```js
import alt from '../alt';

class NavbarActions {
  constructor() {
    this.generateActions(
      'updateOnlineUsers',
      'updateAjaxAnimation',
      'updateSearchQuery',
      'getCharacterCountSuccess',
      'getCharacterCountFail'
    );
  }

  findCharacter(payload) {
    $.ajax({
      url: '/api/characters/search',
      data: { name: payload.searchQuery }
    })
      .done((data) => {
        payload.router.transitionTo('/characters/' + data.characterId);
      })
      .fail(() => {
        payload.searchFormNode.classList.add('shake');
        setTimeout(() => {
          payload.searchFormNode.classList.remove('shake');
        }, 1000);
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

All these actions should pretty self-explanatory, but I will explain each one for completeness:

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

Create a new file *NavbarStore.js* in **<i class="fa fa-folder-open"></i>app/stores** directory:

```js
import alt from '../alt';
import NavbarActions from '../actions/NavbarActions';

class NavbarStore {
  constructor() {
    this.bindActions(NavbarActions);
    this.totalCharacters = 0;
    this.onlineUsers = 0;
    this.searchQuery = '';
    this.ajaxAnimation = '';
  }

  onUpdateOnlineUsers(data) {
    this.onlineUsers = data.onlineUsers;
  }

  onUpdateAjaxAnimation(cssClass) {
    this.ajaxAnimation = cssClass;
  }

  onUpdateSearchQuery(event) {
    this.searchQuery = event.target.value;
  }

  onGetCharacterCountSuccess(data) {
    this.totalCharacters = data.count;
  }

  onGetCharacterCountFail(jqXhr) {
    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
  }
}

export default alt.createStore(NavbarStore);
```

Recall this line in the *Navbar* component that we created above:

```html
<input type='text' className='form-control' placeholder={this.state.totalCharacters + ' characters'} value={this.state.searchQuery} onChange={NavbarActions.updateSearchQuery} />
```

Since [`onChange`](https://facebook.github.io/react/docs/forms.html#interactive-props) handler returns and *event* object, we are using `event.target.value` to get the text field value inside `onUpdateSearchQuery` function.

Open *App.js* component, then add `<Navbar />` right before the `<RouterHandler />` component:

```html
<div>
  <Navbar />
  <RouteHandler />
  <Footer />
</div>
```

![](/images/blog/Screenshot 2015-07-04 13.02.12.png)

Since we haven't yet configured Socket.IO on the server or implemented any of the API routes, you will not see the total number of online visitors (*red circle*) or total characters (*placeholder text*).

## Step 10. Socket.IO - Real-time User Count

Unlike the previous section, this one will be fairly short and focused specifically on server-side Socket.IO.

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

Open *index.html* in the **<i class="fa fa-folder-open"></i>views** directory and add the following line right next to other scripts:

```html
<script src="/socket.io/socket.io.js"></script>
```

![](/images/blog/Screenshot 2015-07-04 13.02.15.png)

Refresh the browser and open http://localhost:3000 in multiple tabs to simulate multiple user connections, and you should see the number of visitors in the red circle next to the logo.


![](/images/blog/Screenshot 2015-07-04 13.25.42.png)

At this point we are neither finished with the front-end nor have any working API endpoints. We could have focused on building just the front-end in the first half of the tutorial and then the back-end in the second half of the tutorial, or vice versa, but personally, I have never built a single app like that. I like having constant feedback and going back and forth between back-end and front-end during the development flow.

We can't display any characters until they are added to the database. In order to add new characters to the database we need to build a UI for it and implement an API endpoint. That's what we will do next.

## Step 11. Add Character Component

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

In the next few sections we will implement the back-end code for adding a new character and saving it to database.

## Step 12. Database Schemas

Add the following lines at the beginning of *server.js*, next to all other module dependencies:

```js
var mongoose = require('mongoose');

var Character = require('./models/character'); // we will create it next.
```

Next, add this code anywhere between module dependencies and Express middlewares. This will automatically establish a connection pool with MongoDB when we start the server. Note that the database hostname will be set in *config.js* to avoid hard-coding the value here.

```js
mongoose.connect(config.database);
 // Optional, but helpful for local development.
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});
```

## Step 13. Add Character API Endpoint

We will be using [EVE Online API](http://wiki.eve-id.net/APIv2_Page_Index) for fetching basic character information such as *Character ID*, *Race* and *Bloodline*.

<div class="admonition note">
  <div class="admonition-title">Note</div>
  Character gender is not a public data; it requires an API key. In my opinion, what makes New Eden Faces so great is its open nature - a user does not need to be authenticated and anyone can add any other character to the roster. That is why we have two radio buttons for gender selection on the <em>Add Character</em> page. It does depend on user's honesty, however.
</div>

TODO: Add request and async dependencies

Add the following Express route to *server.js*. Place it anywhere after the "static" middleware*, but before the "react" middleware. Also, from here on, this where you are going to place all Express routes that we are going to implement in the next few sections:

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

![](/images/blog/Screenshot 2015-07-10 01.59.10.png)

## Step xx. Helpful Resources for React
