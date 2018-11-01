var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true }));
app.use(express.static("public"));

var campGround = [
    { name : "Salman Creak", image : "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104496f8c47ca2e9b7b8_340.jpg"},
    { name : "Granie Hill", image : "https://farm7.staticflickr.com/6014/6015893151_044a2af184.jpg"},
    { name : "Mountain Goat's Rest", image : "https://farm3.staticflickr.com/2924/14465824873_026aa469d7.jpg"}    
];

app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){
    res.render("campgrounds",{campGrounds : campGround});
});

app.post("/campgrounds",function(req,res){
    var newCampGround = { name : req.body.campName, image : req.body.campImage };
    campGround.push(newCampGround);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new",function(req,res){
    res.render("new");
});
 app.listen(3000,function(){
    console.log("YelpCamp can be seen now.");
 });