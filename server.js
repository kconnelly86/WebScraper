//web app framework
var express = require('express');
//initialize express
var app = express();
//request is the http request 
var request = require('request');
//the scraper
var cheerio = require('cheerio');
//require all models
var db = require("./models");

var PORT = 3000;
//initialize express
var app = express();

// var myObject = {myKey: "my value"};
// myObject.myKey = "my value";

// {title: "the fat woman ate pie"}


// a get route for scraping fox news
app.get('/scrape', function (req, res) {
	//console.log(res);
// grabs the body of the html with request
request('http://www.foxnews.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  //console.log(response);
 var $ = cheerio.load(body);
 // console.log(body);
 $("h2.title a").each(function(i, element) {

 		console.log(element.children[0].data);
 		var myStuff = {};
 		myStuff.title = element.children[0].data;

 		// Create a new Article using the `result` object built from scraping
      db.Article
        .create(myStuff)
        
        .then(function(dbArticle) {
          // If we were able to successfully scrape and save an Article, send a message to the client
          res.send("Scrape Complete");
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });

 		


      // Save an empty result object
      // var myTitles = {};

      // // Add the text and href of every link, and save them as properties of the result object
      // myTitles.title = $(this)
      //   .children("a")
      //   .text();
      // myTitles.link = $(this)
      //   .children("a")
      //   .attr("href");

      // // Create a new Article using the `result` object built from scraping
      // db.Article
      //   .create(myTitles)
      //   .then(function(dbArticle) {
      //     // If we were able to successfully scrape and save an Article, send a message to the client
      //     res.send("Scrape Complete");
      //   })
      //   .catch(function(err) {
      //     // If an error occurred, send it to the client
      //     res.json(err);
      //   });
    });
 
// var myTitles = $('h2.title').text();
// console.log("_____________________________");
// console.log(myTitles);
// console.log("_____________________________");



  // Print the response status code if a response was received
  //console.log('statusCode:', response && response.statusCode); 
  //console.log('body:', body); // Print the HTML for the Google homepage.
 res.send("Scrape complete"); //witout this the page wont load in the browser
});

})
//function (req, res) {}


app.listen(PORT, function() {
	console.log('Example app listening on port ' + PORT + '!')
})