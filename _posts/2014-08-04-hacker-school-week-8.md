---
layout: post
title: "Hacker School: Week 8"
excerpt: A blog post about my NYC Hacker School experience -- Week 8.
image: blog/hacker-school-week-8-cover.jpg
---

It has been a very busy week for me as far as coding goes. I lost track how many
git commits have been pushed to GitHub or how many hours I have slept. For the
past two days in a row I have stayed up until 5 am writing code.

The good news is AngularJS authentication library is nearly complete. From here
on I will mostly be working on writing tests and refactoring code. Client-side
code is just one part of this project. The other part consists of server-side
implementation for various languages and frameworks.

![](/images/blog/hacker-school-week-8-1.png)

Here is a sneak peak of how you would implement **Login with Facebook** using
this AngularJS authentication library (official name TBD):

### Client-Side

{% highlight js %}
// app.js
angular.module('MyApp', ['ngAuth'])
  .config(function($routeProvider, AuthProvider) {
    AuthProvider.setProvider({
      name: 'facebook',
      clientId: '624059410963642'
    });
  });
{% endhighlight %}

{% highlight js %}
// loginCtrl.js
angular.module('MyApp')
  .controller('LoginCtrl', function($scope, Auth) {
    $scope.facebookLogin = function() {
      Auth.authenticate('facebook').then(function() {
        console.log('Authenticated!');
      });
    }
  });
{% endhighlight %}

### Server-Side

{% highlight js %}
app.post('/auth/facebook', function(req, res, next) {
  var url = 'https://graph.facebook.com/oauth/access_token';
  var params = qs.stringify({
    redirect_uri: req.body.redirectUri,
    client_secret: config.facebookSecret,
    client_id: req.body.clientId,
    code: req.body.code
  });

  request.get([url, params].join('?'), function(error, response, data) {
    var accessToken = qs.parse(data).access_token;
    var graphApiUrl = 'https://graph.facebook.com/me';
    var params = {
      access_token: accessToken
    };
    request.get({
      url: graphApiUrl,
      qs: params,
      json: true
    }, function(error, response, profile) {
      User.findOne({ facebook: profile.id }, function(err, existingUser) {
        if (existingUser) {
          var token = createJwtToken(existingUser);
          return res.send(token);
        }
        var user = new User({
          facebook: profile.id,
          firstName: profile.first_name,
          lastName: profile.last_name
        });
        user.save(function(err) {
          if (err) return next(err);
          var token = createJwtToken(user);
          res.send(token);
        });
      });
    });
  });
});
{% endhighlight %}

And that's pretty much it! You may be wondering:

- Why do I have to write so much code on the server?
- Couldn't I just do everything on the client via Facebook SDK library?
- If I have to write so much code on the server wouldn't it be better to
use something like [Passport.js](http://passportjs.org) in the first place
instead of splitting authentication work between client and server?

I have looked at many different solutions ranging from doing authentication
entirely on the server on one extreme and doing authentication entirely on
client-side on another extreme. Neither of these approaches provide the best
user experience in single page applications.

You may have run accross [angular-client-side-auth](http://angular-client-side-auth.herokuapp.com)
that demonstrates AngularJS authentication project with multiple providers. It
looks great at first glance until you click on one of the social sign-in
buttons. Basically, it redirects you to a different page and upon successful
authorization you are redirect back to the application. Any time you navigate
away from a single page application will cause you to lose the internal state,
unless you manually persist the state using cookies or local storage. Alternative
solution is to use popups. That's what client-side Facebook and Google libraries
do anyway.

The problem with that approach is you are now limited to Facebook, Google and
maybe a handful of other providers that have JavaScript libraries that you could
use for sign-in. Another problem is anyone hardly ever uses client-side authentication
on its own. It must communicate with your back-end business logic eventually,
otherwise what would be the point of doing authentication in the first place.
So it seems doing client-side authentication is a lot more work. You are right,
it is a lot more work because there are now all new potential security concerns
that we have to deal with. Even if a user authenticates with Facebook using
[JavaScript SDK](https://developers.facebook.com/docs/javascript) library, how
can you trust that profile information they send you is the correct one? You can't.
You still have to verify it with Facebook by computing the `SHA256` hash of the
*signed_request* string or send a request to Facebook to verify `access_token` and
profile information.

My point is you can't blindly accept the data if you do authentication on the
client. You have no choice but to involve the server and that is why this is
not a stand-alone client-side library. In fact, most of the work is done on the
server. It is especially true for the Twitter authentication that uses **OAuth 1.0**
protocol.

In the near future I will write a more detailed blog about how it works - the
entire flow from start to finish.

Not related to Hacker School, but I am very excited that I get to speak at the
upcoming AngularJS meetup in August. I have spent a condsiderable time refactoring
my [ShowTrackr](https://github.com/sahat/tvshow-tracker) app for the upcoming talk.
New features will include: improved UI, Facebook authentication, Google+ authentication,
Token-based authentication instead of cookies, basic tests with [Karma](karma-runner.github.io)
and Jasmine, animations with [ngAnimate](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)
and much more. I don't have a confirmed date yet, but AngularJS meetups are
usually held somewhere around the middle of the month (April 15, June 17, July 15).

Here is a sneak peak of the new changes to the ShowTrackr. It's a signup form
with live email availability check, password strength indicator and CSS3 goodness.

![](/images/blog/hacker-school-week-8-2.png)