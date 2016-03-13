---
layout: post
category: rc
title: "Hacker School: Week 2"
excerpt: "A blog post about my NYC Hacker School experience -- Week 2."
image: blog/hacker-school-week-2-cover.jpg
---

This week (June 16 - June 22) I continued working on the Jekyll Blog Editor. As I transitioned from
jQuery DOM manipulations to [React](http://facebook.github.io/react/), all
EventEmitter events have disappeared as
they were no longer needed. Let me back up one step. Previously, I was manually
hiding and display DOM elements based on the current state of the app. When user
first starts the app — that’s one state, when blog is loaded — that’s another
state, when a particular post is loaded — that's the *editing mode* state, and so
on. My codebase was a giant mess of event emitters and event listeners.

With React I no longer need to use the [EvenEmitter](http://nodejs.org/api/events.html)
class. I simply maintain the state in the *App* component and React automatically
re-renders the UI based on the current state.

Out of all the libraries and frameworks why did I choose React? I originally
wanted to use AngularJS as I would be more productive with it. React just did
not make sense to me. That’s precisely the reason why I chose React — because
I would like to learn something new this summer at Hacker School. I could have
taken an even easier route by going with jQuery, but my goal at Hacker School
is not to build something really quick; it is to learn something new and build
a somewhat useful product as a consequence of that learning.

Here is a sneak peak at the app I am working on:

![](/images/blog/hacker-school-week-2.png)

You can edit the contents of your blog as it would appear in a browser. You no
longer have to switch between a Markdown text editor and a browser to see how
your post looks. I have implemented the *auto-save* feature so far but being
able to publish directly to [GitHub Pages](https://pages.github.com/) is high
on my priority list.

Earlier this week I have also decided to revisit Algorithms
and Data Structures. Here is the *Linked List* implementation
in JavaScript:

{% highlight js %}
function Node(data) {
  this.data = data;
  this.next = null;
}

function LinkedList() {
  this.head = null;
  this.count = 0;
}

LinkedList.prototype.get = function(index) {
  if (index >= 0 && index < this.count) {
    var current = this.head;
    var i = 0;

    while (i < index) {
      current = current.next;
      i++;
    }

    return current.data;
  } else {
    return null;
  }
};

LinkedList.prototype.add = function(data) {
  var node = new Node(data);
  var current;

  if (this.head === null) {
    this.head = node;
  } else {
    current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = node;
  }
  this.count++;
};
{% endhighlight %}

And here is the usage example:

{% highlight js %}
var linkedList = new LinkedList();

linkedList.add('first');
linkedList.add('second');
linkedList.add('third');

console.log(linkedList.get(0));
// 'first'
{% endhighlight %}

Next week, that means starting tomorrow, I would like to implement a
[Merge sort](http://en.wikipedia.org/wiki/Merge_sort) in JavaScript. I have
an interview with *Yahoo* on June 27th so this would be a great practice for me!

In other news, not related to programming, I had such a blast this Thursday after
ten of us went out for a pizza at the end of the day. It's social events like these
that make Hacker School such an amazing experience for me.

Lastly, I just want to mention something about the blog editor I am working on
right now. I am not building it just to learn how to use React or how to
build desktop applications with Node.js. I am doing it to prove a point that
*attention to detail* trumps everything. When building any type of applications,
it's small things that usually end up making a big difference. And of course as
with anything else that I've built so far it will be open-sourced under the MIT
license.

---

It is really to believe how fast time goes by. I remember 285 days ago like it
was yesterday. That's when I just finished my internship with [Continuum Analytics](http://continuum.io/) in
Austin, TX and moved back to New York in time for the Fall semester
at the [CCNY](http://www.ccny.cuny.edu/). Actually that's not entirely true,
I missed the first week of classes. Anyway, I have made a decision then to code
every single day, no exceptions - including the days when I had multiple
final exams at school, in order to become a better programmer.

<i class="fa fa-github"></i>
[@sahat](https://github.com/sahat)

![](/images/blog/hacker-school-week-2-1.png)
