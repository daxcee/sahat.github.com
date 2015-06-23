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

Before we jump into building the React app, I have decided to dedicate the next three sections to ES6 and React basics. It may be too overwhelming trying to grasp everything at once. Personally, I had a very hard time following some React + Flux examples written in ES6 because I was learning the new syntax, a new framework and a completely unfamiliar app architecture all at the same time.

Since I can't cover everything, I will only be covering topics that you need to know specifically for this tutorial.

## Step 4*. ES6 Crash Course

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

## Step 5*. React Crash Course

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

## Step 6*. Flux Architecture Crash Course

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
      <div>Hello from Home Component</div>
    );
  }
}

export default Home;
```

This should be everything we have created so far. Perhaps now would be a good time to double check your code.

![](/images/blog/Screenshot 2015-06-22 21.09.21.png)

We just need to set up a couple more things on the back-end, then we can run the app.

## Step 8. React Routes (Server-Side)



## 333. e


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
