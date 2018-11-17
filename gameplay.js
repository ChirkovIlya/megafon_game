let clickSound;
let daySpeed = 700;

let userAccount = 500;
let userBalance = 50;

let currentDate = "1 апреля"; // дата в виде текста, для написания в игровом интерфейсе
let currentDayInDate = 1; // номер дня в дате
let seasonCount = 0;
//            |-----------|--------------|-----------------|
let months = ["апреля", "мая", "июня", "июля", "августа", "сентября"]; // названия месяцов
let daysInMonths = [30, 31, 30, 31, 31, 30]; // кол-во дней в месяце
let daysForBackgroundChange = [45, 61, 47] // кол-во дней в каждом сезоне
let currentDayInSeason = 1; // номер дня, отностиельно сезона
let currentDayCount = 1; // номер дня, относительно всей игры (1 из 183)
let currentMonthCount = 0; // порядковый номер текущего месяца в массиве months
let daysTotal = 183; // кол-во дней всего
let eventOpened = false;

var gameTimeHandler = window.setTimeout(function() {
    gameTime(currentDayCount);
},daySpeed);

let logsJson;

function initGameplay(){
  $.getJSON( "json/logs.json", function( json ) {
    logsJson = json;
  })
  localStorage.setItem("choice_ids", JSON.stringify([]));
  clickSound = new sound("sounds/tap.wav");
  currentScreen = 'game';
  updateBalanceText();
  updateAccountText();
  $('#history-container').fadeOut();
  $('#gameplay-container').fadeIn();
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

$('body').on('click', '.game-button', function(){
  clickSound.play();
})

function gameTime(startDayNumber){
  if(startDayNumber < daysTotal){
    window.clearTimeout(gameTimeHandler);
    newDay(startDayNumber+1)
  }else{
    console.log('the end')
  }
}


function newDay(day) {
    gameTimeHandler = window.setTimeout(function() {
      currentDayCount = day;
      currentDayInDate++;
      if(currentDayInDate > daysInMonths[currentMonthCount]){
        beginingOfMonth();
      }
      checkBackgroundChange();
      generatePassiveOutcome();

      $('.date-container').html('<span>'+currentDayInDate+' '+months[currentMonthCount]+'</span>');
      if(!eventOpened){
        gameTime(currentDayCount)
      }
    }, daySpeed);
}

$(document).ready(function(){
  $('body').on('click', '.logout-btn', function(){
    console.log('click pause');
    window.clearTimeout(gameTimeHandler);
  });
  $('body').on('click', '.help-btn', function(){
    console.log('click continue');
    gameTime(currentDayCount);
  });
})


function generatePassiveOutcome(){
  let outcomes = logsJson.passive_outgo;
  let text = outcomes[randomInteger(0, outcomes.length-1)]
  let outcome = -Math.abs(randomInteger(3, 5));

  userBalance+=outcome;

  printLog(text, outcome)
  updateBalanceText();

  checkIsBalanceNotZero();
}

function printLog(text, changes){
  if(text == logsJson.balance_deduct){
    $('.logs-container').append('<p class="log text-danger">'+changes+' руб., '+text+'</p>')
  }else{
    $('.logs-container').append('<p class="log">'+changes+' руб., '+text+'</p>')
  }
  let count = $('.logs-container p').length
  if(count == 4){
    $('.logs-container p:eq( 0 )').remove();
  }else if(count == 2){
    $('.logs-container p:eq( 0 )').css('opacity', .5);
    $('.logs-container p:eq( 1 )').css('opacity', 1);
  }else if (count == 1) {
    $('.logs-container p:eq( 0 )').css('opacity', 1);
  }
}

function checkIsBalanceNotZero(){
  if(userBalance <= 0){
    window.clearTimeout(gameTimeHandler);
    // alert('Game Over');
    openEvent('event_secondChance')
  }
}

function updateBalanceText(){
  $('#balance-text').text(userBalance)
}

function updateAccountText(){
  $('#account-text').text(userAccount)
}

function beginingOfMonth(){
  console.log('new months');
  currentDayInDate = 1;
  currentMonthCount++;
  if(userBalance > 100){
    let diff = -Math.abs(userBalance - 100);
    userBalance = 100;
    printLog(logsJson.balance_deduct, diff)
    updateBalanceText()
  }
  userAccount+=500;
  updateAccountText();
}

function checkBackgroundChange(){
  currentDayInSeason++;
  if(seasonCount < 4){
    let currentSeaasonElement = $(".gameplay-background[data-season="+seasonCount+"]");
    let nextSeasonElement = $(".gameplay-background[data-season="+ (seasonCount+1) +"]");
    let daysInSeason = daysForBackgroundChange[seasonCount];
    if(daysInSeason < currentDayInSeason){
      seasonCount++;
      currentDayInSeason = 1;
    }else{
      currentSeaasonElement.css('opacity', (1 - currentDayInSeason/daysInSeason));
      nextSeasonElement.css('opacity', currentDayInSeason/daysInSeason);
    }
  }
}


function openEvent(event_id){
  eventOpened = true;
  if(event_id == 'event_secondChance'){
    $.getJSON( "json/event_secondChance.json", function( json ) {
      generateEvent(json)
    })
  }else{
    $.getJSON( "json/event_start.json", function( json ) {
      generateEvent(json)
    })
  }
}

function generateEvent(eventJson){
  let html = `
  <div class="event-container d-flex flex-column">
    <div class="event-text d-flex flex-row align-items-center justify-content-center">
      <p class="mb-0">`+eventJson.text+`</p>
    </div>
    <div class="event-buttons d-flex flex-row justify-content-between">
      <button class="event-button game-button d-flex align-items-center justify-content-center" type="button" name="button" data-balance="`+eventJson.buttons[0].balance+`" data-msg="`+eventJson.buttons[0].msg+`" data-choice_id="`+eventJson.buttons[0].choice_id+`">`+eventJson.buttons[0].text+`</button>
      <button class="event-button game-button d-flex align-items-center justify-content-center" type="button" name="button" data-balance="`+eventJson.buttons[1].balance+`" data-msg="`+eventJson.buttons[1].msg+`" data-choice_id="`+eventJson.buttons[1].choice_id+`">`+eventJson.buttons[1].text+`</button>
    </div>
  </div>`
  $('#gameplay-container').append(html);
}

$('body').on('click', '.event-button', function(){
  let balance = $(this).attr('data-balance');
  let msg = $(this).attr('data-msg');
  let choice_id = $(this).attr('data-choice_id');
  console.log(balance, msg, choice_id);
  if(balance){
    userBalance+=parseInt(balance);
    updateBalanceText();
  }
  if(msg){
    if(parseInt(balance)>0){
      printLog(msg, '+'+balance)
    }else{
      printLog(msg, balance)
    }
  }
  if(choice_id){
    let choice_ids = JSON.parse(localStorage.getItem("choice_ids"));
    choice_ids.push(choice_id);
    localStorage.setItem("choice_ids", JSON.stringify(choice_ids));
  }
  $('body').find('.event-container').remove()
  eventOpened = false;
  gameTime(currentDayCount);
})

$('body').on('click', '.topup-container', function(){
  window.clearTimeout(gameTimeHandler);
  eventOpened = true;
  let html = `
  <div class="topup-event-container d-flex flex-column">
    <div class="event-text d-flex flex-row align-items-center justify-content-center">
      <p class="mb-0">Пополнить баланс</p>
    </div>
    <div class="event-buttons d-flex flex-row justify-content-around mb-5">
      <button class="top-up-event-button game-button d-flex align-items-center justify-content-center" type="button" name="button" data-balance="10">+ 10 руб.</button>
      <button class="top-up-event-button game-button d-flex align-items-center justify-content-center" type="button" name="button" data-balance="30">+ 30 руб.</button>
    </div>
    <div class="event-buttons d-flex flex-row justify-content-around">
      <button class="top-up-event-button game-button d-flex align-items-center justify-content-center" type="button" name="button" data-balance="50">+ 50 руб.</button>
      <button class="top-up-event-button game-button d-flex align-items-center justify-content-center" type="button" name="button" data-balance="0">Передумал</button>
    </div>
  </div>
  `
  $('#gameplay-container').append(html);
})


$('body').on('click', '.top-up-event-button', function(){
  let balance = $(this).attr('data-balance');
  if(balance != 0){
    userBalance+=parseInt(balance);
    userAccount-=parseInt(balance);
    updateBalanceText();
    updateAccountText();
    printLog('Баланс пополнен', '+'+balance)
  }
  $('body').find('.topup-event-container').remove()
  eventOpened = false;
  gameTime(currentDayCount);
})
