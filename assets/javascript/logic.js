$(document).ready(function(){
    $('select').formSelect();
 
    var min = new Date();
    min.setDate(min.getDate()+5)
 
    var max = new Date();
 
    $(document).ready(function(){
        $('.datepicker').datepicker({
            disableWeekends    : false,
            minDate : new Date(),
            maxDate : min
        });
      });
  });

 

//link to firebase
var config = {
    apiKey: "AIzaSyAEHiL6iIGeMKpa6X0dKc1F8fv0qXlgks0",
    authDomain: "fir-click-counter-7cdb9.firebaseapp.com",
    databaseURL: "https://travelrush-b1c4f.firebaseio.com/",
    storageBucket: "gs://travelrush-b1c4f.appspot.com"
};

firebase.initializeApp(config);

var database = firebase.database();

//Important variables
var coordLoc = {lat: 0, long:0};
var destCity = "";
var departDate = "";
var destAirport = "";
var queryState = "";
var hasChosenAirport= false;  //tracks whether user has chosen an airport.
//var submitCardButtons = false -------not sure if I need this.
var convDateDay;
var convDateNight;

//processes and returns formatted user's travel date.
function processUserDate(tDate, targetTime) {
    //reference to the travel date
    //var dateTime = moment(tDate + " 12:00:00");
    var dateTime = moment(tDate + " " + targetTime);
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

  //add weather data for current row 
  function addWeatherRow(day, imgI, desc, temp, wind, hum) {
    var tdList = [day, desc, temp, wind, hum];
    var newRow = $("<tr>");
    var newElem = $("<td>");
    for (var i = 0; i < tdList.length; i++){
      if (i === 0) {
        newElem.append(imgI, tdList[i]);
        newRow.append(newElem);
        //newRow.append("<td>" + tdList[i] + imgI + "</td>")
      }
      else {
        newRow.append("<td>" + tdList[i] + "</td>");
      }
    }

    $("tbody").append(newRow);
  }

     //creates the table to hold the 5 day weather forecast.
  function createWeatherTable() {
    var tableWeather = $("<table>");
    var head = $("<thead>");
    var rowHeader = $("<tr>");
    var body = $("<tbody>");
    rowHeader.append($("<th>DAY</th>"), $("<th>DESCRIPTION</th>"), $("<th>TEMPERATURE</th>"), $("<th>WIND</th>"), $("<th>HUMIDITY</th>") );
    head.append(rowHeader);
    tableWeather.append(head, body);
    $("#weather-results").append(tableWeather);
  }

  //click event that displays airport options.
  $("#user-city").on("click", function(event) {
    console.log("inside event click to display airports");
    event.preventDefault();
    
    //clear the previous airport list when user requests airport options.
    $(".all-airports").remove();
    console.log($("#dest-city").val());
    destCity = $("#dest-city").val(); //assume user's destination is by city and state.
    //processing and extracting strings to use for queryParameters
    var indexComma = destCity.indexOf(",");
    var initQueryCity = destCity.substring(0, indexComma); 
    var queryCity = initQueryCity.replace(" ", "+");
    queryState = destCity.substring(indexComma + 2);
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
      console.log("Coordinates for the input city: " + "Latitude = " + coordLoc.lat + " Longitude = " + coordLoc.long);

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
      console.log("airportFinder" + response);
      var newOpt;

      for (var i = 0; i < response.length; i++) {
        //console.log("I am inside the for loop....");

        newOpt = $("<option>");
        newOpt.text(response[i].city + ", " + queryState  + " (" + response[i].name + "-" + response[i].code + ")");
        newOpt.addClass("all-airports");
        newOpt.attr("value", response[i].name);
        newOpt.attr("data-city", response[i].city);
        newOpt.attr("data-lat", response[i].location.latitude);
        newOpt.attr("data-long", response[i].location.longitude);
        console.log(response[i].city + ", " + queryState  + " (" + response[i].name + "-" + response[i].code + ")");
        //newAirportOpt.append(newOpt);
       //  $("#airport-list").text("");
        //$("#airport-list").append(newAirportOpt);
        $("#airport-list").append(newOpt);
      }
      //separate call for dynamically generated select elements--- Materialize docs
      $('#airport-list').formSelect();
      //show input form when user clicks on airport
      $(".select-wrapper").show()

    })
    })
  })

