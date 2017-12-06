// Grab the articles as a json
$.getJSON("/articles", function(data) {
	// console.log(data);
  // For each one
  for (var i = 0; i < data.length; i++) {

    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br><a href='" + data[i].link + "' target='_blank'>" + data[i].link + "</a></p>");
  }
});

// // Whenever someone clicks a p tag
// $(document).on("click", "p", function() {
//   // Empty the articles from the note section
//   // $("#articles").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   }).done(function(data) { // With that done, add the note information to the page
//       console.log(data);
//       // The title of the article
//       $("#articles").append("<h2>" + data.title + "</h2>");
//       // An input to enter a new title
//       $("#articles").append("<input id='titleinput' name='title' >");
//       // A textarea to add a new note body
//       $("#articles").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to submit a new note, with the id of the article saved to it
//       $("#articles").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//       // If there's a note in the article
//       if (data.note) {
//         // Place the title of the note in the title input
//         $("#titleinput").val(data.note.title);
//         // Place the body of the note in the body textarea
//         $("#bodyinput").val(data.note.body);
//       }
//     });
// });