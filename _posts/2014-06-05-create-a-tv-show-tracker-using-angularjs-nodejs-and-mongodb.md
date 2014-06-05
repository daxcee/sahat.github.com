---
layout: post
title: Create a TV Show Tracker using AngularJS, Node.js and MongoDB
excerpt: "This tutorial will show you how to build a REST API with <strong>Express</strong>, authentication and signup process with <strong>Passport</strong>, create and retrieve data from MongoDB using <strong>Mongoose</strong>. The front-end will be built using <strong>AngularJS</strong> and <strong>Bootstrap Sass</strong>. The last step involves using <strong>gulp.js</strong> to optimize your static assets."
gradient: 3
image: blog/tvshow-tracker-cover.jpg
---

## TL;DR

![](/images/blog/tvshow-tracker-32.png)

<div style="text-align: center">
<a href="http://polar-fjord-9424.herokuapp.com/" class="btn">Demo</a>
<a href="https://github.com/sahat/tvshow-tracker/" class="btn">Source</a>
</div>

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

There is only one reason we are using [AngularStrap Navbar](http://mgcrea.github.io/angular-strap/#/page-one#navbars) instead of [Bootstrap Navbar](getbootstrap.com/components/#navbar) - the **active** class is applied automatically to `<li>` elements when you change routes. Plus you get many other awesome directives that integrate with AngualrJS such as *Alert*, *Typeahead*, *Tooltip*, *Tab* and many more.

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

Everything in the `style.scss` should be very straightforward if you are not completely new to Bootstrap. 
There are only a few custom classes, everything else simply overrides core Bootstrap classes to make it look prettier.

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
{% raw %}
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
{% endraw %}
{% endhighlight %}

If you have used Bootstrap CSS framework before then everything should look 
familiar to you. There are however some AngularJS directives here. The `ng-repeat`
will iterate over an array of items specified in the controller for this page. 

Let's take a look at this code snippet:

{% highlight html %}
{% raw %}
<li ng-repeat="char in alphabet">
  <span ng-click="filterByAlphabet(char)">{{char}}</span>
</li>
{% endraw %}
{% endhighlight %}

It expects an array called `alphabet` defined in the `MainCtrl` controller.
The `char` refers to each individual item in that array, an alphabet letter
in this case. When you click on that letter it will run the `filterByAlphabet`
function specified in the `MainCtrl` controller as well. Here we are passing the
current letter in `filterByAlphabet(char)` otherwise how would it know which letter
to filter by?

The other `ng-repeat` displays a thumbnail and a name of each show:

{% highlight html %}
{% raw %}
<div class="col-xs-4 col-md-3" ng-repeat="show in shows | filter:query | orderBy:'rating':true">
  <a href="/shows/{{show._id}}">
    <img class="img-rounded" ng-src="{{show.poster}}" width="100%"/>
  </a>
  <div class="text-center">
    <a href="/shows/{{show._id}}">{{show.name}}</a>
    <p class="text-muted">Episodes: {{show.episodes.length}}</p>
  </div>
</div>
{% endraw %}
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

To install [mongoose](mongoosejs.com) and [bcryptjs](https://github.com/dcodeIO/bcrypt.js) run:

{% highlight bash %}
npm install --save mongoose bcryptjs
{% endhighlight %}

Then add these two lines with the rest of module dependencies:

{% highlight js %}
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
{% endhighlight %}

Right below that, add the *Show* mongoose schema:
{% highlight js %}
var showSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  airsDayOfWeek: String,
  airsTime: String,
  firstAired: Date,
  genre: [String],
  network: String,
  overview: String,
  rating: Number,
  ratingCount: Number,
  status: String,
  poster: String,
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }],
  episodes: [{
      season: Number,
      episodeNumber: Number,
      episodeName: String,
      firstAired: Date,
      overview: String
  }]
});
{% endhighlight %}

A schema is just a representation of your data in MongoDB. This is where you
can enforce a certain field to be of particular type. A field can also be required, unique,
contain only certain characters.

All the fields above are almost 1-to-1 match with the data response from the
[TheTVDB.com API](http://thetvdb.com). Two things to note here:
 
1. The default `_id` field has been overwritten with the numerical ID from *The TVDB*. There is no point in having both `_id` and `showId` fields.
2. The `subscribers` field is an array of **User** ObjectIDs. We haven't created the User schema yet, but essentially it's just an array of references to **User** documents.

Next, create the *User* schema:

{% highlight js %}
var userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
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
{% endhighlight %}

Here we are using [pre-save mongoose middleware](http://mongoosejs.com/docs/middleware.html) and comparePassword [instance
method](http://mongoosejs.com/docs/guide.html#methods) for password validation.
This code was taken directly from [passport-local](https://github.com/jaredhanson/passport-local) example.

Now that we have schemas in place, we just have to creat mongoose models
which we will use for querying MongoDB. Where a *schema* is just an abstract representation
of the data, a *model* on the other hand is a concrete object with methods to query, remove, update and save data from/to MongoDB.

{% highlight js %}
var User = mongoose.model('User', userSchema);
var Show = mongoose.model('Show', showSchema);
{% endhighlight %}

And finally in order to connect to the database:

{% highlight js %}
mongoose.connect('localhost');
{% endhighlight %}

Launch `mongod` - MongoDB server, then restart `server.js` to make sure
everything is still working fine.

## Step 5: Express API Routes

We are going to create two routes for now. One is for querying all shows and 
another one for querying a single show by ID.

If we were going to implement all REST routes for `/api/shows` here is a table that outliens a route's responsibility.

| Route          | POST (create)   | GET (read)        | PUT (update)      | DELETE (delete)   |
| -------------- |:---------------:| -----------------:| -----------------:| -----------------:|
| /api/shows     | Add a new show. | Get all shows.    | Update all shows. | Remove all shows. |
| /api/shows/:id | N/A             | Get a show.       | Update a show.    | Delete a show.    |

---

Add these routes after Express middlewares:

{% highlight js %}
app.get('/api/shows', function(req, res, next) {
  var query = Show.find();
  if (req.query.genre) {
    query.where({ genre: req.query.genre });
  } else if (req.query.alphabet) {
    query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
  } else {
    query.limit(12);
  }
  query.exec(function(err, shows) {
    if (err) return next(err);
    res.send(shows);
  });
});
{% endhighlight %}

Initially I had 3 different routes for finding the most popular shows on the home
page, finding by genre and finding by letter. But they were essentially doing
the same thing so I merged them into a single route and used Mongoose query builder
to dynamically construct a database query.

{% highlight js %}
app.get('/api/shows/:id', function(req, res, next) {
  Show.findById(req.params.id, function(err, show) {
    if (err) return next(err);
    res.send(show);
  });
});
{% endhighlight %}

You may have noticed the `next` parameter. If there an error it will be passed
on to the error middleware and handled there as well. How you handle that error
is up to you. A typical approach is to print a stack trace to the console and return
only an error message to the user.

Add this error middleware at the end of your routes. When an error occurs
a stack trace is output in the console and JSON response is returned with
the error message.

{% highlight js %}
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});
{% endhighlight %}

![](/images/blog/tvshow-tracker-13.png)

![](/images/blog/tvshow-tracker-14.png)

If you go to *Add*, *Login* or *Signup* pages right now and hit *Refresh* you will get
a 404 error:

{% highlight js %}
Cannot GET /add
{% endhighlight %}

This is a common problem when you use HTML5 pushState on the client-side. To get
around this problem we have to create a redirect route. Add this route *before*
the error handler:

{% highlight js %}
app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});
{% endhighlight %}

