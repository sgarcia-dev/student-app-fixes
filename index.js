'use strict';

// function formatQueryParams(params) {
//   const queryItems = Object.keys(params)
//     .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
//   return queryItems.join('&');
// }

function displayTimeResults(response5Json, response2Json, countryCapital){
  console.log(response5Json);
  console.log(response2Json);
  console.log(countryCapital);
  let actualTime = response5Json.datetime;
  let actualTimeShort = actualTime.substring(11,15);
  console.log(actualTimeShort);
$('#timeresults').empty();
$('#timeresults').append(
    `<p>It's actually ${actualTimeShort} in ${countryCapital}. Maybe you need 
        ${response2Json.data.translations[1].translatedText} (Good afternoon!) or 
        ${response2Json.data.translations[2].translatedText} (Good evening!) ?</p>`
  );
$('#timeresults').removeClass('hidden');

}

function timeZone2(response4Json, response2Json, countryCapital){
  console.log(response4Json);
  let timeZone = response4Json.timeZoneId;
  console.log(timeZone);
  fetch("https://worldtimeapi.org/api/timezone/"+timeZone)
  .then(res5 => {
    if (res5.ok) {
      return res5.json();
    }
    throw new Error(res5.statusText);
  })
  .then(response5Json => displayTimeResults(response5Json, response2Json, countryCapital))
  .catch(err => {
    $('#js-error-message').text(`Something went wrong: ${err.message}`);
  });

}

function timeZone1(response3Json, response2Json, countryCapital){
  console.log(response3Json);
  let lat=response3Json[0].results.geometry.location.lat;
  let long=response3Json[0].results.geometry.location.long;
  let timeStamp= Date.now();
  let timeStampShort= timeStamp.substring(0, timeStamp.length-3)
  console.log(timeStampShort);
  fetch("https://maps.googleapis.com/maps/api/timezone/json?location="+lat+","+long+"&timestamp="+timeStampShort+"&key=AIzaSyDumOtzsZBkWdtNzTDcdsVLKYJ6yJUtkks")
  .then(res4 => {
    if (res4.ok) {
      return res4.json();
    }
    throw new Error(res4.statusText);
  })
  .then(response4Json => timeZone2(response4Json, response2Json, countryCapital))
  .catch(err => {
    $('#js-error-message').text(`Something went wrong: ${err.message}`);
  });
}

function geoCoding(response1Json, response2Json){
  let countryCapital=response1Json[0].capital;
  let countryCode=response1Json[0].alpha2Code;

  fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+countryCapital+"&components=country:"+countryCode+"&key=AIzaSyDumOtzsZBkWdtNzTDcdsVLKYJ6yJUtkks")
  .then(res3 => {
   if (res3.ok) {
     return res3.json();
   }
   throw new Error(res3.statusText);
 })
 .then(response3Json => timeZone1(response3Json, response2Json, countryCapital))
 .catch(err => {
   $('#js-error-message').text(`Something went wrong: ${err.message}`);
 });
}
  
function displayTranslationResults(response2Json)
{ console.log(response2Json);
  
  const name = $('#js-name').val();

$('#results').empty();
$('#results').append(
    `<p>${response2Json.data.translations[0].translatedText} ${name}!!!!!</p>`
  );
$('#results').removeClass('hidden');
}

function googleTranslate(response1Json) {
   console.log(response1Json);

   let language = response1Json[0].languages[0];
   console.log(language);

   const data1 = {
    "q": ["Good Morning! My name is", "Good afternoon!", "Good evening!"],
    "source": "en",
    "target": language
   } 

   const options1 = {
    headers: new Headers({
        "Content-Type":"application/json"
        }),
    method: "POST",
    body: JSON.stringify(data1)
   } 
     
 fetch("https://translation.googleapis.com/language/translate/v2?key=AIzaSyDumOtzsZBkWdtNzTDcdsVLKYJ6yJUtkks", options1)
   .then(res2 => {
    if (res2.ok) {
      return res2.json();
    }
    throw new Error(res2.statusText);
  })
  .then(response2Json => displayTranslationResults(response2Json))
  .catch(err => {
    $('#js-error-message').text(`Something went wrong: ${err.message}`);
  });
  
}

debugger


function getResults(country) {

const url = "https://restcountries-v1.p.rapidapi.com/name/"+country;

console.log(url);

  const options = {
    headers: new Headers({
    "x-rapidapi-host": "restcountries-v1.p.rapidapi.com",
	  "x-rapidapi-key": "ebaaafd4d3msh752c26791113a7fp144b54jsn7740997f5edd"
  })}

debugger

  fetch(url, options)
    .then(res1 => {
      if (res1.ok) {
        return res1.json();
      }
      throw new Error(res1.statusText);
    })
    .then(response1Json => googleTranslate(response1Json))
    .then(countryCapital => response1Json[0].capital = countryCapital)
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
geoCoding(response1Json, countryCapital);

}

debugger

function watchForm(){
  $('form').submit(event => {
    event.preventDefault();
    const country = $('#js-country').val();
    getResults(country);
  });
}

$(watchForm);