//change event retrieves and updates the coordinates for the selected airport.
$("#airport-list").change(function(){
    console.log("I made it to the airport handler");
    console.log("This option was selected: " + $(this).children(":selected").html());
    var targetOption = $(this).children(":selected");
    //user has selected an airport, so update flag for whether user selected an airport
    hasChosenAirport = true;
    //update coordinates and airport city for the chosen airport 
    coordLoc.lat = targetOption.attr("data-lat");
    coordLoc.long =  targetOption.attr("data-long");
    destAirport = targetOption.attr("data-city");
    console.log("Airport user selected is " + targetOption.attr("value"));
    console.log("Coordinates for the airport: " + "Latitude = " + coordLoc.lat + " Longitude = " + coordLoc.long);
  });

//function to run api call for the term parameter passed through on the on click even of user-input
function callAPI(term) {
    var yelpAPIKey = "NNn_iZkgwcsoXyb1LwNcwgRAiCL8c3RkazAkRcQueV0e5b0lZNV-SGGIeosL3AiABzN0_PsQasfbyA8BkbNTjHr-RiTH3sKFAPyB8SCmQInth1SBzlW1uhiuBsr5XHYx"

    return $.ajax({
        url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&latitude=` + coordLoc.lat + "&longitude=" + coordLoc.long + "&limit=10",
        headers: {
            'Authorization': 'Bearer ' + yelpAPIKey,
        },
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log('success: ' + data);
            console.log("Yelp URL:" + this.url)
        }
        
    })
    
}

//need to add location vars once pulled from search input 
//on click event to capture and store values and run ajax queries
$("#user-input").on("click", function (event) {
    event.preventDefault();
    
    
    if (($("#dest-city").val().trim().length === 0)  || ($("#depart-date").val().trim().length === 0) || hasChosenAirport === false) {
      console.log("exiting the click event to prevent user from submitting incorrect form.");
      return;
    }
    // Add loading icon
    $("#all").hide()
    $('.progress').show();
    
    console.log("Submit on click event running");
    //store values from form input
    //add var for locationCoord
    var coord = coordLoc;
    var destination = $("#dest-city").val().trim();
    var departure = moment($("#depart-date").val().trim()).format("L");
    var arrival = moment($("#return-date").val().trim()).format("L");
    console.log(destination, departure, arrival);

    // Create local "temporary" object for holding input data
    var searchInput = {
        coordinates: coord,
        destination: destination,
        departDate: departure,
        returnDate: arrival,
    };
    console.log("Search Input" + searchInput)

    //upload object to the database
    database.ref().push(searchInput);

    //pull object and display as drop down in destination
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());
     
        var destination = childSnapshot.val().destination;
        var departure = childSnapshot.val().departDate;
        var arrival = childSnapshot.val().returnDate
     
        $("#dropdown1 > ul").append("<ul><li>" + destination + "</li></ul>");
     });

     console.log('code is running')
    

     //creating variables to store term for each call that will be run through the callAPI function
     var call1 = callAPI('hotels')
     var call2 = callAPI('restaurants')
     var call3 = callAPI('coffee')
 
     $.when(call1, call2, call3).done(function (v1, v2, v3) {
         // Remove loading thing
         $('.progress').hide();
         $("#all").show()
 
         console.log('v1', v1);
         console.log('v2', v2);
         console.log('v3', v3);
 
     //storing 0 index of all responses in an obejct to display. There should be an easier way to do this for all three in one function. Will look into if time allows. 
     var hotelsInfo = {
         name: v1[0].businesses[0].name,
         image: v1[0].businesses[0].image_url,
         url: v1[0].businesses[0].url,
         price: v1[0].businesses[0].price,
         rating: v1[0].businesses[0].rating,
         title: v1[0].businesses[0].categories[0].title,
               }
               console.log(hotelsInfo)
              
               $("#hotel-name").text(hotelsInfo.name)
               $("#hotel-img").attr("src", hotelsInfo.image)
               $("#hotel-title").text(hotelsInfo.title)  
               $("#hotel-rating").text("Rating: " + hotelsInfo.rating)
               $("#hotel-price").text(hotelsInfo.price)
               $("#hotel-url").attr("href", hotelsInfo.url)
 
     var restaurantsInfo = {
         name: v2[0].businesses[0].name,
         image: v2[0].businesses[0].image_url,
         url: v2[0].businesses[0].url,
         price: v2[0].businesses[0].price,
         rating: v2[0].businesses[0].rating,
         title: v2[0].businesses[0].categories[0].title,
               }
               console.log(restaurantsInfo)
               $("#restaurant-name").text(restaurantsInfo.name)
               $("#restaurant-img").attr("src", restaurantsInfo.image)
               $("#restaurant-title").text(restaurantsInfo.title)
               $("#restaurant-rating").text("Rating: " + restaurantsInfo.rating)
               $("#restaurant-price").text(restaurantsInfo.price)
               $("#restaurant-url").attr("href", restaurantsInfo.url)
 
     var coffeeInfo = {
         name: v3[0].businesses[0].name,
         image: v3[0].businesses[0].image_url,
         url: v3[0].businesses[0].url,
         price: v3[0].businesses[0].price,
         rating: v3[0].businesses[0].rating,
         title: v3[0].businesses[0].categories[0].title,
               }
               console.log(coffeeInfo)
 
               //display coffee info for zero index of results array
                 $("#coffee-name").text(coffeeInfo.name)
                 $("#coffee-img").attr("src", coffeeInfo.image)
                 $("#coffee-title").text(coffeeInfo.title)
                 $("#coffee-rating").text("Rating: " + coffeeInfo.rating)
                 $("#coffee-price").text(coffeeInfo.price)
                 $("#coffee-url").attr("href", coffeeInfo.url)
     });
 
     $(".search-btn").on("click", function displayResults() {
         event.preventDefault();
         console.log("button click working")
         var searchTerm = $(this).attr("value")
         console.log(searchTerm);
 
         $.when(call1, call2, call3).done(function (y1, y2, y3) {
             
 
         if (searchTerm=="coffee") {
             console.log("y3", y3)
             //clear div in order to display new card
             $("#coffee-card").html("")
 
             //create new div to display new card
             var newDiv= $("<div>");
             newDiv.addClass("collection");
 
             //append new div to original card place holder
             $("#coffee-card").append(newDiv)
             
             for (i=1; i<y3[0].businesses.length; i++) {
                 
                  //create var to store distance converted to miles
                 var getMiles =  Math.round ((y3[0].businesses[i].distance*0.000621371192)*10)/10;
                 console.log(getMiles)
                 //create new row with remaining results info to then append to new card div
                 var newLine = $("<a>")
                 newLine.addClass("collection-item")
                 $(newLine).attr("href", y3[0].businesses[i].url)
                 $(newLine).attr("target", "_blank")
                 newLine.text(y3[0].businesses[i].name + " | " + "Price: " + y3[0].businesses[i].price + " | " + getMiles + " miles away")
                 $(newDiv).append(newLine)
             }
 
         } else if (searchTerm=="hotels") {
             $("#hotels-card").html("")
 
             //create new div to display new card
             var newDiv= $("<div>");
             newDiv.addClass("collection");
 
             //append new div to original card place holder
             $("#hotels-card").append(newDiv)
             
             for (i=1; i<y1[0].businesses.length; i++) {
                  //create var to store distance converted to miles
                  var getMiles =  Math.round ((y1[0].businesses[i].distance*0.000621371192)*10)/10;
                  console.log(getMiles)
 
                 //create new row with remaining results info to then append to new card div
                 var newLine = $("<a>")
                 newLine.addClass("collection-item")
                 $(newLine).attr("href", y1[0].businesses[i].url)
                 $(newLine).attr("target", "_blank")
                 newLine.text(y1[0].businesses[i].name + " | " + "Price: " + y1[0].businesses[i].price + " | " + getMiles + " miles away")
                 $(newDiv).append(newLine)
             }
 
         } else if (searchTerm=="restaurants") {
             $("#restaurants-card").html("")
 
             //create new div to display new card
             var newDiv= $("<div>");
             newDiv.addClass("collection");
 
             //append new div to original card place holder
             $("#restaurants-card").append(newDiv)
             
             for (i=1; i<y2[0].businesses.length; i++) {
                 //create var to store distance converted to miles
                 var getMiles =  Math.round ((y2[0].businesses[i].distance*0.000621371192)*10)/10;
                 console.log(getMiles)
 
                //create new row with remaining results info to then append to new card div 
                 var newLine = $("<a>")
                 newLine.addClass("collection-item")
                 $(newLine).attr("href", y2[0].businesses[i].url)
                 $(newLine).attr("target", "_blank")
                 newLine.text(y2[0].businesses[i].name + " | " + "Price: " + y2[0].businesses[i].price + " | " + getMiles + " miles away")
                 $(newDiv).append(newLine)
             }
         }
      
 
 
 
         });
     });
     
     
 
  
    //remove text and elements inside weather result div.
    $("#weather-results").empty();
    //create title and image for the weather forecast
    //$("#weather-results").append("<p>" + destAirport + "," + queryState + " Weather On Travel Date" + "</p><br>");
    $("#weather-img").attr("src", "./assets/images/tim-gouw-208299-unsplash.jpg");
    $("#weather-name").text(destAirport + "," + queryState + " Weather On Travel Date");
    //dynamically create layout of the table.
    createWeatherTable();
    departDate = $("#depart-date").val();
    console.log("The main submit button worked.......");
    console.log("Coordinates for the airport: " + "Latitude = " + coordLoc.lat + " Longitude = " + coordLoc.long);
    //console.log("The latitude for the airport is :" + coordLoc.lat); 
    //console.log("The longitude for the airport is :" + coordLoc.long); 
    //OpenWeatherMap API ================================================================
    //API provides weather data for the destination using coordinates obtained from Geocoding API.
    // Dupe's API key.
    var weatherAPIKey = "61fb0fbf5b4af7a73cbae239fe1b3fbf";

    //*query parameters are coordLoc.lat and coordLoc.long; see queryURL.
    //qphrase = destAiport;

    // Here we are building the URL we need to query the openweathermap API
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + coordLoc.lat + "&lon=" + coordLoc.long + "&units=imperial&mode=json&appid=" +  weatherAPIKey;
    //var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + qPhrase + ",us&units=imperial&mode=json&appid=" +  weatherAPIKey;
    /*http://samples.openweathermap.org/data/2.5/find?q=London&units=imperial&appid=b6907d289e10d714a6e88b30761fae22
    add "&units=imperial" to get the units in F and mph.
    */
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
        convDateDay = processUserDate(departDate, "12:00");
        convDateNight = processUserDate(departDate, "21:00");
        //Get the indices of the target weather times for each day.
        var indicesWeather = [];
        for (var i = 0; i < listWeather.length; i++) {
            console.log(listWeather[i].dt_txt);
            console.log("The time in API is : " + listWeather[i].dt_txt);
            console.log("The target day time is: " + convDateDay);
            console.log("The target night time is: " + convDateNight);
            if (listWeather[i].dt_txt === convDateDay || listWeather[i].dt_txt === convDateNight) {
                console.log("found it!");
                indicesWeather.push(i);
                if (indicesWeather.length === 2) {
                    //exit loop if we have enough indices for weather forecast on travel date.
                    break
                }
            }
        }

        //==========================================================
        //var monthDay = moment(convDepartDate).format("ddd MMM D");
        //add title to temperature cards

        for (var j = 0; j < indicesWeather.length; j++) {
            var urlIcon = "http://openweathermap.org/img/w/" + listWeather[indicesWeather[j]].weather[0].icon + ".png";
            //dynamically create reference for url image
            var imgIcon = $("<img></img>");
            imgIcon.attr("src", urlIcon);

            var monthDay = moment(listWeather[indicesWeather[j]].dt_txt).format("ddd MMM D");
            var time = moment(listWeather[indicesWeather[j]].dt_txt).format("h:mm A")

            console.log(monthDay);
            var rDay =  monthDay + " " + time  ;
            var rDesc = listWeather[indicesWeather[j]].weather[0].description;
            var rTemp = Math.round(listWeather[indicesWeather[j]].main.temp) + "&#8457"
            var rWind = Math.round(listWeather[indicesWeather[j]].wind.speed) + " mph";
            var rHum = listWeather[indicesWeather[j]].main.humidity + "%";
            //track weather data in the console.
            console.log(rDay);
            console.log(rDesc);
            console.log(rTemp);
            console.log(rWind);;
            console.log(rHum);
            //dynamically create 3 day weather forecast with json data
            addWeatherRow(rDay, imgIcon, rDesc, rTemp, rWind, rHum);
        }

    })

 
 }) // end of function 

//click event to display 5 day weather forecast.
$("#more-weather").on("click", function(event) {
    //remove text and elements inside weather result div.
    $("#weather-results").empty();
    //create title and image for the weather forecast
    //$("#weather-results").append("<p>" + destAirport + "," + queryState + " 3-Day Weather forecast" + "</p><br>");
    $("#weather-img").attr("src", "./assets/images/tim-gouw-208299-unsplash.jpg");
    $("#weather-name").text(destAirport + "," + queryState + " 3-Day Weather Forecast");
    //dynamically create layout of the table.
    createWeatherTable();
    //make ajax call to the weather api and then populate the table.
    var weatherAPIKey = "61fb0fbf5b4af7a73cbae239fe1b3fbf";

    //*query parameters are coordLoc.lat and coordLoc.long; see queryURL.

    // Here we are building the URL we need to query the openweathermap API
    //var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + qPhrase + ",us&mode=json&appid=" + APIKey;
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + coordLoc.lat + "&lon=" + coordLoc.long + "&units=imperial" + "&mode=json&appid=" +  weatherAPIKey;
    /*http://samples.openweathermap.org/data/2.5/find?q=London&units=imperial&appid=b6907d289e10d714a6e88b30761fae22
    add "&units=imperial" to get the units in F and mph.
    */
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
      //console.log("Departure date is " + departDate);
      //console.log("Departure date is of type " + typeof(departDate));
      //reference to the travel date
      //convDepartDate = processUserDate(departDate);
      //Get the indices of the target weather times for each day.
      var indicesWeather = [];
      for (var i = 0; i < listWeather.length; i++) {
        console.log(listWeather[i].dt_txt);
        if (listWeather[i].dt_txt.includes("12:00")||listWeather[i].dt_txt.includes("21:00")) {
          console.log("found it!");
          indicesWeather.push(i);
          if (indicesWeather.length === 6) {
            //exit loop if we have enough indices for 3 day weather forecast.
            break
          }
        }
      }

      //==========================================================
      //var monthDay = moment(convDepartDate).format("ddd MMM D");
      for (var j = 0; j < indicesWeather.length; j++) {
        var urlIcon = "http://openweathermap.org/img/w/" + listWeather[indicesWeather[j]].weather[0].icon + ".png";
        //dynamically create reference for url image
        var imgIcon = $("<img></img>");
        imgIcon.attr("src", urlIcon);

        var monthDay = moment(listWeather[indicesWeather[j]].dt_txt).format("ddd MMM D");
        var time = moment(listWeather[indicesWeather[j]].dt_txt).format("h:mm A")

        console.log(monthDay);
        var rDay =  monthDay + "    " + time  ;
        var rDesc = listWeather[indicesWeather[j]].weather[0].description;
        var rTemp = Math.round(listWeather[indicesWeather[j]].main.temp) + "&#8457"
        var rWind = Math.round(listWeather[indicesWeather[j]].wind.speed) + " mph";
        var rHum = listWeather[indicesWeather[j]].main.humidity + "%";
        //track weather data in the console.
        console.log(rDay);
        console.log(rDesc);
        console.log(rTemp);
        console.log(rWind);;
        console.log(rHum);
        //dynamically create 3 day weather forecast with json data
        addWeatherRow(rDay, imgIcon, rDesc, rTemp, rWind, rHum);
      }

    })


}) // end of function 


   








//$(document).on("click", ".search-btn", displayResults);


//create on child added function to take snapshot of database objects and display to search History
//Take those search parameters and allow the user to click to add them back to the input fields
//on click of entire row (set row class) display child snapshots in the input fields

//start coding the logic to pull input data and return api results 