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

//         // Log the queryURL
//         console.log(response);

//     });




var yelpAPIKey = "NNn_iZkgwcsoXyb1LwNcwgRAiCL8c3RkazAkRcQueV0e5b0lZNV-SGGIeosL3AiABzN0_PsQasfbyA8BkbNTjHr-RiTH3sKFAPyB8SCmQInth1SBzlW1uhiuBsr5XHYx"

//var yelpQueryURL = `https://api.yelp.com/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972`;

// $.ajax({
//     url: yelpQueryURL,
//     headers: {
//         "Authorization": `Bearer ${yelpAPIKey}`,
//         "cache-control": "no-cache",
//         "Access-Control-Allow-Origin": "*",
//     },
//     dataType: 'jsonp',
//     method: "GET",
//     error: function (error) {
//         console.log(error);

//     }
// })
//     .then(function (response) {

//         // Log the queryURL
//         console.log(response);

//     });

var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=restaurants&location=boston";

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

});



//link to firebase

//start coding the logic to pull input data and return api results 