console.log("program is running");
  //user enters and submits origin and destination location and dates==================================================================
  //reference to the travel date
  //var checkTime = moment("2019-06-11 12:00:00");
  
  
  
  //Important variables
  var coordLoc = {lat: 0, long:0};
  var destCity = "";
  var departDate = "";
  
  //processes and returns formatted user's travel date.
  function processUserDate(tDate) {
    //reference to the travel date
    var dateTime = moment(tDate + " 12:00:00");
    var tDateTime = dateTime.format("YYYY-MM-DD HH:mm:ss");
    console.log(tDateTime);
    console.log("Data type of the target time is " + typeof(tDateTime));
   // var checkTime = moment("2019-06-11 12:00:00");
   /*
    var tDateTimeStr = tDateTime._i;
    console.log(tDateTimeStr);
    console.log("Data type of the converted target time is " + typeof(tDateTimeStr));*/
    //console.log(checkTime);
    return tDateTime;
  }
  
  //processes and returns destination city name
  function processCityName() {
    return"";
  }
  
  //processes and returns destination state name.
  function processStateName() {
    return"";
  }
  
  
  //processes the given wind speed(m/s) and converts it to mph.
  function convertSpeed(speed) {
    return Math.round(speed*2.237);
  }
  
  //processes the given temperature(Kelvin) and converts it to Fahrenheit.
  function convertTemperature(temp) {
    return Math.round((temp - 273.15) * 1.80 + 32);
  }
  
  function dispAirports(airportsList) {
    var indAirport = 0;
    for (var i = 0; i < airportsList.length; i++) {
      // create a paragraph for each airport
      var newPar = $("<p>");
      newPar
    }
  
  }
  
  //Main click event that displays weather forecast for travel date(at noon).
  $("#user-input").on("click", function(event) {
    console.log("inside event click");
    event.preventDefault();
    console.log($("#dest-city").val());
    
    //User inputs for travel date and destination.
    destCity = $("#dest-city").val(); //assume user's destination is by city and state.
    departDate = $("#depart-date").val();
  
    console.log("user has entered input data....");
    //processing and extracting strings to use for queryParameters
    var indexComma = destCity.indexOf(",");
    var initQueryCity = destCity.substring(0, indexComma); 
    var queryCity = initQueryCity.replace(" ", "+");
    var queryState = destCity.substring(indexComma + 2);
    console.log(queryCity);
    console.log(queryState);
    //Geocoding API==================================================================
    //API provides the coordinates of the destination city
    //var googleAPIKEY = "AIzaSyAOxI0RCxTaOTVQQ5rlJVLg144oOqb2hGA";
    var googleAPIKEY = "AIzaSyCqOAF-sXj7Q5MxZzQTBIDyjHYSfVD_WT0"; //new api key
    var qURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + queryCity + "+" + queryState + "&key=" + googleAPIKEY;
    console.log("This is the query URL: " + qURL);
    $.ajax({
      url: qURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      //Use response from Geocoding API to extract and store the coordinates of the destination.
      coordLoc.lat = response.results[0].geometry.location.lat;
      coordLoc.long = response.results[0].geometry.location.lng;
  
    //OpenWeatherMap API ================================================================
    //API provides weather data for the destination using coordinates obtained from Geocoding API.
    // Dupe's API key.
    var weatherAPIKey = "61fb0fbf5b4af7a73cbae239fe1b3fbf";
    
    //*query parameters are coordLoc.lat and coordLoc.long; see queryURL.
    
    // Here we are building the URL we need to query the openweathermap API
    //var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + qPhrase + ",us&mode=json&appid=" + APIKey;
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + coordLoc.lat + "&lon=" + coordLoc.long + "&mode=json&appid=" +  weatherAPIKey;
    //http://samples.openweathermap.org/data/2.5/forecast?lat=35&lon=139&appid=b6907d289e10d714a6e88b30761fae22
    
    //AJAX call to the API
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
  
      // Create CODE HERE to Log the queryURL
      console.log(queryURL);
      // Create CODE HERE to log the resulting object
      console.log(response);
      console.log("Number of weather items returned: " + response.list.length);
      var listWeather = response.list;
      console.log("Departure date is " + departDate);
      console.log("Departure date is of type " + typeof(departDate));
      //reference to the travel date
      var convDepartDate = processUserDate(departDate);
      //reference to the index of the weather result for a specific day and time(noon).
      var indexWeather;
      for (var i = 0; i < listWeather.length; i++) {
        console.log(listWeather[i].dt_txt);
        if (listWeather[i].dt_txt === convDepartDate) {
          console.log("found it!");
          indexWeather = i;
          break;
        }
      }
      console.log("Index of the target date and time for weather display is " +  indexWeather);
      // Extract relevant weathe data from response object
      //var cityName = destCity;
      //convert from Kelvin to Fahrenheit
      var convTempHigh = convertTemperature(listWeather[indexWeather].main.temp_max);
      var convTempLow = convertTemperature(listWeather[indexWeather].main.temp_min);
      var convSpeed = convertSpeed(listWeather[indexWeather].wind.speed);
      var urlIcon = "http://openweathermap.org/img/w/" + listWeather[indexWeather].weather[0].icon + ".png";
      //dynamically create reference for url image.....DIDN'T WORK!!!!
      var imgIcon = $("<img>");
      imgIcon.attr("src", urlIcon);
      //==========================================================
      var monthDay = moment(convDepartDate).format("ddd MMM D");
    
      console.log(monthDay);
      var dispMessage = "Weather conditions at 12 noon in " + destCity + " on your travel Date:";
      var dispMessA = "DAY: "+  monthDay;
      var dispMessB = "DESCRIPTION: " + listWeather[indexWeather].weather[0].description + "    ";
      var dispMessC = "HIGH/LOW: " + convTempHigh + "&#8457" + "/" + convTempLow  + "&#8457";
      var dispMessD = "WIND: " + convSpeed + (" mph");
      var dispMessE = "HUMIDITY: " + listWeather[indexWeather].main.humidity + "%";
      var newLine = $("<br>");
      //$(".wind").text("Wind speed is " + response.wind.speed + "meter/sec");
      //$(".humidity").text("Humidity is " + response.main.humidity + "%");
      //$(".temp").text("Temperature is " + response.main.temp);
      console.log(dispMessage);
      console.log(dispMessA);
      console.log(dispMessB);
      console.log(dispMessC);
      console.log(dispMessD);
      console.log(dispMessE);
     
    //API provides airport options for user to choose from, based on the coordinates of the destination.
    var airportFinderKey = "f60e32620bmsh0545e1c4b416f30p1425cdjsn99e5174ad055";
    //var queryURL = "https://cometari-airportsfinder-v1.p.rapidapi.com/api/airports/by-radius";
    //var queryURL = "https://cometari-airportsfinder-v1.p.rapidapi.com/api/airports/by-radius?radius=50&lng=-157.895277&lat=21.265600"
    var queryRapidURL = "https://cometari-airportsfinder-v1.p.rapidapi.com/api/airports/by-radius?radius=50&lng=" + coordLoc.long + "&lat=" + coordLoc.lat;
    $.ajax({
      url: queryRapidURL,
      headers: {"X-RapidAPI-Host": "cometari-airportsfinder-v1.p.rapidapi.com", 
      "X-RapidAPI-Key": "f60e32620bmsh0545e1c4b416f30p1425cdjsn99e5174ad055"},
      method: "GET",
      dataType: "json"
    }).then(function(response) {
      //response from AirportFinder api.
      console.log(response);
      //console.log(response[0].name + " (" + response[0].code + ")" );
      //dynamically create a div to hold the airport options
      newAirportDiv = $("<div>");
      newAirportDiv.text("Please choose your destination airport");
      //loop through all the airport options
      for (var i = 0; i < response.length; i++) {
        //console.log("I am inside the for loop....");
        var newPara = $("<p>");
        newPara.text(response[i].name + " (" + response[i].code + ")" );
        console.log(response[i].name + " (" + response[i].code + ")" );
        newAirportDiv.append(newPara);
      }
      
  
  
  
    
  //$(".results").text();*/
  
      
      //clear the text inside weather result div.
      $("#result-weather").text("");
      $("#result-rest").text("");
      //display weather results for the origin and destination(locations).
      $("#result-weather").append(dispMessage + "<br>" + dispMessA + "<br>" + dispMessB + "<img src='" +urlIcon+ "'" + ">"  + "<br>" + dispMessC + "<br>" + dispMessD + "<br>" + dispMessE);
      $("#result-rest").append(newAirportDiv);
  
    });
  });
  
  });





























