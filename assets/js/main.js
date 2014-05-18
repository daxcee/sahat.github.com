$(document).ready(function() {

  // Menu Toggle
  var navigation = $('nav');
  var navigationToggle = $('.toggle');

  navigation.hide();

  navigationToggle.on('click', function() {
    $(this).toggleClass('open');
    navigation.fadeToggle('fast');
  });

});