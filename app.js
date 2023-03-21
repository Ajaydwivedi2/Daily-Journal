require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {

  const blogSchema = ({
    title: {
      type: String,
    },
    content: {
      type: String,
    }

  });

  const Blog = mongoose.model("Blog", blogSchema);

  app.get("/", function (req, res) {

    Blog.find({}).then(function (post) {
      res.render("home", {
        posts: post
      });
    }).catch(function (err) {
      console.log(err);
    });

  });

  app.get("/about", function (req, res) {
    res.render("about", { aboutContent: aboutContent });
  });

  app.get("/contact", function (req, res) {
    res.render("contact", { contactContent: contactContent });
  });

  app.get("/compose", function (req, res) {
    res.render("compose");
  });

  app.post("/compose", function (req, res) {

    const capitalizedTitle = _.capitalize(_.lowerCase(req.body.postTitle));
    const post = new Blog({
      title: capitalizedTitle,
      content: req.body.postBody
    })
    post.save().then(function () {
      res.redirect("/");
    }).catch(function (err) {
      console.log(err);
    });
  });

  app.get("/posts/:postName", function (req, res) {

    const requestedPostId = req.params.postName;
    Blog.findById(requestedPostId).exec().then(function (post) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }).catch(function (err) {
      console.log(err);
    });

  });

  await mongoose.connect(process.env.MONGO_URI).then(function () {
    app.listen(process.env.PORT || 3000, function () {
      console.log("Server is running");
    });
  })
}

