$(document).ready(function() {

  // Menu Toggle
  var navigation = $('nav');
  var navigationToggle = $('.toggle');

  navigation.hide();

  navigationToggle.on('click', function() {
    $(this).toggleClass('open');
    navigation.fadeToggle('fast');
  });

  // Parallax Ccrolling
  var parallaxElements = $('[data-parallax]');
  var browserWindow = $(window);

  $.each(parallaxElements, function(index, value) {
    var $this = $(value);
    var speed = $this.data('parallax');

    browserWindow.scroll(function() {
      var offset = -(browserWindow.scrollTop() / speed);
      $this.css({ backgroundPosition: '50% ' + offset + 'px' });
    });
  });

  // Reveal Animation
  var animatedElements = $('[data-animation]');
  $.each(animatedElements, function(index, value) {
    var animation = $(this).data('animation');

    $(this).addClass('hidden').viewportChecker({
      classToAdd: 'visible animated ' + animation,
      offset: 100
    });

  });

  // Reading Time
  $('article').readingTime({
    readingTimeTarget: '.title'
  });

});