It is very important that you add this route after all your other routes (excluding error handler)
because we are using the `*` wild card that will match any route that you type.

If you try going to `http://localhost:3000/asdf` this last route that we have just added will match it and you will be redirected to `http://localhost:3000/#asdf`.
At that point AngularJS will try to match this URL with your routes defined in `$routeProvider`. Since
we haven't defined a route that matches `/asdf` you will be redirected back to home page:
 
{% highlight js %}
.otherwise({
 redirectTo: '/'
});
{% endhighlight %}

## Step 6: Query and Parse The TVDB API

To add a new TV show to the database we will create a separate route for it.

{% highlight js %}
app.post('/api/shows', function(req, res, next) {
  var apiKey = '9EF1D1E7D28FDA0B';
  var parser = xml2js.Parser({
    explicitArray: false,
    normalizeTags: true
  });
  var seriesName = req.body.showName
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/[^\w-]+/g, '');
  
  async.waterfall([
    function(callback) {
      request.get('http://thetvdb.com/api/GetSeries.php?seriesname=' + seriesName, function(error, response, body) {
        if (error) return next(error);
        parser.parseString(body, function(err, result) {
          var seriesId = result.data.series.seriesid || result.data.series[0].seriesid;
          callback(err, seriesId);
        });
      });
    },
    function(seriesId, callback) {
      request.get('http://thetvdb.com/api/' + apiKey + '/series/' + seriesId + '/all/en.xml', function(error, response, body) {
        if (error) return next(error);
        parser.parseString(body, function(err, result) {
          var series = result.data.series;
          var episodes = result.data.episode;
          var show = new Show({
            _id: series.id,
            name: series.seriesname,
            airsDayOfWeek: series.airs_dayofweek,
            airsTime: series.airs_time,
            firstAired: series.firstaired,
            genre: series.genre.split('|').filter(Boolean),
            network: series.network,
            overview: series.overview,
            rating: series.rating,
            ratingCount: series.ratingcount,
            runtime: series.runtime,
            status: series.status,
            poster: series.poster,
            episodes: []
          });
          _.each(episodes, function(episode) {
            show.episodes.push({
              season: episode.seasonnumber,
              episodeNumber: episode.episodenumber,
              episodeName: episode.episodename,
              firstAired: episode.firstaired,
              overview: episode.overview
            });
          });
          callback(err, show);
        });
      });
    },
    function(show, callback) {
      var url = 'http://thetvdb.com/banners/' + show.poster;
      request({ url: url, encoding: null }, function(error, response, body) {
        show.poster = 'data:' + response.headers['content-type'] + ';base64,' + body.toString('base64');
        callback(error, show);
      });
    }
  ], function(err, show) {
    if (err) return next(err);
    show.save(function(err) {
      if (err) return next(err);
      res.send(200);
    });
  });
});
{% endhighlight %}