//try ajax calls to see what object returns look like on each of the APIs we will be using


/*var APIKey = "b870cade31afedaa4963a0b60beeb5c2";

var queryURL = "https://api.openweathermap.org/data/2.5/forecast?" +
"q=Houston,us&mode=json&appid=" + APIKey;
     console.log(queryURL)

 $.ajax({
     url: queryURL,
     method: "GET"
     })
     .then(function(response) {
         console.log(response);
     });*/



//yelp api ajax pull
//need to add location vars 
/*
$("#search-btn").on("click", function(event) {
    event.preventDefault();
    console.log("button click working")
var searchTerm = $("#search-btn").attr("value")
console.log (searchTerm)
var yelpAPIKey = "NNn_iZkgwcsoXyb1LwNcwgRAiCL8c3RkazAkRcQueV0e5b0lZNV-SGGIeosL3AiABzN0_PsQasfbyA8BkbNTjHr-RiTH3sKFAPyB8SCmQInth1SBzlW1uhiuBsr5XHYx"

var yelpURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + searchTerm + "&location=boston&limit=10";

$.ajax({
    url: yelpURL,
    headers: {
        'Authorization': 'Bearer ' + yelpAPIKey,
    },
    method: 'GET',
    dataType: 'json',
    success: function (data) {
        console.log('success: ' + data);
    }
}).then(function (response) {
    console.log(response);
});
*/

