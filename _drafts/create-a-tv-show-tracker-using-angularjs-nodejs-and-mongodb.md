---
layout: post
title: Create a TV Show Tracker using AngularJS, Node.js and MongoDB
excerpt: "This tutorial will show you how to build a REST API with <strong>Express</strong>, authentication and signup process with <strong>Passport</strong>, create and retrieve data from MongoDB using <strong>Mongoose</strong>. The front-end will be built using <strong>AngularJS</strong> and <strong>Bootstrap Sass</strong>. The last step involves using <strong>gulp.js</strong> to optimize your static assets."
gradient: 3
image: blog/tvshow-tracker-cover.jpg
---

Before proceeding further, I will assume you have already installed the following:

- [Node.js](http://nodejs.org)
- [MongoDB](http://www.mongodb.org/downloads)
- [Express Generator](https://github.com/expressjs/generator)

## Step 1: New Express Project

Run `express showtrackr` to create a new Express project. 

![](/images/blog/tvshow-tracker-1.png)

Navigate into the <span class="fa fa-folder-open"></span> **showtrackr** directory then run `npm install` command.

![](/images/blog/tvshow-tracker-2.png)

Remove <span class="fa fa-folder-open"></span> **views**, <span class="fa fa-folder-open"></span> **routes** and <span class="fa fa-folder-open"></span> **bin** directories because you will not be needing them anymore. Also, rename `app.js` to `server.js` since we will have another `app.js` file for bootstraping the AngularJS application.

![](/images/blog/tvshow-tracker-3.png)

Replace everything inside the `server.js` with the following code:

{% highlight js %}
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
{% endhighlight %}

## Step 2: Bootstrapping AngularJS Application

Download and extract the [Boostrap Sass](http://getbootstrap.com/getting-started/).

![](/images/blog/tvshow-tracker-4.png)

Copy all glyphicons from *vendor/assets/fonts/bootstrap* to <span class="fa fa-folder-open"></span> **public/fonts** directory and **bootstrap** from *vendor/assets/stylesheets* directory to <span class="fa fa-folder-open"></span> **public/stylesheets** directory.

![](/images/blog/tvshow-tracker-5.png)

Download [this favicon](http://i.imgur.com/A38jRib.png) and place it inside <span class="fa fa-folder-open"></span> **public** directory. You don't really need it but it's a nice touch.

 You will also need to download the following scripts and place them inside the <span class="fa fa-folder-open"></span> **public/vendor** directory:

- [angular.js](https://angularjs.org)
- [angular-strap.js](https://github.com/mgcrea/angular-strap/tree/master/dist)
- [angular-strap.tpl.js](https://github.com/mgcrea/angular-strap/tree/master/dist)
- [angular-message.js](https://code.angularjs.org/1.3.0-beta.10/)
- [angular-resource.js](https://code.angularjs.org/1.3.0-beta.10/)
- [angular-route.js](https://code.angularjs.org/1.3.0-beta.10/)
- [angular-cookies.js](https://code.angularjs.org/1.3.0-beta.10/)
- [moment.min.js](http://momentjs.com/)

![](/images/blog/tvshow-tracker-6.png)

Create `index.html` in **public** directory with the following contents:

{% highlight html %}
<!DOCTYPE html>
<html ng-app="MyApp">
<head>
  <base href="/">
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ShowTrackr</title>
  <link rel="icon" type="image/png" href="favicon.png"/>
  <link href="stylesheets/style.css" rel="stylesheet">
</head>
<body>

<div ng-view></div>

<script src="vendor/angular.js"></script>
<script src="vendor/angular-strap.js"></script>
<script src="vendor/angular-strap.tpl.js"></script>
<script src="vendor/angular-messages.js"></script>
<script src="vendor/angular-resource.js"></script>
<script src="vendor/angular-route.js"></script>
<script src="vendor/angular-cookies.js"></script>
<script src="vendor/moment.min.js"></script>
</body>
</html>
{% endhighlight %}

On **Line 2** the `ng-app` tells Angular to consider this to be the root element of our application. On **Line 4** the `<base href="/">` tag is necessary to enable HTML5 History API in AngularJS. This will allow us to have clean URLs without the `#` symbol. The `ng-view` on **Line 14** is a directive that includes the rendered template of the current route. Every time the current route changes, the included view changes with it according to the configuration of the [$route](https://docs.angularjs.org/api/ngRoute/service/$route) service that we will implement shortly. 

**Note:** This is similar to the [outlet](http://emberjs.com/api/classes/Ember.Handlebars.helpers.html#method_outlet) in Ember.js.

Create a new file `app.js` and add it to the `index.html` after the *vendor* scripts.

{% highlight html %}
<script src="app.js"></script>
{% endhighlight %}

For now `app.js` will only include the following code just to get things started:

{% highlight js %}
angular.module('MyApp', ['ngCookies', 'ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
  .config(function() {

  });
{% endhighlight %}

Let's add an [AngularStrap Navbar](http://mgcrea.github.io/angular-strap/#/page-one#navbars). Place this code right after the opening `<body>` tag:

{% highlight html %}
<div class="navbar navbar-default navbar-static-top"
     role="navigation" bs-navbar>
  <div class="navbar-header">
    <a class="navbar-brand" href="/">
      <span class="glyphicon glyphicon-film"></span>
      Show<strong>Trackr</strong></a>
  </div>
  <ul class="nav navbar-nav">
    <li data-match-route="/$"><a href="/">Home</a></li>
    <li data-match-route="/add"><a href="/add">Add</a></li>
  </ul>
  <ul class="nav navbar-nav pull-right" ng-if="!currentUser">
    <li data-match-route="/login"><a href="/login">Login</a></li>
    <li data-match-route="/signup"><a href="/signup">Sign up</a></li>
  </ul>
  <ul class="nav navbar-nav pull-right" ng-if="currentUser">
    <li class="navbar-text" ng-bind="currentUser.email"></li>
    <li><a href="javascript:void(0)" ng-click="logout()">Logout</a></li>
  </ul>
</div>
{% endhighlight %}

There is only one reason I am using [AngularStrap Navbar](http://mgcrea.github.io/angular-strap/#/page-one#navbars) instead of [Bootstrap Navbar](getbootstrap.com/components/#navbar) - the **active** class is applied automatically to `<li>` elements when you change routes. Plus you get many other awesome directives that integrate with AngualrJS such as *Alert*, *Typeahead*, *Tooltip*, *Tab* and many more.

You could try running the app to make sure there aren't any errors but you won't see a Navbar because we haven't included Bootstrap stylesheets yet. We will be using [gulp](http://gulpjs.com) to compile Sass stylesheets.

Go ahead and install the gulp and gulp plugins:

{% highlight js %}
// Step 1: Install gulp globally
sudo npm install -g gulp

// Step 2: Install gulp in your project
npm install --save-dev gulp gulp-sass gulp-plumber
{% endhighlight %}

Passing the `--save-dev` flag will install and add packages to *devDependencies* in `package.json`.

![](/images/blog/tvshow-tracker-7.png)

Create a new file `gulpfile.js` in the project folder:

{% highlight js %}
var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');

gulp.task('sass', function() {
  gulp.src('public/stylesheets/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('watch', function() {
  gulp.watch('public/stylesheets/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'watch']);
{% endhighlight %}

![](/images/blog/tvshow-tracker-8.png)

The very last line specifies which gulp tasks to run when you execute `gulp` command in the terminal. For now it just compiles Sass stylesheets and watches for file changes, recompiling stylesheets automatically. You may be wondering what is [gulp-plumber](https://github.com/floatdrop/gulp-plumber)? It will prevent pipe breaking caused by errors from gulp plugins. In other words when you make a syntax error in a Sass stylesheet, the gulp watcher will not crash and you won't see this crap happening in the middle of your workflow:

![](/images/blog/tvshow-tracker-9.png)

Create a new file `style.scss` in the <span class="fa fa-folder-open"></span> **public/stylesheets** directory:

{% highlight scss %}
@import url(http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,400,300,600,700);

$icon-font-path: '../fonts/';
$body-bg: #e4e7ec;

$font-family-base: 'Open Sans', sans-serif;
$headings-color: #111;
$headings-font-family: Avenir, sans-serif;
$headings-font-weight: bold;

$brand-success: #22ae5f;
$brand-primary: #1d7cf4;
$brand-danger: #b30015;
$brand-warning: #ffd66a;

$text-muted: #90939a;
$link-color: #000;

$navbar-default-link-active-bg: #f7f7f7;
$navbar-default-link-color: #848484;
$navbar-default-bg: #fff;
$navbar-default-border: #e3e9ec;

$navbar-default-brand-color: #333;
$navbar-default-brand-hover-color: #ffe939;
$navbar-default-brand-hover-bg: #333;

$btn-success-bg: $brand-success;
$btn-success-border: darken($btn-success-bg, 3%);
$btn-primary-bg: $brand-primary;
$btn-primary-border: darken($btn-primary-bg, 3%);

$jumbotron-padding: 16px;
$jumbotron-bg: #f4f6f8;

$alert-border-radius: 0;
$input-border-radius: 0;

$alert-success-text: #fff;
$alert-success-bg: #60c060;
$alert-success-border: darken($alert-success-bg, 3%);

$alert-danger-text: #fff;
$alert-danger-bg: $brand-danger;
$alert-danger-border: darken($alert-danger-bg, 3%);

$alert-info-bg: #e5f7fd;
$alert-info-border: #bcf8f3;
$alert-info-text: #25484e;

@import 'bootstrap/bootstrap';

body {
  padding-bottom: 20px;
}

em {
  font-style: normal;
  text-decoration: underline;
}

.alphabet {
  cursor: pointer;
  font-size: 22px;
  text-align: center;

  li {
    display: inline-block;
    padding-left: 5px;
    padding-right: 5px;

    &:hover {
      color: $brand-primary;
    }
  }
}

.genres {
  cursor: pointer;

  li {
    margin-right: 5px;
    @extend .label;
    @extend .label-default;

    &:active {
      box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.250);
    }
  }
}

.jumbotron {
  margin-top: -20px;
  border-bottom: 1px solid #dae2e4;
}

.media-object {
  max-width: 200px;
  margin-bottom: 10px;
}

.episode {
  border-left: 5px solid #111;
  padding-left: 10px;
}

.alert {
  box-shadow: 0 0px 5px rgba(0, 0, 0, 0.3);
}

.alert.top-right {
  position: fixed;
  top: 50px;
  right: 0;
  margin: 20px;
  z-index: 1050;
  outline: none;

  .close {
    padding-left: 10px
  }
}

.btn {
  border-radius: 2px;
}

.center-form {
  width: 330px;
  margin: 10% auto;

  input {
    border-radius: 0;
  }
}

.search {
  color: #4f4f4f;
  font-weight: 300;
  font-size: 1.5em;
  padding: 7px;
  margin-top: -10px;
  border: 0;
  background-color: transparent;
  outline: none;
  -webkit-appearance: none;

  &:focus {
    -webkit-transition: all .4s ease;
    transition: all .4s ease;
  }
}

.panel {
  border-color: #cfd9D7;
  border-radius: 2px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}

.panel-default > .panel-heading {
  color: #444;
  border-color: #cfd9db;
  font-weight: bold;
  font-size: 85%;
  text-transform: uppercase;
  background-color: #f6f6f6;
}

.label {
  display: inline-block;
  margin-bottom: 5px;
  padding: 4px 8px;
  border: 0;
  border-radius: 3px;
  font-size: 12px;
  transition: 0.1s all;
  -webkit-font-smoothing: antialiased;
}

.label-default {
  background-color: #e4e7ec;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
  color: #90939a;

  &:hover {
    background-color: #90939a;
    color: #f4f6f8;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.2);
  }
}

.navbar {
  box-shadow: 0 3px 2px -3px rgba(0, 0, 0, 0.1);
}

.navbar-header {
  float: left;
  padding-left: 15px;

}

.navbar-brand {
  background-color: #ffe939;
  transition: 0.25s all;
  margin-left: -15px;
}

.navbar-nav {
  float: left;
  margin: 0;

  > li {
    float: left;

    > a {
      padding: 15px;
    }
  }
}
{% endhighlight %}

Run the `gulp` command and refresh the browser.

![](/images/blog/tvshow-tracker-10.png)

Everything in the `style.scss` should be fairly straightforward. There are only a few custom classes, everything else simply overrides the core Bootstrap classes.

## Step 3: AngularJS Routes and Templates

Go back to `app.js` and add this line inside the *config* method to enable HTML5 pushState:

{% highlight js %}
$locationProvider.html5Mode(true);
{% endhighlight %}

What is [$locationProvider](https://docs.angularjs.org/api/ng/provider/$locationProvider) and where does it come from? It's a built-in AngularJS
service for configuring application linking paths. Using this service you can
enable [HTML5 pushState](http://html5demos.com/history) or change URL prefix from `#` 
to something like `#!`, which you will need to do if you are planning to use *Disqus* comments in your AngularJS
application. Simply by adding `$locationProvider` parameter to the *config's* callback
function is enough to tell AngularJS to inject that service and make it available.

{% highlight js %}
angular.module('MyApp', ['ngCookies', 'ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true);


  });
{% endhighlight %}

But what happens when you try to minify this script with UglifyJS? The `$locationProvider` parameter will
be changed to some obscure name and AngularJS won't know what to inject anymore.
You can get around this problem by annotating the function with the names of the dependencies.

{% highlight js %}
angular.module('MyApp', ['ngCookies', 'ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);


  }]);
{% endhighlight %}

Each string in the array is the name of the service to inject for the corresponding parameter.
From now on forward I will be using this notation. 
We are planning to minify and concatenate scripts after all.

Next, we will need routes for the following pages:

- **Home** - display a list of popular shows.
- **Detail** - information about one particular TV show.
- **Login** - user login form.
- **Signup** - user signup form.
- **Add** - add a new show form.

Inject [$routeProvider](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider)
into *config* then add these routes:

{% highlight js %}
$routeProvider
  .when('/', {
    templateUrl: 'views/home.html',
    controller: 'MainCtrl'
  })
  .when('/shows/:id', {
    templateUrl: 'views/detail.html',
    controller: 'DetailCtrl'
  })
  .when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  })
  .when('/signup', {
    templateUrl: 'views/signup.html',
    controller: 'SignupCtrl'
  })
  .when('/add', {
    templateUrl: 'views/add.html',
    controller: 'AddCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
{% endhighlight %}

![](/images/blog/tvshow-tracker-11.png)

For each route there is a template and a controller. If you have a page with
mostly static content then you don't even need to specify a controller. If you reload the
page right now  and open Browser's *Developer Tools* you will see a **404 (Not Found)** error
since we haven't created any 
templates yet.

Create a new file **home.html** in <span class="fa fa-folder-open"> **public/views** directory. This will be a 
place for all AngularJS templates.

{% highlight html %}
<div class="jumbotron">
  <div class="container">
    <ul class="alphabet">
      <li ng-repeat="char in alphabet">
        <span ng-click="filterByAlphabet(char)">{{char}}</span>
      </li>
    </ul>
    <ul class="genres">
      <li ng-repeat="genre in genres">
        <span ng-click="filterByGenre(genre)">{{genre}}</span>
      </li>
    </ul>
  </div>
</div>

<div class="container">
  <div class="panel panel-default">
    <div class="panel-heading">
      {{headingTitle}}
      <div class="pull-right">
        <input class="search" type="text" ng-model="query.name" placeholder="Search...">
      </div>
    </div>
    <div class="panel-body">
      <div class="row show-list">
        <div class="col-xs-4 col-md-3" ng-repeat="show in shows | filter:query | orderBy:'rating':true">
          <a href="/shows/{{show._id}}">
            <img class="img-rounded" ng-src="{{show.poster}}" width="100%"/>
          </a>
          <div class="text-center">
            <a href="/shows/{{show._id}}">{{show.name}}</a>
            <p class="text-muted">Episodes: {{show.episodes.length}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
{% endhighlight %}

If you have used Bootstrap CSS framework before then everything should look 
familiar to you. There are however some AngularJS directives here. The `ng-repeat`
will iterate over an array of items specified in the controller for this page. 

Let's take a look at this code snippet:

{% highlight html %}
<li ng-repeat="char in alphabet">
  <span ng-click="filterByAlphabet(char)">{{char}}</span>
</li>
{% endhighlight %}

It expects an array called `alphabet` defined in the `MainCtrl` controller.
The `char` refers to each individual item in that array, an alphabet letter
in this case. When you click on that letter it will run the `filterByAlphabet`
function specified in the `MainCtrl` controller as well. Here we are passing the
current letter in `filterByAlphabet(char)` otherwise how would it know which letter
to filter by?

The other `ng-repeat` displays a thumbnail and a name of each show:

{% highlight html %}
<div class="col-xs-4 col-md-3" ng-repeat="show in shows | filter:query | orderBy:'rating':true">
  <a href="/shows/{{show._id}}">
    <img class="img-rounded" ng-src="{{show.poster}}" width="100%"/>
  </a>
  <div class="text-center">
    <a href="/shows/{{show._id}}">{{show.name}}</a>
    <p class="text-muted">Episodes: {{show.episodes.length}}</p>
  </div>
</div>
{% endhighlight %}

In AngularJS you can also filter and sort your results. In this code above, thumbnails
are sorted by the rating and filtered by the query you type into the Search box:

{% highlight html %}
<input class="search" type="text" ng-model="query.name" placeholder="Search...">
{% endhighlight %}

The reason it's `query.name` and not just `query` is because we want to filter only
by the TV show name, not by its summary, rating, network, air time, etc.

Next create a new file `main.js` in <span class="fa fa-folder-open"> **public/controllers** directory then add it to `index.html`:

{% highlight html %}
<script src="controllers/main.js"></script>
{% endhighlight %}

{% highlight js %}
angular.module('MyApp')
  .controller('MainCtrl', ['$scope', 'Show', function($scope, Show) {

    $scope.alphabet = ['0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
      'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
      'Y', 'Z'];

    $scope.genres = ['Action', 'Adventure', 'Animation', 'Children', 'Comedy',
      'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Food',
      'Home and Garden', 'Horror', 'Mini-Series', 'Mystery', 'News', 'Reality',
      'Romance', 'Sci-Fi', 'Sport', 'Suspense', 'Talk Show', 'Thriller',
      'Travel'];

    $scope.headingTitle = 'Top 12 Shows';

    $scope.shows = Show.query();

    $scope.filterByGenre = function(genre) {
      $scope.shows = Show.query({ genre: genre });
      $scope.headingTitle = genre;
    };

    $scope.filterByAlphabet = function(char) {
      $scope.shows = Show.query({ alphabet: char });
      $scope.headingTitle = char;
    };
  }]);
{% endhighlight %}

Here are the `alphabet` and `genre` arrays that I just mentioned earlier when describing the `ng-repeat` directive.
The `Show` service is injected automatically by AngularJS. We haven't created it yet, so if you trying
reloading the page you will get this error: **Unknown provider: ShowProvider <- Show**.

Go ahead and create the `show.js` in **public/services** directory and once again
don't forget to add it to `index.html`:

{% highlight html %}
<script src="services/show.js"></script>
{% endhighlight %}

{% highlight js %}
angular.module('MyApp')
  .factory('Show', ['$resource', function($resource) {
    return $resource('/api/shows/:_id');
  }]);
{% endhighlight %}

The simplest service you will ever see thanks to the `angular-resource.js` module
for doing all the heavy lifting for us. The [$resource](https://docs.angularjs.org/api/ngResource/service/$resource)
service is the perfect companion for a RESTful backend. This is all we need to
query *all shows* and an individual *show by id*. Refresh the page and if you
see the **api/shows 404 (Not Found)** error then everything is working as expected for
the time being.
 
![](/images/blog/tvshow-tracker-12.png)

 
Let us switch over back to the Express application to implement database
schemas and API routes.

## Step 4: Database Schemas
