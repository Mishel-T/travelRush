//on submit 
    //store values in firebase - working
    //run api queries for each of the search terms - working
    //take index of 0 results for each term and push to existing card
    //store reamining results,index 1-10, in objects to pull later
//on button click for each card 
    //clear card div
    //create new basic div for table of results
    //run api pull again?? have to figure out how to store data from original api search - if successfully stored
    //display those results objects in each card 
    //pull index 1-3 (or more as necessary) of each search term result and display in table format
    //make each additional search result clickable to be taken to that results url 



//OpenWeather API ajax call working, Dupe working on 
//var APIKey = "b870cade31afedaa4963a0b60beeb5c2";

//var queryURL = "https://api.openweathermap.org/data/2.5/forecast?" +
//"q=Houston,us&mode=json&appid=" + APIKey;
//     console.log(queryURL)

 //$.ajax({
   //  url: queryURL,
   //  method: "GET"
   //  })
   //  .then(function(response) {
   //      console.log(response);
   //  });

//link to firebase
var config = { 
    apiKey: "AIzaSyAEHiL6iIGeMKpa6X0dKc1F8fv0qXlgks0",
    authDomain: "fir-click-counter-7cdb9.firebaseapp.com",
    databaseURL: "https://travelrush-b1c4f.firebaseio.com/",
    storageBucket: "gs://travelrush-b1c4f.appspot.com"
  };
  
firebase.initializeApp(config);

var database = firebase.database();



//need to add location vars once pulled from search input 
//on click event to capture and store values and run ajax queries
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

  //pull object and display to History - still to be coded
   
var searchTerm = ["hotels", "restaurants","coffee"];
   for (var i=0; i<searchTerm.length; i++) {
       console.log(searchTerm[i])

    var currentTerm=searchTerm[i];

       
   var yelpAPIKey = "NNn_iZkgwcsoXyb1LwNcwgRAiCL8c3RkazAkRcQueV0e5b0lZNV-SGGIeosL3AiABzN0_PsQasfbyA8BkbNTjHr-RiTH3sKFAPyB8SCmQInth1SBzlW1uhiuBsr5XHYx"

   var yelpURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + searchTerm[i] + "&location=boston&limit=10";

   //yelp ajax call for each search term 
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
       
    //store 0 index search results parameters in variables to then push to each card
    var businessInfo = {
        name:response.businesses[0].name, 
        image: response.businesses[0].image_url,
        url: response.businesses[0].url,
        price: response.businesses[0].price,
        rating:response.businesses[0].rating, 
        title: response.businesses[0].categories[0].title,
        }
console.log(businessInfo)  

console.log(currentTerm)
//take the search term response and display info to card - currently only working for coffee, if I run this outside of the for loop,
//it can't find businessInfo object
    if (currentTerm==="coffee") {
        console.log("if statement working")

        $("#coffee-name").text(businessInfo.name)
        $("#coffee-img").attr("src", businessInfo.image)
        $("#coffee-title").text(businessInfo.title)

        var coffeeRating = $("<p>")
        coffeeRating.attr("id", "coffee-rating")
        $("#coffee-rating").text("Rating: " + businessInfo.rating)
        $("#coffee-info").append(coffeeRating)

        var coffeePrice = $("<p>")
        coffeePrice.attr("id", "coffee-price")
        $("#coffee-price").text(businessInfo.price)
        $("#coffee-info").append(coffeePrice)

        $("#coffee-url").attr("href", businessInfo.url)
        
            } 


   
    });
 
    
 
 
//push 0 index of each result to card - to do that, store all parameters in variables after ajax call
}
})

  
    

//function for displaying additional response parameters after initial load
function displayResults() {
    event.preventDefault();
    console.log("button click working")
    var searchTerm = $(this).attr("value")
    console.log (searchTerm);
   

//display response parameters to basic card in a table format

};


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




$(document).on("click", ".search-btn", displayResults);


//create on child added function to take snapshot of database objects and display to search History
//Take those search parameters and allow the user to click to add them back to the input fields
//on click of entire row (set row class) display child snapshots in the input fields

//start coding the logic to pull input data and return api results 