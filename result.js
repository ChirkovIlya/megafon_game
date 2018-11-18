let resultsJson;
let balance;
let choice_ids = JSON.parse(localStorage.getItem("choice_ids"));
let balance_updates = JSON.parse(localStorage.getItem("balance_updates"));
let currentSlide = 1;

function calcResults(userAccount){
  $.getJSON( "json/results.json", function( json ) {
    $('#gameplay-container').fadeOut(500).promise().done(function(){
      $('#results-container').fadeIn(500);
    });
    resultsJson = json;
    balance = userAccount;
    isGameStoped();
    calcPresent();
    getConclusionOfStories();
    balanceIncreaseCount();
    autopayAnalyze();
  })
}

function isGameStoped(){
  let result;
  if(choice_ids.includes('event_exit_choice_0')){
    result = resultsJson.main[1];
  }else{
    result = resultsJson.main[0];
  }
  let html=
  `
  <div class="result-slide active" id="result-1">
    <p class="head text-green">`+result.head+`</p>
    <p class="desc">`+result.text+`</p>
    <button class="result-btn d-flex align-items-center justify-content-center" type="button" name="button" data-nextSlide="2">А мама?</button>
  </div>
  `
  $('#results-container').append(html);
}

function calcPresent(){
  let presents = resultsJson.presents;
  let results = presents.filter(item => item.account <= balance);
  let result = results[results.length - 1];
  if(result){
    let html=
    `
    <div class="result-slide" id="result-2">
      <p class="desc">За всю игру вам удалось накопить `+balance+` руб. и...</p>
      <p class="head text-green">..вы купили маме `+result.present+`</p>
      <button class="result-btn d-flex align-items-center justify-content-center" type="button" name="button" data-nextSlide="3">А ещё?</button>
    </div>
    `
    $('#results-container').append(html);
  }else{
    let html=
    `
    <div class="result-slide" id="result-2">
      <p class="desc">За всю игру вам удалось накопить `+balance+` руб. и...</p>
      <p class="head text-green">..вы привезли маме сувенир из Антарктиды</p>
      <button class="result-btn d-flex align-items-center justify-content-center" type="button" name="button" data-nextSlide="3">А ещё?</button>
    </div>
    `
    $('#results-container').append(html);
  }
}

function getConclusionOfStories(){
  let resultA;
  let resultB;
  let event_a = resultsJson.event_a;
  let event_b = resultsJson.event_b;
  event_a.forEach(function(i){
    i.choices.forEach(function(choice){
      if(choice_ids.includes(choice)){
        resultA = i;
      }
    })
  })

  event_b.forEach(function(i){
    i.choices.forEach(function(choice){
      if(choice_ids.includes(choice)){
        resultB = i;
      }
    })
  })
  if(resultA && resultB){
    let html=
    `
    <div class="result-slide" id="result-3">
      <div class="result-dog">
        <p class="desc text-green">Пребывая в Антарктиде...</p>
        <p class="head">`+resultA.text+`</p>
      </div>
      <div class="result-pinguin">
        <p class="desc text-green">Исполняя служебный долг...</p>
        <p class="head">`+resultB.text+`</p>
      </div>
      <button class="result-btn d-flex align-items-center justify-content-center" type="button" name="button" data-nextSlide="4">Круто!</button>
    </div>
    `
    $('#results-container').append(html);
  }else if(resultA){
    let html=
    `
    <div class="result-slide" id="result-3">
      <div class="result-dog">
        <p class="desc text-green">Пребывая в Антарктиде...</p>
        <p class="head">`+resultA.text+`</p>
      </div>
      <button class="result-btn d-flex align-items-center justify-content-center" type="button" name="button" data-nextSlide="4">Круто!</button>
    </div>
    `
    $('#results-container').append(html);
  }else if(resultB){
    let html=
    `
    <div class="result-slide" id="result-3">
      <div class="result-pinguin">
        <p class="desc text-green">Исполняя служебный долг...</p>
        <p class="head">`+resultB.text+`</p>
      </div>
      <button class="result-btn d-flex align-items-center justify-content-center" type="button" name="button" data-nextSlide="4">Круто!</button>
    </div>
    `
    $('#results-container').append(html);
  }
}

function balanceIncreaseCount(){
  let html =
  `
  <div class="result-slide" id="result-4">
    <p class="desc text-green">За всю игру..</p>
    <p class="head">..вы пополнили баланс <span class="text-green">`+balance_updates.length+` раз(-а)</span></p>
    <p class="secondary-text" style="top: 50%; left: 15%;">..сколько же сил вы потратили на постоянный контроль...</p>
    <p class="secondary-text" style="bottom: 3%; left: 30%;">..и еще мы проанализировали ваши действия..</p>
    <button class="result-btn d-flex align-items-center justify-content-center" type="button" name="button" data-nextSlide="5">...и что там?</button>
  </div>
  `
  $('#results-container').append(html);
}

