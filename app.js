//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const multer = require ("multer");
const storage = multer.diskStorage({
    destination : function(req, res, cb){
      cb(null, "./uploads/");
    },
    filename : function (req, file, cb){
      cb(null, new Date().toISOString()+ file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
    cb(null, true);
  }else{
    cb(null, false);
  }
};


const upload = multer({
    storage: storage,
    limits:{
    fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
 });
mongoose.connect('mongodb://localhost:27017/postDB', {
  useNewUrlParser: true
});

mongoose.set('useFindAndModify', false);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const post = [];
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String
});

const Post = mongoose.model("Post", postSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));


app.get("/", function(req, res) {

  Post.find({}, function(err, foundPost) {
  //  console.log(foundPost);
      if (!err){
        res.render("home", {
        homeStartingContent: homeStartingContent,
        postData: foundPost
      });
      }
  });

});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });

});
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });

});
app.get("/compose", function(req, res) {
  res.render("compose");

});
app.post("/compose", upload.single("postImage"), function(req, res, next) {
  console.log(req.file.path);
  const postData = new Post({
    title: req.body.postTitle,
    content: req.body.postText,
    image: req.file.path
  });
  //
  //
  // const postContent = {
  //   title:
  //   text:
  // }
  // post.push(postContent);
  postData.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });

});

app.get("/posts/:pageID/", function(req, res) {

  //const titleCheck = _.lowerCase(req.params.pageID);

  const pageLink = req.params.pageID;

Post.findById(pageLink, function(err, found){
  res.render("post", {
    currPostTitle: found.title,
    currPostText: found.content
  });
});

  //

  // post.forEach(function(eachPost) {
  //   const recievedData = _.lowerCase(eachPost.title);
  //   if (titleCheck === recievedData) {
  //     res.render("post", {
  //       currPostTitle: eachPost.title,
  //       currPostText: eachPost.text
  //     });
  //
  //   }
  //
  // });



});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
