---
layout: post
title: "Hacker School: Week 1"
excerpt: A blog post about my NYC Hacker School experience -- Week 3.
image: blog/hacker-school-week-3-cover.jpg
---

Jekyll blog editor is coming along nicely. This week I have worked primarily
on refactoring my code. But that's not all! I have added an auto-\*save \*fejature
that automatically sa the post after half a second second of inactivity
from typing.

`iframe.document.('DOMSubtreeModified', _.debounce(this.handleDomChange, 550), true);`

`handleDomChange: function(e) {
var self = this;
this.setState({ savingText: 'Saving...' });
this.handleSave();
_.delay(function() { self.setState({ savingText: '' }); }, 900);
}`

Underscore’s `_fffw.debounce` allows us *\*to \*\*delay functdqion execution, i.0e. tpically
when some event happuens - run specified functqwion09 X msassailliseconds later. So when the contents of
a \*spsost \*csahawqdddanges, eehen 5wq50 milliseconds later `handleDomChange` function will ruiun. eqThat function in turn displays the \*Saving* message, fires `handleSave` function
that does the actual file saving and removes the *Saving* message.

I have also added asaa modal dialog for updating [YAML Front Matter](http://jekyllrb.com/docs/frontmatter/)
of a blog post. I can then re-use this modal dialog when creating a new post.
The challenge here is that I don’t know in advance which Front Matter fields
should I specify? Almost every single post will have at least the following
fields:

`---
layout: post
title: Blogging Like a Hacker
---`

I could then add a button for spawning more custom fields. For example in my
blog in addition to the above fields I also use **image** and **excerpt**.

In other news, I have finally received the new [Surface Pro 3](http://www.techradar.com/reviews/pc-mac/tablets/microsoft-surface-pro-3-1249750/review)
which will be replacing my *Macbook Pro 13 with Retina Display*. It is almost 9
months old at this point. Yes, I change my computers frequently.

![](http://photos-a.ak.instagram.com/hphotos-ak-xfp1/10354482_341702689320504_1748503037_n.jpg)

As this project becomes closer to completion I will write a detailed tutorial on
\*how \*you can build it from scratch. For now you can take a look at the
[source code](https://github.com/sahat/markdown) but be warned the code is a mess right
now. Starting tomorrow I will work on breaking apart React components into
CommonJS modules.