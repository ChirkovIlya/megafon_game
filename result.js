let resultsJson;
let balance;
let choice_ids = JSON.parse(localStorage.getItem("choice_ids"));
let balance_updates = JSON.parse(localStorage.getItem("balance_updates"));

function calcResults(userAccount){
  $.getJSON( "json/results.json", function( json ) {
    $('#gameplay-container').fadeOut(500).promise().done(function(){
      $('#results-container').fadeIn(500);
    });
    resultsJson = json;
    balance = userAccount;
    calcPresent();
    getConclusionOfFirstStory();
    getConclusionOfSecondStory();
    balanceIncreaseCount();
    autopayAnalyze();
  })
}

function calcPresent(){
  let presents = resultsJson.presents;
  let results = presents.filter(item => item.account <= balance)
  console.log(results[results.length - 1]);
}

function getConclusionOfFirstStory(){
  let event_a = resultsJson.event_a;
  let result;
  event_a.forEach(function(i){
    i.choices.forEach(function(choice){
      if(choice_ids.includes(choice)){
        result = i;
      }
    })
  })
  console.log(result)
}

function getConclusionOfSecondStory(){
  let event_b = resultsJson.event_b;
  let result;
  event_b.forEach(function(i){
    i.choices.forEach(function(choice){
      if(choice_ids.includes(choice)){
        result = i;
      }
    })
  })
  console.log(result)
}

function balanceIncreaseCount(){
  console.log(balance_updates.length)
}

function autopayAnalyze(){
  let texts = resultsJson.autopay.texts
  if(balance_updates.length < resultsJson.autopay.deltaCounts){
    if(choice_ids.includes(resultsJson.autopay.events_secondChance)){
      console.log(texts[7]);
    }else{
      console.log(texts[8]);
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
      console.log(texts[6])
      console.log('+показываем комерцию')
    }else if(K >= 8){
      if(x < resultsJson.autopay.deltaThreshold){
        console.log(texts[0])
      }else{
        console.log(texts[1])
      }
    }else if(K <= 4){
      if(y < resultsJson.autopay.deltaDays){
        console.log(texts[2])
      }else{
        console.log(texts[3])
      }
    }else if((K >= 5) && (K <= 7)){
           if(y < resultsJson.autopay.deltaDays){
        console.log(texts[4])
      }else{
        console.log(texts[5])
      }
    }
  }
}
