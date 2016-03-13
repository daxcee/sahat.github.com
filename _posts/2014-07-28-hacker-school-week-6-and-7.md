---
layout: post
category: rc
title: "Hacker School: Week 6 and 7"
excerpt: A blog post about my NYC Hacker School experience -- Week 6 and Week 7.
image: blog/hacker-school-week-6-7-cover.jpg
---
I did not write a blog post last week so I am combining both weeks into a single post.

Most of my time has been put into building the AngularJS authentidcation module.
The hardest challenge with building this project is not knowing what needs to be
done. I have to look at 5 similar modules and libraries (not even for AngularJS or
JavaScript for that matter) that deal with user authentication and somehow
integrate it all together, all while keeping the original goal in mind.
My goal is to make client-side authentication simple by abstracting away all
those details that deal with *OAuth 2.0* and token-based authentication flow.

The biggest challenge for me so far has been *decision-making*, not coding. For
example, when a user clicks on **Sign in with Facebook** should the library
open a new popup, then send an *accessToken* from the popup back to the parent
via [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window.postMessage)
or redirect to Facebook, then return back to the app similar to the server-side
*OAuth 2.0* flow? There is no clear answer on the Internet. Each method has its
pros and cons. Even all the friends that I've asked were split roughly 50/50
on *popup* vs *redirect* approach.

Another big challenge for me is designing the API. There are so many different
ways to configure your module and I have seen just about every approach by
looking at other people's source code. As I build this module I try to imagine
what it's like for someone using it for the very first time. By making sure it
is simple and intuitive every step of the way I have spent many hours re-writing
the same functionality in different ways. And if that's not bad enough, I have
spent the entire *Thursday* just thinking about aforementioned challenges and
practically not writing any code.

I am super excited that [Jesicca McKellar](https://twitter.com/jessicamckellar)
was able to visit Hacker School this summer yet again. We have met at [PyCon 2014](https://us.pycon.org/2014/speaker/profile/64/)
during the book signing but never really had a 1-one-1 chat before. I would
love to pair up with her and discuss API design best practices, the next project
to work on at Hacker School and tips on giving technical talks. I will need the
last bit especially for my upcoming AngularJS talk at Google next month!
