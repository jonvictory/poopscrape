// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
const exphbs = require("express-handlebars");

// Establish our Database for Mongoose
const db = require("./models");

// Establish our Port
const PORT = process.env.PORT || 6969;

// Initialize Express
const app = express();

// Parse Requests as JSON Data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Declare our Public Folder
app.use(express.static("./public"));

// Set-up Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to our Database via Mongoose
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/pluck_db";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// GET route for app
app.get("/", function(req, res) {
  db.Article.find({})
    .sort({ dateCreated: 1 })
    .then(function(result) {
      let hbsObj = {
        articles: result
      };

      res.render("index", hbsObj);
    })
    .catch(function(err) {
      console.log(err);
    });
});

// GET route for website scrape
app.get("/scrape", function(req, res) {
  axios.get("https://theblogaboutnothing.blog/page/3/").then(function(response) {
    let $ = cheerio.load(response.data);
    // console.log(response.data + "fuck yourself")
    let articles = $(".content-wrapper");

    $(articles).each(function(i, element) {
      // Scrape Required Information
      let result = {};

      result.title = $(this)
        .find(".entry-title")
        .text();

        result.summary = $(this)
        .find(".entry-content")
        .find("p")
        .text().split('.')[0];
        

      result.articleURL = $(this)
        .find(".entry-title")
        .find("a")
        .attr("href");

      // Create Article for Database
      db.Article.create(result).catch(function(err) {
        console.log(err);
      });
    });

    res.send("scraped-duh");
  });
});

// GET route for comments
app.get("/comments/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("comments")
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      console.log(err);
    });
});

// POST route for comments
app.post("/comments/:id", function(req, res) {
  db.Comment.create(req.body)
    .then(function(data) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comments: data._id } },
        { new: true }
      );
    })
    .then(function(response) {
      res.json(response);
    })
    .catch(function(err) {
      console.log(err);
    });
});

// DELETE route for deleting comments
app.delete("/comments/:id", function(req, res) {
  db.Comment.deleteOne({ _id: req.params.id }).catch(function(err) {
    console.log(err);
  });

  db.Article.findOneAndUpdate(
    { comments: req.params.id },
    { $pull: { comments: req.params.id } }
  ).catch(function(err) {
    console.log(err);
  });
});

// Listener for PORT
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
