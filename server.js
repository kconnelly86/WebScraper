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
//database
var mongoose = require("mongoose");

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/Article", {
  useMongoClient: true
});

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
	 		console.log(myStuff);
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
            });// end catch
            // res.send("Scrape Complete");
        });//ends .each function  
	});//end request
});// end app .get


// / Route for getting all Articles from the db
// app.get("/articles", function(req, res) {
//   // Grab every document in the Articles collection
//   db.Article
//     .find({})
//     .then(function(dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       res.json(dbArticle);

//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });




app.listen(PORT, function() {
	console.log('Example app listening on port ' + PORT + '!')
})