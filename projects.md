---
layout: default
title: Projects
permalink: /projects/
excerpt: "A list of projects I have built over the the past few years. Most of my projects come with <strong>demo</strong> and <strong>source code</strong> links."
gradient: 2
image: projects.jpg
---

## Satellizer

Satellizer is a simple to use, end-to-end, token-based authentication module for
AngularJS with built-in support for Google, Facebook, LinkedIn, Twitter,
Foursquare and GitHub authentication providers, as well as Email and Password
sign-in method. You are not limited to the sign-in options above, in fact you
can add any OAuth 1.0 or OAuth 2.0 provider by passing provider-specific
information during the configuration step.

<i class="fa fa-play-circle-o"></i><a href="https://satellizer.herokuapp.com/" class="btn">Demo</a>
<i class="fa fa-github"></i><a href="https://github.com/sahat/satellizer/" class="btn">Source</a>

![](/images/projects/satellizer.png)
<br>
## ShowTrackr

This TV Show Tracker was built for my very first talk at the [Node.js NYC Meetup](http://meetup.com/nodejs/).
This project uses [Express](http://expressjs.com) REST API on the back-end and [Angular.js](http://angularjs.org) on the front-end.
Both user accounts and shows are stored in [MongoDB](http://mongodb.org), while authentication sessions are 
stored in [Redis](http://redislabs.com). The UI is created using [Bootstrap Sass](http://getbootstrap.com/css/#sass). The JavaScript and CSS
concatenation & minification is done via [Gulp](http://gulpjs.com). Authentication is handled
by [Passport.js](http://passportjs.org/). Email notifications are sent out two hours before the show starts via [SendGrid](http://sendgrid.com).

<i class="fa fa-github"></i><a href="https://github.com/sahat/tvshow-tracker/" class="btn">Source</a>

![](/images/projects/showtrackr.png)

<br>
## JS Recipes

JS Recipes is a hand-written collection of **How-To Guides** for back-end and
front-end JavaScript development.
The website is powered by [Angular.js](http://angularjs.org). Every tutorial is 
written in the Markdown format that gets converted to HTML on-the-fly using 
the Showdown plugin. Static site generator like [Jekyll](http://jekyllrb.com) 
I think would be more appropriate for this kind of project, so that is why I will
move it over to Jekyll 2.0 soon, and then hook it up with [InstantClick](http://instantclick.io/)
for ultra-fast responsiveness.

<i class="fa fa-play-circle-o"></i><a href="http://sahatyalkabov.com/jsrecipes/" class="btn">Demo</a>
<i class="fa fa-github"></i><a href="https://github.com/sahat/jsrecipes/" class="btn">Source</a>

![](/images/projects/jsrecipes.png)

<br>
## Angel Beats

Real-time synchronized audio playback across multiple connected web browser clients.
This allows you to boost the sound by playing the song on more than one device simultaneously.
I used [Node.js](http://nodejs.org) and [Socket.IO](http://socket.io/) for the 
back-end and good old [jQuery](jquery.com) for the front-end. It did not win
any awards at the [Cooper Union Hackathon 2014](http://hackcooper.org/), but it was pretty fun
to stream a soundtrack across four laptops during the demo!

<a href="http://angelbeats.herokuapp.com" class="btn">Demo</a>
<a href="https://github.com/sahat/angelbeats" class="btn">Source</a>

![](/images/projects/angelbeats.png)

<br>
## Hackathon Starter

Hackathon Starter is a boilerplate for Node.js web applications.
When I started this project, my primary focus was on <em>simplicity</em> and <em>ease of use</em>.
Anyone who knows a little bit of JavaScript should be able to get started without too much pain.
I tried to make it as <em>generic</em> and <em>reusable</em> as possible to cover most use cases
of hackathon web apps, without being too specific.

*Featured in <a href="http://nodeweekly.com/issues/20">Node Weekly - Issue 20</a>*

*Featured in <a href="http://javascriptweekly.com/issues/166">JavaScript Weekly - Issue 166</a>*

*Front page of Hacker News for more than 24 hours*

*Top post on Reddit for almost 24 hours*

*The most trending repository "this week" (two weeks in a row) on GitHub*

*The most trending repository "this month" on GitHub*

<iframe src="http://ghbtns.com/github-btn.html?wmode=opaque&amp;user=sahat&amp;repo=hackathon-starter&amp;type=watch&amp;count=true&amp;size=large" allowtransparency="true" frameborder="0" scrolling="0" width="170" height="30"></iframe>


### Features

* Local Authentication using Email and Password
* OAuth 1.0a Authentication via Twitter
* OAuth 2.0 Authentication via Facebook, Google or GitHub
* Awesome flash notifications with animations by animate.css
* MVC Project Structure
* Node.js clusters support
* Rails 3.1-style asset pipeline
* LESS stylesheets
* Bootstrap 3 + Flat UI + iOS7 Theme
* Contact Form (powered by Mailgun, Sendgrid or Mandrill)
* Account Management
  * Gravatar
  * Profile Details
  * Change Password
  * Link multiple OAuth strategies to one account
  * Delete Account
  * Forgot Your Password
  * API Examples: Facebook, Foursquare, Venmo, LinkedIn, Tumblr, Twitter, Stripe, and more.

<i class="fa fa-play-circle-o"></i><a href="hackathonstarter.herokuapp.com" class="btn">Demo</a>
<i class="fa fa-github"></i><a href="https://github.com/sahat/hackathon-starter" class="btn">Source</a>

![](/images/projects/hackathon-starter.png)

<br>
## Ember + Sass + Express Starter

This project provides a starting point for your [Ember](http://emberjs.com/) apps with
[Express](http://expressjs.com) web framework serving as a RESTful API back-end.
Directory structure is heavily influenced by ember-tools and Ember App Kit.
In fact it is designed to work with ember-tools for quickly scaffolding models,
views, template, routes and controllers. *I no longer use Ember, so this project is no
longer actively maintained*.

<i class="fa fa-github"></i><a href="https://github.com/sahat/ember-sass-express-starter" class="btn">Source</a>

![](/images/projects/ember-sass-express-starter.png)


## Esoterik Band

The official website of the new music band - Esoterik. Includes the usual tech
stack - Node.js, MongoDB, Express, Jade, Stylus.

<a href="http://www.esoterikmusic.com" class="btn">Demo</a>

![](/images/projects/esoterik.png)

## Coffeed

Coffeed lets you place and manage your orders for food, drinks, or any other predefined items.
Users with admin privileges can add/remove new store items and store locations. Developed for an internal use
at my friend's coffee shop in New York City.</p>

<i class="fa fa-github"></i><a href="https://github.com/sahat/coffeed" class="btn">Source</a>

![](/images/projects/coffeed.png)


## Require.js Library Skeleton

Skeleton project for building modular javascript libraries using RequireJS.
It includes [Bower](http://bower.io/) package manager for front-end libraries, 
[Jasmine](http://jasmine.github.io/) testing framework, [Mocha](http://visionmedia.github.io/mocha/)
test runner, [Chai](http://chaijs.com/) assertion library, 
[Karma](http://karma-runner.github.io/0.12/index.html) test runner,
[Travis CI](https://travis-ci.org/) support and [RequireJS](http://requirejs.org/) itself. This library
skeleton works universally as an inline script tag, AMD module in the browser
or Node.js module.

<iframe src="http://ghbtns.com/github-btn.html?wmode=opaque&amp;user=sahat&amp;repo=requirejs-library&amp;type=watch&amp;count=true&amp;size=large"
        allowtransparency="true" frameborder="0" scrolling="0" width="170" height="30">
</iframe>

*Featured in JavaScript Weekly - Issue 155*

<i class="fa fa-play-circle-o"></i><a href="https://rawgithub.com/sahat/requirejs-library/master/demo/inline.html" class="btn">Demo</a>
<i class="fa fa-github"></i><a href="https://github.com/sahat/requirejs-library" class="btn">Source</a>

<br>
## CloudBucket (CCNY Capstone Project)

CloudBucket is the online cloud storage system with a semantic search capability.
Whenever you upload a file to CloudBucket, it is tagged automatically based on its file contents.
For instance, a music file will receive a covert art, lyrics, artist information, similar artists
and last.fm tags that describe that particular song. You can then, for example, search for a keyword
that is contained in the lyrics of that song and it will return this file in the search results.
Typical search systems return results that match a keyword in the filename only,
not based on its file contents.

It is built using the following technologies: Node.js, Python, MongoDB, AWS S3, Grunt.js,
jQuery, Bower, Google OAuth 2.0, Google Books API, SkyBiometry API, Last.fm API, Musixmatch API
and other libraries.

<i class="fa fa-play-circle-o"></i><a href="http://cloudbucket-sahat.rhcloud.com" class="btn">Demo</a>
<i class="fa fa-github"></i><a href="http://github.com/sahat/cloudbucket" class="btn">Source</a>

<img src="/images/projects/cloudbucket.png" style="width: auto; height: 500px">

<br>
## New Eden Faces

The New Eden Faces lets you vote between two randomly selected [EVE Online](http://eveonline.com) characters of the same gender.
The goal? To see, who are the best looking characters of EVE Online, of course! Other features include
browsing all 7000+ characters using infinite pagination, browse Top 100 sorted by gender, race and bloodline.
This was my first [Backbone.js](http://backbonejs.org) project. Real-time **online users counter** was
added later using [Socket.IO](http://socket.io). All that client-side code in a single
**app.js** with over 1200 lines of code was later refactored to use [RequireJS](http://requirejs.org/) 
module loader.

<a href="http://www.newedenfaces.com" class="btn">Demo</a>
<a href="https://github.com/sahat/newedenfaces" class="btn">Source</a>

![](/images/projects/new-eden-faces.png)

<br>
## Allison Eckfeldt's Website

Allison Eckfeldt's personal website.
Content aggregation is done using YouTube, Instagram and Tumblr APIs completely 
on client-side via JSONP. I used [jQuery](http://jquery.com) for JSONP requests and [Underscore.js](http://underscorejs.org/#template)
for templating support.

<a href="http://kazlovesbats.com" class="btn">Demo</a>

![](/images/projects/kazlovesbats.png)

## Apparelist

Hearst Fashion Hackathon 2013 project. Browse and compare items from multiple
clothing stores, e.g. Macys, Express, H&M, UNIQLO.

<a href="https://github.com/sahat/apparelist" class="btn">Source</a>

![](/images/projects/apparelist.png)


## Opheliac HTML5 Lyrics

Audio-text visualization. YouTube has plenty of "lyrics music videos". I thought it would be interesting to create something
similar using CSS and JavaScript. This is a song <em>Opheliac</em> by <em>Emilie Autumn</em>,
where lyrics are perfectly synchronized with the music. Lyrics start after 57 seconds.
Manually synchronizing lyrics with the song was long and tortorous process; 
I wouldn't do it again.

<a href="http://sahat.github.io/opheliac" class="btn">Demo</a>
<a href="https://github.com/sahat/sahat.github.com/tree/master/opheliac" class="btn">Source </a>

![](/images/projects/opheliac.png)


## CL4P-TP Game Recommendation Engine

The final project for Software Engineering course at the <em>City College of New York</em>.
Some features include: personalized game recommendations based on the rating / purchase
patterns of similar users, profile with XBOX 360 achievements, rating system,
custom signup and login components, custom comments system, store purchases,
YouTube trailer previews, and more! This was my very first project built with [Node.js](http://nodejs.org),
or any JavaScript project for that matter.

<a href="http://csc322.herokuapp.com" class="btn">Demo</a>
<a href="https://github.com/sahat/csc322" class="btn">Source</a>

![](/images/projects/csc322.png)
