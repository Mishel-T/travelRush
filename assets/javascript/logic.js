console.log("program is running");
  //user enters and submits origin and destination location and dates==================================================================
  //reference to the travel date
  //var checkTime = moment("2019-06-11 12:00:00");
  
  //initialize select element-----Materialize docs 
  $(document).ready(function(){
    $('select').formSelect();
  });
  
  //Important variables
  var coordLoc = {lat: 0, long:0};
  var destCity = "";
  var departDate = "";
  var destAirport = "";
  //var queryCity = "";
  var queryState = "";
  var convDateDay;
  var convDateNight;
  
  //processes and returns formatted user's travel date.
  function processUserDate(tDate, targetTime) {
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
  
  /*
  function dispAirports(airportsList) {
    var indAirport = 0;
    for (var i = 0; i < airportsList.length; i++) {
      // create a paragraph for each airport
      var newPar = $("<p>");
      newPar
    }
  
  }*/

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
      console.log(response);
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
    })
    })
  })

  
  
  //change event retrieves and updates the coordinates for the selected airport.
  $("#airport-list").change(function(){
    console.log("I made it to the airport handler");
    console.log($(this).children(":selected").html());
    var targetOption = $(this).children(":selected");
    //update coordinates and airport city for the chosen airport 
    coordLoc.lat = targetOption.attr("data-lat");
    coordLoc.long =  targetOption.attr("data-long");
    destAirport = targetOption.attr("data-city");
    console.log("Airport user selected is " + targetOption.attr("value"));
    console.log("Coordinates for the airport: " + "Latitude = " + coordLoc.lat + " Longitude = " + coordLoc.long);
  });

  //click event for weather forecast
  $("#user-input").on("click", function(event) {
    event.preventDefault();
    //remove text and elements inside weather result div.
    $("#weather-results").empty();
    //create title for the weather forecast
    $("#weather-results").append("<p>" + destAirport + "," + queryState + " Weather On Travel Date" + "</p><br>");
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
        if (listWeather[i].dt_txt === convDateDay ||listWeather[i].dt_txt === convDateNight) {
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
  })
  

//click event to display 5 day weather forecast.
$("#more-weather").on("click", function(event) {
    //remove text and elements inside weather result div.
    $("#weather-results").empty();
    //create title for the weather forecast
    $("#weather-results").append("<p>" + destAirport + "," + queryState + " 3-Day Weather forecast" + "</p><br>");
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

    
})

  
/*
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
  convDepartDate = processUserDate(departDate);
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
  var dispMessage = "Weather conditions at 12 noon in " + destAirport + ", " + queryState + " on your travel Date:";
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
  //remove text and elements inside weather result div.
  $("#weather-results").empty();
  //$("#weather-results").text("");
  
  //display weather results for the origin and destination(locations).
  $("#weather-results").append(dispMessage + "<br>" + dispMessA + "<br>" + dispMessB + "<img src='" +urlIcon+ "'" + ">"  + "<br>" + dispMessC + "<br>" + dispMessD + "<br>" + dispMessE);

*/



























