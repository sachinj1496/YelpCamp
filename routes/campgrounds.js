var expres = require("express");
var router = expres.Router();
var CampGround = require("../models/campground");
var middleware = require("../middleware");
//==========================
//CAMPGROUNDS ROUTE
//==========================

//INDEX = Show all Campgrounds
router.get("/", function (req, res) {
    //Get all the campgroudn from the DB
    CampGround.find({}, function (err, allCampGrounds) {
        if (err) console.log(err);
        else {
            res.render("campgrounds/index", { campGrounds: allCampGrounds });
        }
    });
});

//NEW = Show a form to create a new Campground
router.get("/new",middleware.isLoggedIn ,function (req, res) {
    res.render("campgrounds/new");
});

//CREATE = add a new Campground to DB
router.post("/", middleware.isLoggedIn,function (req, res) {
    var author = { id : req.user.id , username : req.user.username };
    var newCampGround = { name: req.body.campName,price : req.body.price, image: req.body.campImage, description: req.body.campDescription , author : author };
    CampGround.create(newCampGround, function (err, newlycreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//SHOW - Show more info of single campground
router.get("/:id", function (req, res) {
    CampGround.findById(req.params.id).populate("comments").exec(function (err, foundCampGround) {
        if (err) console.log(err);
        else {
            res.render("campgrounds/show", { campGround: foundCampGround });
        }
    });
});


//EDIT CampGround Route
router.get("/:id/edit",middleware.checkCampGroundOwnership,function(req,res){
    CampGround.findById(req.params.id,function(err,foundCampGround){
        res.render("campgrounds/edit",{ campGround : foundCampGround });
    });
});

//UPDATE CampGround Route 
router.put("/:id",middleware.checkCampGroundOwnership,function(req,res){
    //find and update 
    CampGround.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampGround){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//DESTROY CampGround Route
router.delete("/:id",middleware.checkCampGroundOwnership,function(req,res){
    CampGround.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;