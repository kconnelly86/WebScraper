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

var path  = require('path')

var PORT = process.env.PORT || 3000;
//initialize express
var app = express();
//database
var mongoose = require("mongoose");


// Use morgan logger for logging requests
//app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// this creates the DB have to have this.
// Set mongoose to leverage built in JavaScript ES6 Promises

//heroku
var databaseUri = 'mongodb://localhost/WebScraper';
//var testURI = "mongodb://heroku_3xjhh7w0:sktb46iu0rfom7fhka8j4pcebe@ds133136.mlab.com:33136/heroku_3xjhh7w0";
if(process.env.MONGODB_URI){
  mongoose.connect(process.env.MONGO_URI, function(err, testo) {
    if (err) {
      console.log("doesnt work");
    }
  });
}else{
  console.log("connection success to heroku db");
  mongoose.connect(databaseUri);
}

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

	 		var myStuff = {};
       myStuff.title = element.children[0].data;
       myStuff.link = element.attribs.href;


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

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, "./public/index.html"));
})


// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article
    .find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
      
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
	console.log(req.params.id)
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    // .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});




app.listen(PORT, function() {
	console.log('Example app listening on port ' + PORT + '!')
})