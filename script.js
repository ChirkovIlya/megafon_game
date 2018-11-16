let $el = $("#game-container");
let elHeight = $el.outerHeight();
let elWidth = $el.outerWidth();
let prestoryJson = {};

$( document ).ready(function() {
    console.log( "ready!" );
    initResizeGameArea();
    initPrestory();
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

function initPrestory(){
  $.getJSON( "json/prestory.json", function( json ) {
    console.log(json.prestory);
    $.each(json.prestory, function(i, v){
      let html;
      if(i == 0){
        let nextSlide = i+1;
        html = `<div class="history-slide active" id="history-`+i+`">
                  <div class="history-image" style="background-image: url('весна.jpg'); background-size:cover; background-position: center;"></div>
                  <div class="history-actions d-flex flex-row align-items-center justify-content-between">
                    <div class="history-button opacity-0 visibility-hidden prev-slide-btn">Назад</div>
                    <div class="history-text text-center">
                      <p class="mb-0 ml-5">`+v.text+`</p>
                    </div>
                    <div class="history-button next-slide-btn" target-slide="`+ nextSlide +`">
                      <img src="slide btn.png" class="img-fluid slide-btn">
                    </div>
                  </div>
                </div>`
      }else if (i == json.prestory.length-1) {
        let prevSlide = i-1;
        html = `<div class="history-slide" id="history-`+i+`">
                  <div class="history-image" style="background-image: url('весна.jpg'); background-size:cover; background-position: center;"></div>
                  <div class="history-actions d-flex flex-row align-items-center justify-content-between">
                    <div class="history-button prev-slide-btn" target-slide="`+ prevSlide +`">
                      <img src="slide btn.png" class="img-fluid slide-btn rotate-180">
                    </div>
                    <div class="history-text text-center">
                      <p class="mb-0 mx-5">`+v.text+`</p>
                    </div>
                    <div class="history-button next-slide-btn" target-slide="startGame">
                      <img src="go.png" class="img-fluid slide-btn">
                    </div>
                  </div>
                </div>`
      }else{
        let prevSlide = i-1;
        let nextSlide = i+1;
        html = `<div class="history-slide" id="history-`+i+`">
                  <div class="history-image" style="background-image: url('весна.jpg'); background-size:cover; background-position: center;"></div>
                  <div class="history-actions d-flex flex-row align-items-center justify-content-between">
                    <div class="history-button prev-slide-btn" target-slide="`+ prevSlide +`">
                      <img src="slide btn.png" class="img-fluid slide-btn rotate-180">
                    </div>
                    <div class="history-text text-center">
                      <p class="mb-0 mx-5">`+v.text+`</p>
                    </div>
                    <div class="history-button next-slide-btn" target-slide="`+ nextSlide +`">
                      <img src="slide btn.png" class="img-fluid slide-btn">
                    </div>
                  </div>
                </div>`
      }
      $('#history-container').append(html);
    })
  });
}

$('body').on('click', '.history-button', function(){
  let targetSlideNumber = $(this).attr('target-slide');
  let neededSlide = $('#history-'+targetSlideNumber);

  console.log(neededSlide);
  $(this).closest('.history-slide').removeClass('active');
  neededSlide.addClass('active');
})
