//try ajax calls to see what object returns look like on each of the APIs we will be using
// var searchTerms = ["Los Angeles, CA", "Seattle, WA"]

// var APIKey = "b870cade31afedaa4963a0b60beeb5c2";

// var queryURL = "https://api.openweathermap.org/data/2.5/forecast?" +
//       "q=London,us&mode=xml&appid=" + APIKey;
//       console.log(queryURL)

// $.ajax({
//     url: queryURL,
//     method: "GET"
//     })
//     .then(function(response) {
//         console.log(response);
//     });



//yelp api ajax pull
var yelpAPIKey = "NNn_iZkgwcsoXyb1LwNcwgRAiCL8c3RkazAkRcQueV0e5b0lZNV-SGGIeosL3AiABzN0_PsQasfbyA8BkbNTjHr-RiTH3sKFAPyB8SCmQInth1SBzlW1uhiuBsr5XHYx"

var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=hotels&location=boston&limit=10";

$.ajax({
    url: myurl,
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
var config = { 
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
    console.log("on click event running")

     //store values from form input
     var origin = $("#origin-airport").val().trim();      
     var destination = $("#dest-airport").val().trim();      
     var departure = moment($("#depart-date").val().trim()).format("L");
     var arrival = moment($("#return-date").val().trim(),).format("L");    
     console.log(origin, destination, departure, arrival); 
     
   // Create local "temporary" object for holding input data
   var searchInput = {
       origin: origin,
       destination: destination,
       departDate: departure,
       returnDate: arrival,
   };
 console.log(searchInput)

 //upload object to the database
   database.ref().push(searchInput);
})

//create on child added function to take snapshot of database objects and display to search History
//Take those search parameters and allow the user to click to add them back to the input fields
//on click of entire row (set row class) display child snapshots in the input fields

//start coding the logic to pull input data and return api results 