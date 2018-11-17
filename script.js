let $el = $("#game-container");
let elHeight = $el.outerHeight();
let elWidth = $el.outerWidth();
let prestoryJson = {};
let currentScreen = 'prestory';
let currentSlideNumber = 0;
var timeoutHandleToNextSlide = window.setTimeout(function() {
    changeSlide($(".history-slide.active"), currentSlideNumber+1);
},5000);

$( document ).ready(function() {
    console.log( "ready!" );
    initResizeGameArea();
    initPrestory();
    // initGameplay();
});

$( window ).resize(function() {
  initResizeGameArea();
});

function initResizeGameArea() {
  let scale, origin;

  scale = Math.min(
    $( window ).width() / elWidth,
    $( window ).height() / elHeight
  );
  $el.css({
    transform: "translate(-50%, -50%) " + "scale(" + scale + ")"
  });
};

// Prestory functions

function initPrestory(){
  $.getJSON( "json/prestory.json", function( json ) {
    console.log(json.prestory);
    prestoryJson = json;
    $.each(json.prestory, function(i, v){
      let html;
      if(i == 0){
        let nextSlide = i+1;
        html = `<div class="history-slide active" id="history-`+i+`">
                  <div class="history-image" style="background-image: url('img/bg/summer.gif'); background-size:cover; background-position: center;"></div>
                  <div class="history-actions d-flex flex-row align-items-center justify-content-between">
                    <div class="history-button opacity-0 visibility-hidden prev-slide-btn">Назад</div>
                    <div class="history-text text-center">
                      <p class="mb-0 ml-5">`+v.text+`</p>
                    </div>
                    <div class="history-button next-slide-btn" target-slide="`+ nextSlide +`">
                      <img src="img/elements/slide btn.png" class="img-fluid slide-btn">
                    </div>
                  </div>
                </div>`
      }else if (i == json.prestory.length-1) {
        let prevSlide = i-1;
        html = `<div class="history-slide" id="history-`+i+`">
                  <div class="history-image" style="background-image: url('img/bg/summer.gif'); background-size:cover; background-position: center;"></div>
                  <div class="history-actions d-flex flex-row align-items-center justify-content-between">
                    <div class="history-button prev-slide-btn" target-slide="`+ prevSlide +`">
                      <img src="img/elements/slide btn.png" class="img-fluid slide-btn rotate-180">
                    </div>
                    <div class="history-text text-center">
                      <p class="mb-0 mx-5">`+v.text+`</p>
                    </div>
                    <div class="history-button next-slide-btn" target-slide="`+json.prestory.length+`">
                      <img src="img/elements/go.png" class="img-fluid slide-btn">
                    </div>
                  </div>
                </div>`
      }else{
        let prevSlide = i-1;
        let nextSlide = i+1;
        html = `<div class="history-slide" id="history-`+i+`">
                  <div class="history-image" style="background-image: url('img/bg/summer.gif'); background-size:cover; background-position: center;"></div>
                  <div class="history-actions d-flex flex-row align-items-center justify-content-between">
                    <div class="history-button prev-slide-btn" target-slide="`+ prevSlide +`">
                      <img src="img/elements/slide btn.png" class="img-fluid slide-btn rotate-180">
                    </div>
                    <div class="history-text text-center">
                      <p class="mb-0 mx-5">`+v.text+`</p>
                    </div>
                    <div class="history-button next-slide-btn" target-slide="`+ nextSlide +`">
                      <img src="img/elements/slide btn.png" class="img-fluid slide-btn">
                    </div>
                  </div>
                </div>`
      }
      $('#history-container').append(html);
    })
  });
}

$(document).keydown(function(e) {
  if(currentScreen == "prestory"){
    console.log(currentScreen)
    switch(e.key) {
      case 'ArrowLeft': // left
      changeSlide($(".history-slide.active"), currentSlideNumber-1);
      break;

      case 'ArrowRight': // right
      changeSlide($(".history-slide.active"), currentSlideNumber+1);
      break;

      default: return; // exit this handler for other keys
    }
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
});

function changeSlide(currentSlide, targetSlideNumber){
  window.clearTimeout(timeoutHandleToNextSlide);
  if((targetSlideNumber >= 0) && (prestoryJson.prestory.length-1 >= targetSlideNumber)){
    let neededSlide = $('#history-'+targetSlideNumber);
    currentSlideNumber = parseInt(targetSlideNumber);
    console.log(neededSlide);
    currentSlide.closest('.history-slide').removeClass('active');
    neededSlide.addClass('active');
    timeoutHandleToNextSlide = window.setTimeout(function() {
        changeSlide($(".history-slide.active"), currentSlideNumber+1);
    },5000);
  }else if(prestoryJson.prestory.length-1 < targetSlideNumber){
    initGameplay()
  }
}

$('body').on('click', '.history-button', function(){
  let targetSlideNumber = $(this).attr('target-slide');
  changeSlide($(this), targetSlideNumber);
})


function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
}