function autopayAnalyze(){
  let texts = resultsJson.autopay.texts;
  let showCommerce = false;
  let result;
  if(balance_updates.length < resultsJson.autopay.deltaCounts){
    if(choice_ids.includes(resultsJson.autopay.events_secondChance)){
      result = texts[7];
    }else{
      result = texts[8];
    }
  }else{
    let K = 0;
    K += choice_ids.includes('event_sub_0_choice_0') ? 2 : 0
    K += choice_ids.includes('event_sub_1_choice_0') ? 2 : 0
    K += choice_ids.includes('event_sub_2_choice_1') ? 2 : 0
    K += choice_ids.includes('event_sub_3_choice_0') ? 2 : 0
    K += choice_ids.includes('event_sub_4_choice_0') ? 2 : 0

    K += choice_ids.includes('event_sub_0_choice_1') ? 1 : 0
    K += choice_ids.includes('event_sub_3_choice_1') ? 1 : 0
    K += choice_ids.includes('event_sub_5_choice_0') ? 1 : 0

    let sumOfBefore = 0;
    let sumOfDifferX = 0;
    let sumOfDifferY = 0;
    let sumOfDays = 0;
    let z = 0;
    balance_updates.forEach(function(i){
      sumOfBefore += parseInt(i.before);
      sumOfDays += parseInt(i.day);
      if(i.event_id){
        z++
      }
    })
    let avrX = sumOfBefore/balance_updates.length;
    let avrY = sumOfDays/balance_updates.length;
    balance_updates.forEach(function(i){
      sumOfDifferX += Math.abs(parseInt(i.before) - avrX) * (parseInt(i.diff) / 100);
      sumOfDifferY += Math.abs(parseInt(i.day) - avrY) * (parseInt(i.diff) / 100);
    })
    let x = sumOfDifferX/balance_updates.length
    let y = sumOfDifferY/balance_updates.length

    if(z > resultsJson.autopay.deltaCommerce){
      // result = texts[6];
      showCommerce = true;
    }
    if(K >= 8){
      if(x < resultsJson.autopay.deltaThreshold){
        result = texts[0];
      }else{
        result = texts[1];
      }
    }else if(K <= 4){
      if(y < resultsJson.autopay.deltaDays){
        result = texts[2];
      }else{
        result = texts[3];
      }
    }else if((K >= 5) && (K <= 7)){
      if(y < resultsJson.autopay.deltaDays){
        result = texts[4];
      }else{
        result = texts[5];
      }
    }
  }
  if(showCommerce){
    let html = `
    <div class="result-slide" id="result-5">
      <p class="desc text-center text-green mb-5">..мы немного за вами понаблюдали..</p>
      <div class="d-flex flex-row align-items-around" style="height: 840px;">
        <div class="autopay-section w-100 d-flex flex-column p-3">
          <p class="descOfResults mb-5">`+result.psychotype+`</p>
          <p class="descOfResults">`+result.autopay+`</p>
          <a href="https://megafon.ru/pay/pay_by_card/" class="result-btn d-flex align-items-center justify-content-center mx-auto mt-auto" target="_blank" name="button">Подключить</a>
        </div>
        <div class="commerce-section w-100 d-flex flex-column p-3">
          <p class="descOfResults mb-5">`+texts[6].psychotype+`</p>
          <p class="descOfResults">`+texts[6].autopay+`</p>
          <a href="https://megafon.ru/pay/pay_by_card/" class="result-btn d-flex align-items-center justify-content-center mx-auto mt-auto" target="_blank" name="button">Подключить</a>
        </div>
      </div>
    </div>
    `
    $('#results-container').append(html);
  }else{
    let html = `
    <div class="result-slide" id="result-5">
      <p class="desc text-center text-green mb-5">..мы немного за вами понаблюдали..</p>
      <div class="d-flex flex-row align-items-around" style="height: 840px;">
        <div class="autopay-section w-100 d-flex flex-column p-3">
          <p class="descOfResults mb-5">`+result.psychotype+`</p>
          <p class="descOfResults">`+result.autopay+`</p>
          <a href="https://megafon.ru/pay/pay_by_card/" class="result-btn d-flex align-items-center justify-content-center mx-auto mt-auto" target="_blank" name="button">Подключить</a>
        </div>
      </div>
    </div>
    `
    $('#results-container').append(html);
  }
}

$('body').on('click', '.result-btn', function(){
  let nextSlide = $(this).attr('data-nextSlide');
  if(nextSlide){
    let neededSlide = $('#result-'+nextSlide);
    $(this).closest('.result-slide').removeClass('active');
    neededSlide.addClass('active');
  }
})
