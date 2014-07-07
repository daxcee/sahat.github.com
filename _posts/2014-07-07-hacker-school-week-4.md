---
layout: post
title: "Hacker School: Week 4"
excerpt: A blog post about my NYC Hacker School experience -- Week 4.
image: blog/hacker-school-week-4-cover.jpg
---

Last week feels like forever ago. I had so many things on my mind lately that
I no longer remember what I did last Monday or Tuesday.

---

This July 4th weekend has been a blast: fireworks, swimming pool and sunbathing
on the beach in the Ocean City, MD. It was a much needed break from the
crazy New York City life.

![](/images/blog/hacker-school-week-4-1.jpg)

Last week, I looked into the [Polymer Project](polymer-project.org) by Google so
I could compare it with existing libraries and frameworks that essentially try
to do the same thing - building web user interfaces. My initial impressions
were very good but as I started using it my excitement slowly started to fade
away. It has quite a learning curve, but for what? What exactly can *Polymer* do for me
that I already cannot do with other libraries? And even if I spend a few weeks
learning Polymer, that knowledge would only be useful for building my side-projects.
Polymer and [Web Components](http://webcomponents.org/) are simply not ready for the
world yet. Perhaps in two years we could take another look at it. Right now, as a
front-end web developer you would be better off investing your time into learning
[Angular](http://angularjs.org), [React](http://reactjs.com), [Ember](http://emberjs.com)
or [Backbone](http://backbonejs.org) instead.

Last Thursday I have started working on building a token-based authentication
module for AngularJS and that's what I will be working on this week. There are
three main reasons for building it:

1. To learn more about token-based authentication approach.
2. Simplify AngularJS authentication implementation.
3. Provide back-end examples for various languages.

I would like to learn more about how token-based authentication works. I am only
familiar with a traditional cookie-based sessions authentication approach because
that's all I ever used with [Flask](http://flask.pocoo.org), [Django](https://www.djangoproject.com)
and [Express](expressjs.com) web frameworks. One advantage of using token-based
authentication is that you can use the same back-end for your mobile, web and desktop
clients without fiddling with sessions and cookies.

In my [TV Show Tracker](http://sahatyalkabov.com/create-a-tv-show-tracker-using-angularjs-nodejs-and-mongodb/)
blog post I have expressed my disappointment in the current approach to the AngularJS
authentication - it is not straightforward enough in my opinion. Every solution
seems too complicated, not explained well enough or simply does not look as *clean*
as it could have been. Every developer can write code but not everyone can do it
in a simple, straightforward and elegant way because it is rarely that easy.

If you search for *AngularJS token-based authentication* you will most likely find
code examples that use Node.js on the back-end. For me that's fine but other
people that work with a different back-end stack might find integration task to
be more challenging, especially if they are not familiar with Node.js. My
goal is to provide fully-working code examples using the most popular web frameworks
and libraries for C#, Ruby, Python, Java, Scala, Rust and Go. The idea here is to
write multiple back-ends with the same API routes, so that an AngularJS app
couldn't care less what language or what database you are using as long as they
have the same API.

In unrelated news to Hacker School, I am quite happy with my [Surface Pro 3](http://www.microsoft.com/surface/en-us/products/surface-pro-3).
At first, it was *very* difficult to go back to Windows after being spoiled by Mac OS X,
[Brew](http://brew.sh) package manager, [Fish](https://github.com/bpinto/oh-my-fish)
terminal shell and gorgeous antialiased fonts of the Macbook Pro with Retina Display.
Even with the high-density display panels Windows fonts just don't look as good.
That was last week; I am no longer struggling nearly as much with the *Surface
Pro 3* and I have even grown to like the touch screen display. On a few ocassions
when using Macbook Pro I tried to swipe the screen, only to realize that it is
not touch sensitive.