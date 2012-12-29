$(document).ready(function() {
  $('html').bind("touchmove", {}, function(event){
    event.preventDefault();
  });

  currentTrigger = 0;
  noauto = true;
  nolyrics = false;

  if (location.hash == '#nolyrics') {
    nolyrics = true;
  }

  if (location.hash == '#noauto' || noauto == true) {

    $("#jpId").jPlayer( {
      ready: function () {
        $(this).jPlayer("setMedia", {
          mp3: "opheliac.mp3" //HTML5 audio for streaming only! Buy the music folks! The National - Exile Vilify
        });
      },
      volume: 0.9,
      supplied: "mp3, oga",
      swfPath: "./res/"
    });

    noauto = true;

  }
  else {
    $("#jpId").jPlayer( {
      ready: function () {
        $(this).jPlayer("setMedia", {
          mp3: "opheliac.mp3" //HTML5 audio for streaming only! Buy the music folks! The National - Exile Vilify
        }).jPlayer("play");
      },
      volume: 0.9,
      supplied: "mp3, oga",
      swfPath: "./res/"
    });
  }

  $('#stop').click(function() {
    //$("#jpId").jPlayer("playHead", 75); // Move play-head to start.

    $('#jpId').jPlayer('stop');
    $('#play').html('<a href="#">play</a>');
  });

  $('#pause').click(function() {
    $('#jpId').jPlayer('pause');
    $('#play').html('<a href="#">play</a>');
  });


  $('#mute').click(function() {
    $('#jpId').jPlayer('mute');
    $('#mute').text('unmute');
    var audioElm = document.getElementById('ambiance'); audioElm.muted = !audioElm.muted;

  })

  $('#play').click(function() {
    $('#jpId').jPlayer('play');
  });

  $('#jpId').bind($.jPlayer.event.playing, function(event) {
    $('#play').html('<a href="#">playing ♫</a>');
    startLyrics();
  });
  $('#jpId').bind($.jPlayer.event.loadstart, function(event) {
    $('#play').html('<a href="#">play</a>');
  });
  $('#jpId').bind($.jPlayer.event.suspend, function(event) {
    $('#play').html('<a href="#">play</a>');
  });


  $('#jpId').bind($.jPlayer.event.ended, function(event) {
    $('#jpId').jPlayer('play');
    $('#play').text('play');
  });

  $('#jpId').bind($.jPlayer.event.timeupdate, function(event) {
    $('#time').html($.jPlayer.convertTime(event.jPlayer.status.currentTime));

    if (event.jPlayer.status.currentTime >= timings[currentTrigger] && nolyrics != true) {
      fireTrigger(currentTrigger);
      currentTrigger++;
    }


  });


  function startLyrics () {
    $('#lyrics1 h1').hide();
    $('#lyrics2 h1').hide();
    $('#lyrics3 h1').hide();
    $('#lyrics4 h1').hide();
    $('#lyrics5 h1').hide();
    $('#lyrics6 h1').hide();
    $('#lyrics7 h1').hide();
    $('#lyrics8 h1').hide();
    $('#lyrics9 h1').hide();
    $('#lyrics10 h1').hide();

    currentTrigger = 0;


  }

  function fireTrigger(trigger) {
    switch (trigger) {
      case 0:
        $('#lyrics1 h1').html("I'm your Opheliac").fadeIn('slow');
        break;
      case 1:
        $('#lyrics2 h1').html("I've been so disillusioned").fadeIn('slow');
        break;
      case 2:
        $('#lyrics3 h1').html("I know you'd take me back").fadeIn('slow');
        break;
      case 3:
        $('#lyrics4 h1').html("But still I feign confusion").fadeIn('slow');
        break;
      case 4:
        $('#lyrics5 h1').html("I couldn't be your friend").fadeIn('slow');
        break;
      case 5:
        $('#lyrics6 h1').html("My world was too unstable").fadeIn('slow');
        break;
      case 6:
        $('#lyrics7 h1').html("You might have seen the end").fadeIn('slow');
        break;
      case 7:
        $('#lyrics1 h1').hide();
        $('#lyrics2 h1').hide();
        $('#lyrics3 h1').hide();
        $('#lyrics4 h1').hide();
        $('#lyrics5 h1').hide();
        $('#lyrics6 h1').hide();
        $('#lyrics7 h1').hide();
        break;
      case 8:
        $('#lyrics1 h1').html("But you were never able").fadeIn('slow');
        break;
      case 9:
        $('#lyrics2 h1').html("To keep me breathing").fadeIn('slow');
        break;
      case 10:
        $('#lyrics3 h1').html("As the water rises up again").fadeIn('slow');
        break;
      case 11:
        $('#lyrics4 h1').html("Before I slip away").fadeIn('slow');
        break;
      case 12:
        break;
      case 13:
        $('#lyrics1 h1').hide();
        $('#lyrics2 h1').hide();
        $('#lyrics3 h1').hide();
        $('#lyrics4 h1').hide();
        $('#lyrics1 h1').html("You know the games I play").show('slow');
        break;
      case 14:
        $('#lyrics2 h1').html("And the words I say").show('slow');
        break;
      case 15:
        $('#lyrics3 h1').html("When I want my own way").show('slow');
        break;
      case 16:
        $('#lyrics4 h1').html("You know the lies I tell").show('slow');
        break;
      case 17:
        $('#lyrics5 h1').html("When you've gone through hell").fadeIn('slow');
        break;
      case 18:
        $('#lyrics6 h1').html("And I say I can't stay").fadeIn('slow');
        break;
      case 19:
        $('#lyrics1 h1').hide();
        $('#lyrics2 h1').hide();
        $('#lyrics3 h1').hide();
        $('#lyrics4 h1').hide();
        $('#lyrics5 h1').hide();
        $('#lyrics6 h1').hide();

        $('#lyrics1 h1').html("You know how hard it can be").slideDown(600);
        break;
      case 20:
        $('#lyrics2 h1').html("To keep believing in me").slideDown(600);
        break;
      case 21:
        $('#lyrics3 h1').html("When everything and everyone").slideDown(600);
        break;
      case 22:
        $('#lyrics4 h1').html("Becomes my enemy and when").slideDown(600);
        break;
      case 23:
        $('#lyrics5 h1').html("There's nothing more you can do").slideDown(600);
        break;
      case 24:
        $('#lyrics6 h1').html("I'm gonna blame it on you").slideDown(600);
        break;
      case 25:
        $('#lyrics7 h1').html("It's not the way I want to be").slideDown(600);
        break;
      case 26:
        $('#lyrics8 h1').html("I only hope that in the end you will see").slideDown(600);
        break;
      case 27:
        $('#lyrics9 h1').html("It's the Opheliac in me").fadeIn(1000);
        break;
      case 28:
        $('#lyrics9 h1').html("It's the Opheliac in me").fadeOut(1000);
        $('#lyrics9 h1').html("It's the Opheliac in me").fadeIn(1000);
        break;
      case 29:
        $('#lyrics9 h1').slideUp(1000);
        $('#lyrics8 h1').slideUp(1100);
        $('#lyrics7 h1').slideUp(1200);
        $('#lyrics6 h1').slideUp(1300);
        $('#lyrics5 h1').slideUp(1400);
        $('#lyrics4 h1').slideUp(1500);
        $('#lyrics3 h1').slideUp(1600);
        $('#lyrics2 h1').slideUp(1700);
        $('#lyrics1 h1').slideUp(1800);
        break;
      case 30:
        $('#lyrics1 h1').html("I'm your Opheliac").fadeIn('slow')
        break;
      case 31:
        $('#lyrics2 h1').html("My stockings prove my virtues").fadeIn('slow')
        break;
      case 32:
        $('#lyrics3 h1').html("I'm open to attack").fadeIn('slow');
        break;
      case 33:
        $('#lyrics4 h1').html("But I don't want to hurt you").fadeIn('slow');
        break;
      case 34:
        $('#lyrics5 h1').html("Whether I swim or sink").fadeIn('slow');
        break;
      case 35:
        $('#lyrics6 h1').html("That's no concern of yours now").fadeIn('slow');
        break;
      case 36:
        $('#lyrics7 h1').html("How could you possibly think").fadeIn('slow');
        break;
      case 37:
        $('#lyrics1 h1').hide();
        $('#lyrics2 h1').hide();
        $('#lyrics3 h1').hide();
        $('#lyrics4 h1').hide();
        $('#lyrics5 h1').hide();
        $('#lyrics6 h1').hide();
        $('#lyrics7 h1').hide();

        $('#lyrics1 h1').html("You had the power to know how").slideDown('slow');
        break;
      case 38:
        $('#lyrics2 h1').html("To keep me breathing").slideDown('slow');
        break;
      case 39:
        $('#lyrics3 h1').html("As the water rises up again").slideDown('slow');
        break;
      case 40:
        $('#lyrics4 h1').html("Before I slip away").slideDown('slow');
        break;
      case 41:
        $('#lyrics1 h1').hide();
        $('#lyrics2 h1').hide();
        $('#lyrics3 h1').hide();
        $('#lyrics4 h1').hide();
        $('#lyrics1 h1').html("You know the games I play").show('slow');
        break;
      case 42:
        $('#lyrics2 h1').html("And the words I say").show('slow');
        break;
      case 43:
        $('#lyrics3 h1').html("When I want my own way").show('slow');
        break;
      case 44:
        $('#lyrics4 h1').html("You know the lies I tell").show('slow');
        break;
      case 45:
        $('#lyrics5 h1').html("When you've gone through hell").fadeIn('slow');
        break;
      case 46:
        $('#lyrics6 h1').html("And I say I can't stay").fadeIn('slow');
        break;
      case 47:
        $('#lyrics1 h1').hide();
        $('#lyrics2 h1').hide();
        $('#lyrics3 h1').hide();
        $('#lyrics4 h1').hide();
        $('#lyrics5 h1').hide();
        $('#lyrics6 h1').hide();
        $('#lyrics7 h1').hide();
        $('#lyrics8 h1').hide();
        $('#lyrics9 h1').hide();
        $('#lyrics1 h1').html("You know how hard it can be").slideDown(600);
        break;
      case 48:
        $('#lyrics2 h1').html("To keep believing in me").slideDown(600);
        break;
      case 49:
        $('#lyrics3 h1').html("When everything and everyone").slideDown(600);
        break;
      case 50:
        $('#lyrics4 h1').html("Becomes my enemy and when").slideDown(600);
        break;
      case 51:
        $('#lyrics5 h1').html("There's nothing more you can do").slideDown(600);
        break;
      case 52:
        $('#lyrics6 h1').html("I'm gonna blame it on you").slideDown(600);
        break;
      case 53:
        $('#lyrics7 h1').html("It's not the way I want to be").slideDown(600);
        break;
      case 54:
        $('#lyrics8 h1').html("I only hope that in the end you will see").slideDown(600);
        break;
      case 55:
        $('#lyrics9 h1').html("It's the Opheliac in me").fadeIn(1000);
        break;
      case 56:
        $('#lyrics9 h1').html("It's the Opheliac in me").fadeOut(1000);
        $('#lyrics9 h1').html("It's the Opheliac in me").fadeIn(1000);
        break;

      case 57:
        $('#lyrics1 h1').hide();
        $('#lyrics2 h1').hide();
        $('#lyrics3 h1').hide();
        $('#lyrics4 h1').hide();
        $('#lyrics5 h1').hide();
        $('#lyrics6 h1').hide();
        $('#lyrics7 h1').hide();
        $('#lyrics8 h1').hide();
        $('#lyrics9 h1').hide();

        $('#lyrics1 h1').html("Studies show:").show(1000)
        break;
      case 58:
        $('#lyrics1 h1').html("Intelligent girls are more depressed").fadeIn(1000);
        break;
      case 59:
        $('#lyrics2 h1').html("Because they know").fadeIn(1000);
        break;
      case 60:
        $('#lyrics3 h1').html("What the world is really like").fadeIn(1000);
      case 61:
        break;
        $('#lyrics4 h1').html("Don't think for a beat it makes it better").fadeIn(1000);
        break;
      case 62:
        $('#lyrics5 h1').html("When you sit her down and tell her").fadeIn(1000);
        break;
      case 63:
        $('#lyrics6 h1').html("Everything gonna be all right").fadeIn(1000);
        break;
      case 64:
        $('#lyrics7 h1').html("She knows in society she either is").fadeIn(1000);
        break;
      case 65:
        $('#lyrics8 h1').html("A devil or an angel with no in between").fadeIn(1000);
        break;
      case 66:
        $('#lyrics9 h1').html("She speaks in the third person").fadeIn(1000);
        break;
      case 67:
        $('#lyrics10 h1').html("So she can forget that she's me").fadeIn(1000);
        break;
      case 68:
        $('#lyrics1 h1').hide();
        $('#lyrics2 h1').hide();
        $('#lyrics3 h1').hide();
        $('#lyrics4 h1').hide();
        $('#lyrics5 h1').hide();
        $('#lyrics6 h1').hide();
        $('#lyrics7 h1').hide();
        $('#lyrics8 h1').hide();
        $('#lyrics9 h1').hide();
        $('#lyrics10 h1').hide();

        $('#lyrics1 h1').html("♫").fadeIn(1);
        break;
      case 69:
        $('#lyrics1 h1').fadeOut(1000);
        $('#lyrics1 h1').html("Doubt thou the stars are fire").fadeIn(1000);
        break;
      case 70:
        $('#lyrics2 h1').html("Doubt thou the sun doth move").fadeIn(1000);
        break;
      case 71:
        $('#lyrics3 h1').html("Doubt truth to be a liar").fadeIn(1000);
        break;
      case 72:
        $('#lyrics4 h1').html("But never doubt").fadeIn(1000);
        break;

      case 73:
        $('#lyrics5 h1').html("I love").show(1500);
        break;

      case 74:
        $('#lyrics9 h1').fadeOut(200);
        $('#lyrics8 h1').fadeOut(200);
        $('#lyrics7 h1').fadeOut(200);
        $('#lyrics6 h1').fadeOut(200);
        $('#lyrics5 h1').fadeOut(200);
        $('#lyrics4 h1').fadeOut(200);
        $('#lyrics3 h1').fadeOut(200);
        $('#lyrics2 h1').fadeOut(200);
        $('#lyrics1 h1').fadeOut(200);
        $('#lyrics1 h1').html("You know the games I play").show('slow');
        break;
      case 75:
        $('#lyrics2 h1').html("And the words I say").show('slow');
        break;
      case 76:
        $('#lyrics3 h1').html("When I want my own way").show('slow');
        break;
      case 77:
        $('#lyrics4 h1').html("You know the lies I tell").show('slow');
        break;
      case 78:
        $('#lyrics5 h1').html("When you've gone through hell").fadeIn('slow');
        break;
      case 79:
        $('#lyrics6 h1').html("And I say I can't stay").fadeIn('slow');
        break;
      case 80:
        $('#lyrics1 h1').hide();
        $('#lyrics2 h1').hide();
        $('#lyrics3 h1').hide();
        $('#lyrics4 h1').hide();
        $('#lyrics5 h1').hide();
        $('#lyrics6 h1').hide();
        $('#lyrics7 h1').hide();
        $('#lyrics8 h1').hide();
        $('#lyrics9 h1').hide();
        $('#lyrics1 h1').html("You know how hard it can be").slideDown(600);
        break;
      case 81:
        $('#lyrics2 h1').html("To keep believing in me").slideDown(600);
        break;
      case 82:
        $('#lyrics3 h1').html("When everything and everyone").slideDown(600);
        break;
      case 83:
        $('#lyrics4 h1').html("Becomes my enemy and when").slideDown(600);
        break;
      case 84:
        $('#lyrics5 h1').html("There's nothing more you can do").slideDown(600);
        break;
      case 85:
        $('#lyrics6 h1').html("I'm gonna blame it on you").slideDown(600);
        break;
      case 86:
        $('#lyrics7 h1').html("It's not the way I want to be").slideDown(600);
        break;
      case 87:
        $('#lyrics8 h1').html("I only hope that in the end you will see").slideDown(600);
        break;
      case 88:
        $('#lyrics1 h1').delay(1900).fadeOut(1000);
        $('#lyrics2 h1').delay(1800).fadeOut(1000);
        $('#lyrics3 h1').delay(1700).fadeOut(1000);
        $('#lyrics4 h1').delay(1600).fadeOut(1000);
        $('#lyrics5 h1').delay(1500).fadeOut(1000);
        $('#lyrics6 h1').delay(1400).fadeOut(1000);
        $('#lyrics7 h1').delay(1300).fadeOut(1000);
        $('#lyrics8 h1').delay(1100).fadeOut(1000);
        $('#lyrics9 h1').delay(1000).fadeOut(1000);
        $('#lyrics10 h1').html("But never doubt").slideDown(1000).delay(4000).fadeOut(1000);
        break;
      default:
        break;
    }
  }



  timings = new Array();
  timings[0] = 56.8;
  timings[1] = 60;
  timings[2] = 63.2;
  timings[3] = 65.6;
  timings[4] = 68.9;
  timings[5] = 72;
  timings[6] = 75;
  timings[7] = 76.8;
  timings[8] = 77;
  timings[9] = 80.2;
  timings[10] = 82.5;
  timings[11] = 86.5;
  timings[12] = 90;
  timings[13] = 90.3;
  timings[14] = 92.5;
  timings[15] = 94.3;
  timings[16] = 97;
  timings[17] = 99;
  timings[18] = 100.5;
  timings[19] = 102.7;
  timings[20] = 104.3;
  timings[21] = 105.7;
  timings[22] = 107.3;
  timings[23] = 108.6;
  timings[24] = 110.2;
  timings[25] = 111.8;
  timings[26] = 113.8;
  timings[27] = 116.7;
  timings[28] = 122;
  timings[29] = 127;
  timings[30] = 128.5;
  timings[31] = 133.9;
  timings[32] = 136;
  timings[33] = 138.9;
  timings[34] = 142.7
  timings[35] = 145.2;
  timings[36] = 148;
  timings[37] = 150.4;
  timings[38] = 153;
  timings[39] = 156;
  timings[40] = 159.5;

  timings[41] = 163.7;
  timings[42] = 165.9;
  timings[43] = 167.7;
  timings[44] = 170.4;
  timings[45] = 172.4;
  timings[46] = 173.9;
  timings[47] = 176.1;
  timings[48] = 177.7;
  timings[49] = 179.1;
  timings[50] = 180.4;
  timings[51] = 182.0;
  timings[52] = 183.6;
  timings[53] = 185.6;
  timings[54] = 187;
  timings[55] = 189.8;
  timings[56] = 195.1;

  timings[57] = 202.5;
  timings[58] = 203.8;
  timings[59] = 204.8;
  timings[60] = 205.5;
  timings[61] = 206.5;
  timings[62] = 207.5;
  timings[63] = 208.5;
  timings[64] = 209.5;
  timings[65] = 210.5;
  timings[66] = 211.9;
  timings[67] = 214;
  timings[68] = 216.3;
  timings[69] = 234;
  timings[70] = 237;
  timings[71] = 240;
  timings[72] = 243;
  timings[73] = 269;

  timings[74] = 275.6;
  timings[75] = 277.4;
  timings[76] = 279.2;
  timings[77] = 281.9;
  timings[78] = 283.9;
  timings[79] = 285.4;
  timings[80] = 288;
  timings[81] = 288.7;
  timings[82] = 290.3;
  timings[83] = 291.6;
  timings[84] = 293.2;
  timings[85] = 294.8;
  timings[86] = 296.8;
  timings[87] = 298.2;
  timings[88] = 301;
  timings[89] = 323;
  timings[90] = 326;

});