You must first [obtain an API key](http://thetvdb.com/?tab=apiregister) from the TVDB.
Or you could use my API key for the purpose of this tutorial. The [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) parser is configured
to normalize all tags to lowercase and disable conversion to arrays when there is only one child element.

The TV show name is *slugified* with underscores instead of dashes because that's what
the TVDB API expects. For example if you pass in **Breaking Bad** it will be converted
to **breaking_bad**.

I am using [async.waterfall](https://github.com/caolan/async#waterfalltasks-callback) to manage multiple asynchronous operations.
Here is how it works:

1. Get the *Show ID* given the *Show Name* and pass it on to the next function.
2. Get the show information using the *Show ID* from previous step and pass the new `show` object on to the next function.
3. Convert the poster image to *Base64*, assign it to `show.poster` and pass the `show` object to the final callback function.
4. Save the `show` object to database.

You may be surprised why are we storing Base64 images in MongoDB? The answer is I don't have
an [Amazon S3](http://aws.amazon.com/s3/) account to store these images. And even if I did,
it is *not for free*, so I wouldn't expect everyone to have an AWS account just to follow this tutorial.
As a side effect, each image is about 30% larger in the Base64 form, but don't worry
it is well within the *500 MB* limit of the [MognoLab free tier](https://mongolab.com/plans/pricing/) database.

![](/images/blog/tvshow-tracker-15.png)

Before moving on, don't forget to install and add these dependencies which are used 
in the route we have just created:

{% highlight bash %}
npm install --save async request xml2js lodash
{% endhighlight %}

{% highlight js %}
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');
var _ = require('lodash');
{% endhighlight %}

## Step 7: Back to AngularJS

Create a new template `add.html` in the <span class="fa fa-folder-open"></span> **views** directory:

{% highlight html %}
<div class="container">
  <div class="panel panel-default">
    <div class="panel-heading">Add TV Show</div>
    <div class="panel-body">
      <form method="post" ng-submit="addShow()" name="addForm" class="form-inline">
        <div class="form-group">
          <input class="form-control" type="text" name="showName" ng-model="showName" placeholder="Enter TV show name" autofocus>
        </div>
        <button class="btn btn-primary" type="submit">Add</button>
      </form>
    </div>
  </div>
</div>
{% endhighlight %}

When you hit the *Add* button, AngularJS will execute the `addShow()` function 
defined in the `AddCtrl` controller because of this line:

{% highlight html %}
<form method="post" ng-submit="addShow()" name="addForm" class="form-inline">
{% endhighlight %}

![](/images/blog/tvshow-tracker-16.png)

We also need to create a controller for this page:

{% highlight html %}
<script src="controllers/add.js"></script>
{% endhighlight %}

{% highlight js %}
angular.module('MyApp')
  .controller('AddCtrl', ['$scope', '$alert', '$http', function($scope, $alert, $http) {
    $scope.addShow = function() {
      $http.post('/api/shows', { showName: $scope.showName })
        .success(function() {
          $scope.showName = '';
          $alert({
            content: 'TV show has been added.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        })
    };
  }]);
{% endhighlight %}

This controller sends a *POST* request to `/api/shows` with the TV show name - the route we have created in the previous step.
If the request has been successfull, the form is cleared and a successful notification is shown.

**Note:** The [$alert](http://mgcrea.github.io/angular-strap/#/alerts) is part of the [AngularStrap](mgcrea.github.io/angular-strap/) library.

![](/images/blog/tvshow-tracker-17.png)

Now, create another template `detail.html`:

{% highlight html %}
{% raw %}
<div class="container">
  <div class="panel panel-default">
    <div class="panel-body">
      <div class="media">
        <div class="pull-left">
          <img class="media-object img-rounded" ng-src="{{show.poster}}">
          <div class="text-center" ng-if="currentUser">
            <div ng-show="!isSubscribed()">
              <button ng-click="subscribe()" class="btn btn-block btn-success">
                <span class="glyphicon glyphicon-plus"></span> Subscribe
              </button>
            </div>
            <div ng-show="isSubscribed()">
              <button ng-click="unsubscribe()" class="btn btn-block btn-danger">
                <span class="glyphicon glyphicon-minus"></span> Unsubscribe
              </button>
            </div>
          </div>
          <div class="text-center" ng-show="!currentUser">
            <a class="btn btn-block btn-primary" href="#/login">Login to Subscribe</a>
          </div>
        </div>
        <div class="media-body">
          <h2 class="media-heading">
            {{show.name}}
            <span class="pull-right text-danger">{{show.rating}}</span>
          </h2>
          <h4 ng-show="show.status === 'Continuing'">
            <span class="glyphicon glyphicon-calendar text-danger"></span>
            {{show.airsDayOfWeek}} <em>{{show.airsTime}}</em> on
            {{show.network}}
          </h4>
          <h4 ng-show="show.status === 'Ended'">
            Status: <span class="text-danger">Ended</span>
          </h4>
          <p>{{show.overview}}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="alert alert-info" ng-show="nextEpisode">
    The next episode starts {{nextEpisode.firstAired | fromNow}}.
  </div>

  <div class="panel panel-default">
    <div class="panel-heading">
      <span class="glyphicon glyphicon-play"></span> Episodes
    </div>
    <div class="panel-body">
      <div class="episode" ng-repeat="episode in show.episodes">
        <h4>{{episode.episodeName}}
        <small>Season {{episode.season}}, Episode {{episode.episodeNumber}}</small>
        </h4>
        <p>
          <span class="glyphicon glyphicon-calendar"></span>
          {{episode.firstAired | date: 'short'}}
        </p>
        <p>{{episode.overview}}</p>
      </div>
    </div>
  </div>
</div>
{% endraw %}
{% endhighlight %}

This template is a little more complicated so let's break it down.

{% highlight html %}
{% raw %}
<div class="text-center" ng-if="currentUser">
  <div ng-show="!isSubscribed()">
    <button ng-click="subscribe()" class="btn btn-block btn-success">
      <span class="glyphicon glyphicon-plus"></span> Subscribe
    </button>
  </div>
  <div ng-show="isSubscribed()">
    <button ng-click="unsubscribe()" class="btn btn-block btn-danger">
      <span class="glyphicon glyphicon-minus"></span> Unsubscribe
    </button>
  </div>
</div>
{% endraw %}
{% endhighlight %}

A *subscribe/unsubscribe* button is shown only if the user is logged in. The
`isSubscribed` function defined in the `DetailCtrl` that we haven't created yet simply
checks if current user ID is in the `subscribers` array of current TV show. It returns either
**true** or **false**. Depending on which value is returned, either green subscribe button
or red unbscribe button is shown.

If the user is not logged in then a different button  is shown:
{% highlight html %}
{% raw %}
<div class="text-center" ng-show="!currentUser">
  <a class="btn btn-block btn-primary" href="#/login">Login to Subscribe</a>
</div>
{% endraw %}
{% endhighlight %}

The main difference between [ng-show](https://docs.angularjs.org/api/ng/directive/ngShow) and [ng-if](https://docs.angularjs.org/api/ng/directive/ngIf)
is that the former simply shows/hides a DOM element and the latter won't even insert a DOM element if the expression is false.
For more detailed comparisson refer to this [StackOverflow post](http://stackoverflow.com/questions/19177732/what-is-the-difference-between-ng-if-and-ng-show-ng-hide). 

In this code block I am using a custom filter `fromNow` that we are about to create shortly.
It uses *moment.js* library to output a friendly date like *in 6 hours* or *in 5 days*.

{% highlight html %}
{% raw %}
<div class="alert alert-info" ng-show="nextEpisode">
  The next episode starts {{nextEpisode.firstAired | fromNow}}.
</div>
{% endraw %}
{% endhighlight %}

Create a new file `fromNow.js` in the <span class="fa fa-folder-open"></span> **public/filters** directory:

{% highlight js %}
angular.module('MyApp').
  filter('fromNow', function() {
    return function(date) {
      return moment(date).fromNow();
    }
});
{% endhighlight %}

And as usual, do not forget to reference it in `index.html`:

{% highlight html %}
<script src="filters/fromNow.js"></script>
{% endhighlight %}

Next, we need to create the `DetailCtrl` controller:

{% highlight html %}
<script src="controllers/detail.js"></script>
{% endhighlight %}

{% highlight js %}
angular.module('MyApp')
  .controller('DetailCtrl', ['$scope', '$rootScope', '$routeParams', 'Show', 'Subscription',
    function($scope, $rootScope, $routeParams, Show, Subscription) {
      Show.get({ _id: $routeParams.id }, function(show) {
        $scope.show = show;

        $scope.isSubscribed = function() {
          return $scope.show.subscribers.indexOf($rootScope.currentUser._id) !== -1;
        };

        $scope.subscribe = function() {
          Subscription.subscribe(show, $rootScope.currentUser).success(function() {
            $scope.show.subscribers.push($rootScope.currentUser._id);
          });
        };

        $scope.unsubscribe = function() {
          Subscription.unsubscribe(show, $rootScope.currentUser).success(function() {
            var index = $scope.show.subscribers.indexOf($rootScope.currentUser._id);
            $scope.show.subscribers.splice(index, 1);
          });
        };

        $scope.nextEpisode = show.episodes.filter(function(episode) {
          return new Date(episode.firstAired) > new Date();
        })[0];
      });
    }]);
{% endhighlight %}

Remember our one-line `Show` service? By default it has the following methods:

{% highlight js %}
{ 'get':    {method:'GET'},
  'save':   {method:'POST'},
  'query':  {method:'GET', isArray:true},
  'remove': {method:'DELETE'},
  'delete': {method:'DELETE'} };
{% endhighlight %}

In other words, we use `Show.get()` to get a single show and `Show.query()` to get an array of shows.

When we get a response back, we add the show to `$scope` in order to make it available to the
`detail.html` template. We also define a few functions to handle subscribe and unsbuscribe actions.

Notice the separation of concerns. We are not handling any HTTP requests inside any of the controllers.
Sure it would be less lines of code to do everything inside a controller but it will quickly
turn into a big pile of mess. AngularJS services, providers, factories are there for this reason.

Here is how subscribe/unsubscribe action works:

1. Current show and current user objects are passed to the `Subscription` service.
2. Subscription service sends a *POST* request to either `/api/subscribe` or `/api/unsubscribe` with just the Show ID and User ID.
3. Server reponds with *200 OK* after updating MongoDB documents.
4. Current user is added or removed from the `subscribers` array of the current TV show to keep things in sync.

The last thing we will do in this step is create the `Subscription` service.

Create a new file `subscription.js` in <span class="fa fa-folder-open"></span> **services** directory:

{% highlight html %}
<script src="services/subscription.js"></script>
{% endhighlight %}

{% highlight js %}
angular.module('MyApp')
  .factory('Subscription', ['$http', function($http) {
    return {
      subscribe: function(show, user) {
        return $http.post('/api/subscribe', { showId: show._id, userId: user._id });
      },
      unsubscribe: function(show, user) {
        return $http.post('/api/unsubscribe', { showId: show._id, userId: user._id });
      }
    };
  }]);
{% endhighlight %}

![](/images/blog/tvshow-tracker-18.png)

We will create Express routes `/api/subscribe` and `/api/unsubscribe` in *Step 10*, after we implement client-side
and server-side authentication.

## Step 8: Client-side Authentication

Create a new template `login.html`:

{% highlight html %}
<div class="container">
  <div class="row">
    <div class="center-form panel">
      <div class="panel-body">
        <h2 class="text-center">Login</h2>

        <form method="post" ng-submit="login()" name="loginForm">

          <div class="form-group">
            <input class="form-control input-lg" type="text" name="email"
                   ng-model="email" placeholder="Email" required autofocus>
          </div>

          <div class="form-group">
            <input class="form-control input-lg" type="password" name="password"
                   ng-model="password" placeholder="Password" required>
          </div>

          <button type="submit" ng-disabled="loginForm.$invalid"
                  class="btn btn-lg btn-block btn-success">Sign In
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
{% endhighlight %}

![](/images/blog/tvshow-tracker-19.png)

Create another template `signup.html`:

{% highlight html %}
<div class="container">
  <br/>

  <div class="row">
    <div class="center-form panel">
      <form method="post" ng-submit="signup()" name="signupForm">
        <div class="panel-body">
          <h2 class="text-center">Sign up</h2>

          <div class="form-group"
               ng-class="{ 'has-success' : signupForm.email.$valid && signupForm.email.$dirty, 'has-error' : signupForm.email.$invalid && signupForm.email.$dirty }">
            <input class="form-control input-lg" type="email" id="email"
                   name="email" ng-model="email" placeholder="Email" required
                   autofocus>

            <div class="help-block text-danger" ng-if="signupForm.email.$dirty"
                 ng-messages="signupForm.email.$error">
              <div ng-message="required">Your email address is required.</div>
              <div ng-message="email">Your email address is invalid.</div>
            </div>
          </div>

          <div class="form-group"
               ng-class="{ 'has-success' : signupForm.password.$valid && signupForm.password.$dirty, 'has-error' : signupForm.password.$invalid && signupForm.password.$dirty }">
            <input class="form-control input-lg" type="password" name="password"
                   ng-model="password" placeholder="Password" required>

            <div class="help-block text-danger"
                 ng-if="signupForm.password.$dirty"
                 ng-messages="signupForm.password.$error">
              <div ng-message="required">Password is required.</div>
            </div>
          </div>

          <div class="form-group"
               ng-class="{ 'has-success' : signupForm.confirmPassword.$valid && signupForm.confirmPassword.$dirty, 'has-error' : signupForm.confirmPassword.$invalid && signupForm.confirmPassword.$dirty }">
            <input class="form-control input-lg" type="password"
                   name="confirmPassword" ng-model="confirmPassword"
                   repeat-password="password" placeholder="Confirm Password"
                   required>

            <div class="help-block text-danger my-special-animation"
                 ng-if="signupForm.confirmPassword.$dirty"
                 ng-messages="signupForm.confirmPassword.$error">
              <div ng-message="required">You must confirm password.</div>
              <div ng-message="repeat">Passwords do not match.</div>
            </div>
          </div>

          <button type="submit" ng-disabled="signupForm.$invalid"
                  class="btn btn-lg btn-block btn-primary">Create Account
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
{% endhighlight %}

This template is a bit trickier than `login.html`. First, I am dynamically assigning `has-success` and `has-error` CSS classes depending on whether the form is valid or not.
These CSS classes are part of the Bootstrap framework. Second, AngularJS is smart enough to use
native HTML attributes such as `type="email"` and `required` for input validation.

The *ngMessages* is a new feature in the *AngularJS 1.3 Beta 8*. Check out
[How to use ngMessages in AngularJS](http://www.yearofmoo.com/2014/05/how-to-use-ngmessages-in-angularjs.html) for an in-depth overview of *ngMessages*.

The only other thing that is worth mentioning is this directive:

{% highlight html %}
repeat-password="password"
{% endhighlight %}

It's a custom directive for checking that *Confirm Password* matches *Password* and vice versa.

Create a new file `repeatPassword.js` in the <span class="fa fa-folder-open"></span> **public/directives** directory. Then add it to `index.html`:

{% highlight html %}
<script src="directives/repeatPassword.js"></script>
{% endhighlight %}

{% highlight js %}
angular.module('MyApp')
  .directive('repeatPassword', function() {
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ctrl) {
        var otherInput = elem.inheritedData("$formController")[attrs.repeatPassword];

        ctrl.$parsers.push(function(value) {
          if (value === otherInput.$viewValue) {
            ctrl.$setValidity('repeat', true);
            return value;
          }
          ctrl.$setValidity('repeat', false);
        });

        otherInput.$parsers.push(function(value) {
          ctrl.$setValidity('repeat', value === ctrl.$viewValue);
          return value;
        });
      }
    };
  });
{% endhighlight %}

![](/images/blog/tvshow-tracker-20.png)

Let's create controllers for `login.html` and `signup.html` templates:

Here is the Signup controller:

{% highlight html %}
<script src="controllers/signup.js"></script>
{% endhighlight %}

{% highlight js %}
angular.module('MyApp')
  .controller('SignupCtrl', ['$scope', 'Auth', function($scope, Auth) {
    $scope.signup = function() {
      Auth.signup({
        email: $scope.email,
        password: $scope.password
      });
    };
  }]);
{% endhighlight %}

And here is the Login controller:

{% highlight html %}
<script src="controllers/login.js"></script>
{% endhighlight %}

{% highlight js %}
angular.module('MyApp')
  .controller('LoginCtrl', ['$scope', 'Auth', function($scope, Auth) {
    $scope.login = function() {
      Auth.login({
        email: $scope.email,
        password: $scope.password
      });
    };
  }]);
{% endhighlight %}

Both Login and Signup controllers use `Auth` service which we are about to create.

Create a new service `auth.js` in the <span class="fa fa-folder-open"></span> **services** directory:

{% highlight html %}
<script src="services/auth.js"></script>
{% endhighlight %}

{% highlight js %}
angular.module('MyApp')
  .factory('Auth', ['$http', '$location', '$rootScope', '$cookieStore', '$alert',
    function($http, $location, $rootScope, $cookieStore, $alert) {
      $rootScope.currentUser = $cookieStore.get('user');
      $cookieStore.remove('user');

      return {
        login: function(user) {
          return $http.post('/api/login', user)
            .success(function(data) {
              $rootScope.currentUser = data;
              $location.path('/');

              $alert({
                title: 'Cheers!',
                content: 'You have successfully logged in.',
                placement: 'top-right',
                type: 'success',
                duration: 3
              });
            })
            .error(function() {
              $alert({
                title: 'Error!',
                content: 'Invalid username or password.',
                placement: 'top-right',
                type: 'danger',
                duration: 3
              });
            });
        },
        signup: function(user) {
          return $http.post('/api/signup', user)
            .success(function() {
              $location.path('/login');

              $alert({
                title: 'Congratulations!',
                content: 'Your account has been created.',
                placement: 'top-right',
                type: 'success',
                duration: 3
              });
            })
            .error(function(response) {
              $alert({
                title: 'Error!',
                content: response.data,
                placement: 'top-right',
                type: 'danger',
                duration: 3
              });
            });
        },
        logout: function() {
          return $http.get('/api/logout').success(function() {
            $rootScope.currentUser = null;
            $cookieStore.remove('user');
            $alert({
              content: 'You have been logged out.',
              placement: 'top-right',
              type: 'info',
              duration: 3
            });
          });
        }
      };
    }]);
{% endhighlight %}

In the next section we will create an Express middleware that creates a *User* cookie on each request.
The `$cookieStore` service grabs that cookie, saves it locally on `$rootScope` and removes the cookie (we don't want to be authenticated forever). 

Unfortunately I haven't found a cleaner and more straightforward authentication implementation in AngularJS yet.
This will do for now. If you know of a better way, let me know.

![](/images/blog/tvshow-tracker-21.png)

Go back to `index.html` and find this line:

{% highlight html %}
<li><a href="javascript:void(0)" ng-click="logout()">Logout</a></li>
{% endhighlight %}

We are using `javascript:void(0)` instead of `#`, that you would typically see used to represent a *dummy* or *null* URLs,
because hashes are used for routes in AngularJS.

Also, we are using the `logout()` function but we haven't created a controller to handle it.
Since Navbar doesn't fall under any particular route in `$routeProvider` we have to assign the
controller inline:

{% highlight html %}
<div ng-controller="NavbarCtrl" class="navbar navbar-default navbar-static-top" role="navigation" bs-navbar>
{% endhighlight %}

![](/images/blog/tvshow-tracker-22.png)

Then create a controller `navbar.js`:

{% highlight html %}
<script src="controllers/navbar.js"></script>
{% endhighlight %}

{% highlight js %}
angular.module('MyApp')
  .controller('NavbarCtrl', ['$scope', 'Auth', function($scope, Auth) {
    $scope.logout = function() {
      Auth.logout();
    };
  }]);
{% endhighlight %}

Of course we cannot login or create a new account because we haven't implemented that yet on the server. Let's do that next!

## Step 9: Server-side Authentication

Install the following dependencies:

{% highlight bash %}
npm install --save express-session passport passport-local
{% endhighlight %}

Then add them to your module dependencies:

{% highlight js %}
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
{% endhighlight %}

In order to setup [Passport.js](http://passportjs.com) we have to configure four things:

1. Passport *serialize* and *deserialize* methods
2. Passport strategy
3. Express session middleware
4. Passport middleware

Serialize and deserialize methods are used to keep you signed-in. More details [here](http://passportjs.org/guide/configure/).

{% highlight js %}
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
{% endhighlight %}

Passport comes with hundreds of different strategies for just about every third-party service out there.
We will not be signing in with Facebook, Google or Twitter. Instead we will use Passport's *LocalStrategy*
to sign in with username and password.

{% highlight js %}
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if (isMatch) return done(null, user);
      return done(null, false);
    });
  });
}));
{% endhighlight %}

**Note:** This code snippet is almost identical to the one found on the
[Passport | Configure](http://passportjs.org/guide/configure/) page. The main difference
here is we override *username* field to be called *email* field.

Add Express Session and Passport middleware right after the `cookieParser()` middleware:

{% highlight js %}
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
{% endhighlight %}

![](/images/blog/tvshow-tracker-23.png)

Also, add this function somewhere in the `server.js` that we will use shortly to protect our routes
from unauthenticated requests.

{% highlight js %}
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) next();
  else res.send(401);
}
{% endhighlight %}

Next, we will create `/login`, `/logout` and `/signup` routes.

When a user tries to sign-in from our AngularJS application, 
a *POST* request is sent with the following data:

{% highlight js %}
{
  email: 'example@email.com',
  password: '1234'
}
{% endhighlight %}

This data is passed to the Passport LocalStrategy. If email is found and password is valid then
a new cookie is created with the user object, additionally the user object is sent back to the client.

{% highlight js %}
app.post('/api/login', passport.authenticate('local'), function(req, res) {
  res.cookie('user', JSON.stringify(req.user));
  res.send(req.user);
});
{% endhighlight %}

Yes, I know it's a bad idea to send user's password over the network or to store it in a cookie, even if password is encryped.
I have looked at so many different tutorials on AngularJS authentication and there is not a single approach that I like. It is either
too complicated, too ugly or both. If I find a better solution I will update this tutorial but for now this will do. 

The signup route should pretty straightforward. In fact I oversimplified it for the purposes of this tutorial. There is no input validation.
If you need input validation then take a look at the [express-validator](https://github.com/ctavan/express-validator). You can see it
being used through the [hackathon-starter](https://github.com/sahat/hackathon-starter) project.

{% highlight js %}
app.post('/api/signup', function(req, res, next) {
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });
  user.save(function(err) {
    if (err) return next(err);
    res.send(200);
  });
});
{% endhighlight %}

Passport exposes a `logout()` function on `req` object that can be called from any route which
terminates a login session. Invoking `logout()` will remove the `req.user` property and clear the login session.

{% highlight js %}
app.get('/api/logout', function(req, res, next) {
  req.logout();
  res.send(200);
});
{% endhighlight %}

Finally, add the following custom middleware after the Express *static* middleware. If user is authenticated, this will
create a new cookie that will be consumed by our AngularJS authentication service to read user information.

{% highlight js %}  
app.use(function(req, res, next) {
  if (req.user) {
    res.cookie('user', JSON.stringify(req.user));
  }
  next();
});
{% endhighlight %}

Go ahead create a new account and try logging in. If you did everything correctly
you should get a *success* notification and you will see your email address in the Navbar.

![](/images/blog/tvshow-tracker-24.png)

## Step 10: Subscription

In this step we will implement two routes for subscribing and unsubscribing to/from a show.

{% highlight js %}
app.post('/api/subscribe', ensureAuthenticated, function(req, res, next) {
  Show.findById(req.body.showId, function(err, show) {
    if (err) return next(err);
    show.subscribers.push(req.body.userId);
    show.save(function(err) {
      if (err) return next(err);
      res.send(200);
    });
  });
});
{% endhighlight %}

{% highlight js %}
app.post('/api/unsubscribe', ensureAuthenticated, function(req, res, next) {
  Show.findById(req.body.showId, function(err, show) {
    if (err) return next(err);
    var index = show.subscribers.indexOf(req.body.userId);
    show.subscribers.splice(index, 1);
    show.save(function(err) {
      if (err) return next(err);
      res.send(200);
    });
  });
});
{% endhighlight %}

We are using `ensureAuthenticated` middleware here to prevent unauthenticated users from accessing
these route handlers.

When users subscribe to a show this is how its MongoDB document may look:

![](/images/blog/tvshow-tracker-25.png)

Again, we are not storing actual users inside `subscribers` array, only *ObjectId* references to those users.
When we need to "expand" those user objects we are going to use [populate](http://mongoosejs.com/docs/populate.html) method provided by Mongoose.

## Step 11: Email Notifications

For sending email notifications we are going to need [agenda](https://github.com/rschmukler/agenda), [sugar.js](sugarjs.com) and [nodemailer](nodemailer.com).

{% highlight bash %}
npm install --save agenda sugar nodemailer
{% endhighlight %}

Then add them to the list of module dependencies:

{% highlight js %}
var agenda = require('agenda')({ db: { address: 'localhost:27017/test' } });
var sugar = require('sugar');
var nodemailer = require('nodemailer');
{% endhighlight %}

Next, we are going to create a new *agenda* task:

{% highlight js %}
agenda.define('send email alert', function(job, done) {
  Show.findOne({ name: job.attrs.data }).populate('subscribers').exec(function(err, show) {
    var emails = show.subscribers.map(function(user) {
      return user.email;
    });

    var upcomingEpisode = show.episodes.filter(function(episode) {
      return new Date(episode.firstAired) > new Date();
    })[0];

    var smtpTransport = nodemailer.createTransport('SMTP', {
      service: 'SendGrid',
      auth: { user: 'hslogin', pass: 'hspassword00' }
    });

    var mailOptions = {
      from: 'Fred Foo ✔ <foo@blurdybloop.com>',
      to: emails.join(','),
      subject: show.name + ' is starting soon!',
      text: show.name + ' starts in less than 2 hours on ' + show.network + '.\n\n' +
        'Episode ' + upcomingEpisode.episodeNumber + ' Overview\n\n' + upcomingEpisode.overview
    };

    smtpTransport.sendMail(mailOptions, function(error, response) {
      console.log('Message sent: ' + response.message);
      smtpTransport.close();
      done();
    });
  });
});

agenda.start();

agenda.on('start', function(job) {
  console.log("Job %s starting", job.attrs.name);
});

agenda.on('complete', function(job) {
  console.log("Job %s finished", job.attrs.name);
});
{% endhighlight %}

It may not be immediately obvious how [Agenda](https://github.com/rschmukler/agenda) works so I will
try to explain it here. Agenda is a job scheduling library for Node.js similar to [node-cron](https://github.com/ncb000gt/node-cron). We define an agenda job called
*send email alert*. Here, we don't concern ourselves with when it runs. We only care what it does, i.e.
what should happen when *send email alert* job is dispatched.

When this job runs, name of the show will be passed in as an *optional* `data` object.

Since we are not storing the entire user document in `subscribers` array (only references), we have to
use Mongoose's [populate](http://mongoosejs.com/docs/populate.html) method. Once the show is found,
we need a list of emails of all subscribers that have to be notified.

We then find the upcoming episode so that we could include a brief summary of the next episode in the email message.

And then it's just your standard Nodemailer boilerplate for sending emails. Here is how an email message
might look like when *send email alert* job runs:

![](/images/blog/tvshow-tracker-33.png)

Go back to the `app.post('/api/shows')` route and add this code inside the `show.save()` callback, so that it can start the agenda task whenever a new show is added to the database:

{% highlight js %}
var alertDate = Date.create('Next ' + show.airsDayOfWeek + ' at ' + show.airsTime).rewind({ hour: 2});
agenda.schedule(alertDate, 'send email alert', show.name).repeatEvery('1 week');
{% endhighlight %}

![](/images/blog/tvshow-tracker-26.png)

Now that we have defined an agenda task, we are going to schedule it as 
soon as a new show is added.

There is a minor problem - how do we know when to schedule it? Do we schedule
**n** jobs for every episode of every shows or would it be better to schedule
a recurring job for each show? I chose the latter approach of using a recurring job per show.

The TVDB API gives us two pieces of information for each show: *air time* and *air day*, e.g. **9:00 PM** and **Tuesday**.
Next challenge - how the heck do we construct a `Date` object from that?!

[Sugar.js](http://sugarjs.com) to the rescue. *Sugar* overrides built-in objects such as Date to provide
us with extra functionality. The code below creates a `Date` object from something like *Next Saturday at 8:00 PM* then *subtract two hours* from that.
 
{% highlight js %}
var alertDate = Date.create('Next ' + show.airsDayOfWeek + ' at ' + show.airsTime).rewind({ hour: 2});
{% endhighlight %}

When a new job is scheduled, Agenda will save that job to MongoDB for guaranteed persistence:

![](/images/blog/tvshow-tracker-34.png)

You can do so much more with Agenda so be sure to check out the [README](https://github.com/rschmukler/agenda) if you are interested in running cron jobs with Node.js.

## Step 12: Optimization

Just because you have a fast internet connection you shouldn't assume that
others do as well. If you want to deliver the best possible user experience
it is important that your application loads fast.

Let's take a look at the *Network* tab in Google Chrome to see how many requests are we making
and how many bytes are transferred when users visit our site.

![](/images/blog/tvshow-tracker-27.png)

Here is what we are going to do in this section:

1. **Concatenate and minify the scripts**
2. **Minify the stylesheet**
3. **Cache AngularJS templates**
4. **Enable gzip compression**
5. **Enable static assets caching**

We will use [gulp.js](http://gulpjs.com) for the first three tasks. Install the following gulp plugins:

{% highlight bash %}
npm install --save-dev gulp-csso gulp-uglify gulp-concat gulp-angular-templatecache
{% endhighlight %}

Then add them at the top with the rest of module dependecies:

{% highlight js %}
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
{% endhighlight %}

To minify CSS simply add `.pipe(csso())` after `.pipe(sass())`.
Here is how your **sass** gulp task should look now:

{% highlight js %}
gulp.task('sass', function() {
  gulp.src('public/stylesheets/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest('public/stylesheets'));
});
{% endhighlight %}

To concatenate and minify JavaScript files add the following task:

{% highlight js %}
gulp.task('compress', function() {
  gulp.src([
    'public/vendor/angular.js',
    'public/vendor/*.js',
    'public/app.js',
    'public/services/*.js',
    'public/controllers/*.js',
    'public/filters/*.js',
    'public/directives/*.js'
  ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public'));
});
{% endhighlight %}

The reason we are passing an array of strings in this particular order is because 
we need to concatenate them in the right order. It doesn't make sense to load `app.js` before
`angular.js` is even loaded. That is why we first load AngularJS, then vendor fiiles, then
main `app.js` file, then everything else. When you run this task a new file
`app.min.js` is created.

Add **compress** task to the **default** task:

{% highlight js %}
gulp.task('default', ['sass', 'compress', 'watch']);
{% endhighlight %}

And finally add a new watcher for the JavaScript files:
gulp.task('watch', function() {
  gulp.watch('public/stylesheets/*.scss', ['sass']);
  gulp.watch(['public/**/*.js', '!public/app.min.js', '!public/vendor'], ['compress']);
});

Gulp will watch for all JavaScript files in the <span class="fa fa-folder-open"></span> **public**
directory except for `app.min.js` or any files in the <span class="fa fa-folder-open"></span> **vendor**
directory.

Next, we are going to add a task for caching AngularJS templates. 

Why do we need to cache AngularJS templates? If you haven't noticed yet, open the *Network*
tab in Google Chrome and navigate between different pages in our ShowTrackr app. You will
notice a separate HTTP request for template files: `add.html`, `login.html`, `signup.html`, etc.
Your goal should always be to *minimize* the number of HTTP requests when building high-performance
applications. This principle is especially true on mobile devices.

Add the following task for caching AngularJS templates:

{% highlight js %}
gulp.task('templates', function() {
  gulp.src('public/views/**/*.html')
    .pipe(templateCache({ root: 'views', module: 'MyApp' }))
    .pipe(gulp.dest('public'));
});
{% endhighlight %}

This task will create a file `templates.js` in the <span class="fa fa-folder-open"></span> **public** directory
that you have to include in the `index.html` in order for AngularJS to detect it. We will do that shortly.

Don't forget to update the **default** task:

{% highlight js %}
gulp.task('default', ['sass', 'compress', 'templates', 'watch']);
{% endhighlight %}

Here is what your `gulpfile.js` should look like at this point:

{% highlight js %}
var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var templateCache = require('gulp-angular-templatecache');

gulp.task('sass', function() {
  gulp.src('public/stylesheets/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('compress', function() {
  gulp.src([
    'public/vendor/angular.js',
    'public/vendor/*.js',
    'public/app.js',
    'public/services/*.js',
    'public/controllers/*.js',
    'public/filters/*.js',
    'public/directives/*.js'
  ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public'));
});

gulp.task('templates', function() {
  gulp.src('public/views/**/*.html')
    .pipe(templateCache({ root: 'views', module: 'MyApp' }))
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function() {
  gulp.watch('public/stylesheets/*.scss', ['sass']);
  gulp.watch(['public/**/*.js', '!public/app.min.js', '!public/vendor'], ['compress']);
});

gulp.task('default', ['sass', 'compress', 'templates', 'watch']);
{% endhighlight %}

3 out of 5 tasks are complete. Let's move on to gzip compression. Install the following Express middleware:

{% highlight bash %}
npm install --save compression
{% endhighlight %}

Add it to the list of module dependencies:

{% highlight js %}
var compress = require('compression')
{% endhighlight %}

And finally add the middleware. This middleware should be placed "high" within the stack to ensure all responses may be compressed.

{% highlight js %}
app.set('port', process.env.PORT || 3000);
app.use(compress())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  if (req.user) {
    res.cookie('user', JSON.stringify(req.user));
  }
  next();
});
{% endhighlight %}

Enable static assets caching is pretty trivial. Update your static middleware with the following,
where `maxAge` is the number in milliseconds:

{% highlight js %}
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 86400000 }));
{% endhighlight %}

**Note:** 86400000 milliseconds is equivalent to 1 day. You may want to create a separate variable
such as `oneDay`, `oneWeek`, `oneMonth` instead of defining milliseconds directly in the middleware.

Run `gulp` in the terminal and you should see two new files in the <span class="fa fa-folder-open"></span> **public** directory:

![](/images/blog/tvshow-tracker-28.png)

**Note:** Our *default* gulp.js task will continue watching for file changes
after all tasks have been executed. If you don't like this behavior feel free
to separate it out into two separate tasks `gulp build` and `gulp watch`.

In `index.html` add these two scripts and comment/remove all other scripts:

{% highlight html %}
<script src="app.min.js"></script>
<script src="templates.js"></script>
{% endhighlight %}

![](/images/blog/tvshow-tracker-29.png)

Now if you check the *Network* tab again you should see much smaller number of requests and a smaller payload size.
In terms of assets optimiation we did an excellent job but the biggest bottleneck in the system 
is on the `GET /api/shows` request.

![](/images/blog/tvshow-tracker-30.png)

There are many other ways to optimize our application. For example it is not necessary for us to retrieve
information about every single episode of every show because we don't see it until we view the detail page of that show.

Also keep in mind we are storing images as *Base64* strings that are are fairly large in size and resolution (680 x 1000),
not cached, not optimized.

You could further improve performance by putting Redis database in front of the MongoDB for caching. Also take a look at the [Couchbase](http://www.couchbase.com/) database
which seems to combine the best of both worlds. Couchbase seems to replace Redis, MongoDB and Riak all togther.

Consider customizing the Bootstrap framework. If you are not using certain components such as *well*
or *button-group*, remove it from `bootstrap.scss`. It is also worth taking a look at [gulp-uncss](https://github.com/ben-eb/gulp-uncss) for removing unused CSS.

## Step 13: Deployment

Create a new file `.gitignore` and add `node_modules` to it, since we don't
want to commit that directory to Git.

{% highlight bash %}
touch .gitignore
 
echo node_modules > .gitignore
{% endhighlight %}

Open `package.json` and update the `start` property to the following:

{% highlight js %}
"scripts": {
  "start": "node server.js"
},
{% endhighlight %}

Go to [mongolab.com](http://mongolab.com) and a create a new account. Then create
a new single-node *Sandbox* database. It's *free*.

![](/images/blog/tvshow-tracker-31.png)

If you don't feel like creating a new account you can use my database that I have
created just for this tutorial:

{% highlight js %}
mongodb://sahat:foobar@ds041178.mongolab.com:41178/showtrackrdemo
{% endhighlight %}

- Username: **sahat**
- Password: **foobar**
- Port: **41178**
- Database: **showtrackrdemo**

Update these two lines of code with the MongoDB URI above:

**Agenda**
{% highlight js %}
var agenda = require('agenda')({ db: { address: 'mongodb://sahat:foobar@ds041178.mongolab.com:41178/showtrackrdemo' } });
{% endhighlight %}

**Mongoose**
{% highlight js %}
mongoose.connect('mongodb://sahat:foobar@ds041178.mongolab.com:41178/showtrackrdemo');
{% endhighlight %}

Turn your project into a Git repository:

{% highlight bash %}
git init
git add .
git commit -m 'Initial commit'
{% endhighlight %}

Create a new Heroku application:

{% highlight bash %}
heroku create
{% endhighlight %}

**Note:** You must have installed the [Heroku Toolbelt](https://toolbelt.heroku.com/)

Deploy!

{% highlight js %}
git push -u heroku master
{% endhighlight %}

## Step 14: Closing Remarks

Congratulations on reaching this far. I hope you enjoyed this tutorial.
Turns out this is also one of the longest blog posts I have ever written.
For some people it would have been enough to just post the source code while others might appreciate
the detailed explanations each step of the way.

There is a lot more that you can do with this project that I haven't done. If you 
are interested in extending this project for fun or profit, consider the following:

- User profile page with a list of subscribed shows
- Dynamically update page `<title>` on each route
- Create a personalized calendar view with subscribed shows
- Create a calendar view that displays every show (time, date, network, episode overview)
- Display a show's episodes in Bootstrap Tabs, grouped by seasons
- Text message notifications
- Customizable alert time (2 hours in advance, 1 day in advance, etc.)
- Add an admin role; only admins can add new TV shows
- Display Twitter feed for each TV show
- Create an AngularJS service for fetching and displaying latest news and gossip about a TV show
- Resize thumbnails via [sharp](https://github.com/lovell/sharp) and optimize via [gulp-imagemin](https://www.npmjs.org/package/gulp-imagemin) then upload to Amazon S3
- Add Redis database as a caching layer
- Explore token-based authentication

If, after reading this tutorial, some concepts are still not clear to you, don't give up, keep pushing yourself, keep learning. I picked up
AngularJS about 2 months ago and I learned JavaScript language through Node.js and Express web framework
less than 2 years ago. I am where I am today only because of the countless number of hours of writing code. There is no magic pill
that will make you a JavaScript expert overnight. So keep on coding, keep on building new things with JavaScript - that really is the best way to learn.

For questions and comments [send me an email](mailto:sahat@me.com). 