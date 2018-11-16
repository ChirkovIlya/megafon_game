var $el = $("#very-specific-design");
var elHeight = $el.outerHeight();
var elWidth = $el.outerWidth();
//
// var $wrapper = $(window);
//
// $wrapper.resizable({
//   resize: doResize
// });
//
// function doResize(event, ui) {
//
//   var scale, origin;
//
//   scale = Math.min(
//     ui.size.width / elWidth,
//     ui.size.height / elHeight
//   );
//
//   $el.css({
//     transform: "translate(-50%, -50%) " + "scale(" + scale + ")"
//   });
//
// }
//
// var starterData = {
//   size: {
//     width: $wrapper.width(),
//     height: $wrapper.height()
//   }
// }
// doResize(null, starterData);
$( document ).ready(function() {
    console.log( "ready!" );
    initResizeGameArea();
});

$( window ).resize(function() {
  initResizeGameArea();
});

function initResizeGameArea() {
  var scale, origin;

  scale = Math.min(
    $( window ).width() / elWidth,
    $( window ).height() / elHeight
  );
  $el.css({
    transform: "translate(-50%, -50%) " + "scale(" + scale + ")"
  });
};
