---
layout: post
title: Create a TV Show Tracker using AngularJS, Node.js and MongoDB
excerpt: "This tutorial will show you how to build a REST API with <strong>Express</strong>, authentication and signup process with <strong>Passport</strong>, create and retrieve data from MongoDB using <strong>Mongoose</strong>. The front-end will be built using <strong>AngularJS</strong> and <strong>Bootstrap Sass</strong>. The last step involves using <strong>Gulp.js</strong> to optimize your static assets."
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

{% highlight js linenos=table %}
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

## Step 2: AngularJS Frontend

Download and extract the [Boostrap Sass](http://getbootstrap.com/getting-started/).

![](/images/blog/tvshow-tracker-4.png)

Copy all fonts from *vendor/assets/fonts/bootstrap* to <span class="fa fa-folder-open"></span> **public/fonts** directory and **bootstrap** from *vendor/assets/stylesheets* directory to <span class="fa fa-folder-open"></span> **public/stylesheets** directory.

![](/images/blog/tvshow-tracker-5.png)

Download [this favicon](http://i.imgur.com/A38jRib.png) and place it inside <span class="fa fa-folder-open"></span> **public** directory. You don't really need it but it's a nice touch.

 You will also need to download the following scripts and place them inside <span class="fa fa-folder-open"></span> **public/vendor**:

- [angular.js]()
- [angular-strap.js]()
- [angular-strap.tpl.js]()
- [angular-message.js]()
- [angular-resource.js]()
- [angular-route.js]()
- [angular-cookies.js]()
- [moment.min.js]()

Create `index.html` in **public** directory with the following contents:

{% highlight js linenos=table %}
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


