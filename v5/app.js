var express = require('express'), 
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    CampGround = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDb = require("./seeds");

seedDb();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+"/public"));
mongoose.connect("mongodb://localhost/yelp_camp_v5", { useNewUrlParser: true });

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    //Get all the campgroudn from the DB
    CampGround.find({}, function (err, allCampGrounds) {
        if (err) console.log(err);
        else {
            res.render("campgrounds/index", { campGrounds: allCampGrounds });
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
    res.render("campgrounds/new");
});
//SHOW - Show more info of single campground

app.get("/campgrounds/:id",function(req,res){
    CampGround.findById(req.params.id).populate("comments").exec(function(err,foundCampGround){
        if(err) console.log(err);
        else {
            res.render("campgrounds/show",{ campGround : foundCampGround });
        }
    });
});

//======================================
//COMMENTS ROUTES
//======================================

app.get("/campgrounds/:id/comments/new",function(req,res){
    CampGround.findById(req.params.id,function(err,foundCampGround){
        if(err) console.log(err);
        else {
            res.render("comments/new",{ campGround : foundCampGround });
        }
    });
});

app.post("/campgrounds/:id/comments",function(req,res){
    CampGround.findById(req.params.id,function(err,foundCampGround){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err) console.log(err);
                else{
                    foundCampGround.comments.push(comment);
                    foundCampGround.save();
                    res.redirect("/campgrounds/"+foundCampGround._id);
                }
            });
        }
    });
});

app.listen(3000, function () {
    console.log("YelpCamp can be seen now.");
});