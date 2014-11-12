var BOTH = 1;
window.addEventListener('blur', function(){ BOTH-- }, false);

function boom() {
  $('section#projects').animate( { height: 310 }, 600, 'easeInOutQuad', function() {
    $('section#projects div.grid_4, footer').each( function (n,v) { 
      setTimeout(
        function() { 
          $(v).animate({ opacity: 1 }, 200, 'easeInOutQuad', function() {
            if (n == 3) {
              $('#more_info').delay(400).animate({ opacity: 1 }, 400, 'easeInOutQuad');
            }
          })
        },
        (n * 500) + 250
      );
    });
  });
}

setTimeout( function(){ (++BOTH == 4) && boom(); }, 500 );
setTimeout( boom, 5000 ); // if things are taking too long, just do it

setTimeout(function() {
  $('#typekitjs').next('img').hide()
}, 1000);

$('section#projects img').imagesLoaded(function() {
  (++BOTH == 4) && boom();
});
$('footer').css({ opacity: 0 });
$('section#projects div.grid_4').css({ opacity: 0} );
$(window).focus(function() {
  (++BOTH == 4) && boom();
});
$(function() {
  (++BOTH == 4) && boom();
  window.onkeyup = function(e) {
    if (e.keyCode == 27) less.watchMode = ! less.watchMode;
    window.status = 'less refresh ' + (less.watchMode ? 'on' : 'off');
  };
});