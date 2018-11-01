var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/yelp_camp_v2", { useNewUrlParser: true });

//SCHEMA SETUP
var campGroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var CampGround = mongoose.model("CampGround", campGroundSchema);

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    //Get all the campgroudn from the DB
    CampGround.find({}, function (err, allCampGrounds) {
        if (err) console.log(err);
        else {
            res.render("index", { campGrounds: allCampGrounds });
        }
    });
});

app.post("/campgrounds", function (req, res) {
    var newCampGround = { name: req.body.campName, image: req.body.campImage,description : req.body.campDescription };
    CampGround.create(newCampGround, function (err, newlycreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});
app.get("/campgrounds/new", function (req, res){
    res.render("new");
});
//SHOW - Show more info of single campground

app.get("/campgrounds/:id",function(req,res){
    CampGround.findById(req.params.id,function(err,foundCampGround){
        if(err) console.log(err);
        else res.render("show",{campGround:foundCampGround});
    });
});
app.listen(3000, function () {
    console.log("YelpCamp can be seen now.");
});