//just messing around to see if I can succesfully pull the response data into the html successfully
//will have to dynamically create rows with about 10 search results to display the data we want
//each row will have to be a clickable element to take you to that hote's site, or that restaurant on google maps....
//var newDiv = $("<div>");
//var responseImg = $("<img>");

//responseImg.attr({
    //"src": response.businesses[0].image_url,
    //"alias": response.businesses[0].alias,

//})

//newDiv.append(responseImg);

//$(".collapsible").append(newDiv)
});

//link to firebase
/*var config = { 
    apiKey: "AIzaSyAEHiL6iIGeMKpa6X0dKc1F8fv0qXlgks0",
    authDomain: "fir-click-counter-7cdb9.firebaseapp.com",
    databaseURL: "https://travelrush-b1c4f.firebaseio.com/",
    storageBucket: "gs://travelrush-b1c4f.appspot.com"
  };
  
firebase.initializeApp(config);

var database = firebase.database();

//on click event to capture and store values
$("#user-input").on("click", function(event) {
    event.preventDefault();
    console.log("Submit on click event running")

     //store values from form input
     //add var for locationCoord
     var destination = $("#dest-city").val().trim();      
     var departure = moment($("#depart-date").val().trim()).format("L");
     var arrival = moment($("#return-date").val().trim(),).format("L");    
     console.log(destination, departure, arrival); 
     
   // Create local "temporary" object for holding input data
   var searchInput = {
       destination: destination,
       departDate: departure,
       returnDate: arrival,
   };
 console.log(searchInput)

 //upload object to the database
   database.ref().push(searchInput);
})*/

//create on child added function to take snapshot of database objects and display to search History
//Take those search parameters and allow the user to click to add them back to the input fields
//on click of entire row (set row class) display child snapshots in the input fields

//start coding the logic to pull input data and return api results 