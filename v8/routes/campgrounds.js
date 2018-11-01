var expres = require("express");
var router = expres.Router();
var CampGround = require("../models/campground");
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
router.get("/new", function (req, res) {
    res.render("campgrounds/new");
});

//CREATE = add a new Campground to DB
router.post("/", function (req, res) {
    var newCampGround = { name: req.body.campName, image: req.body.campImage, description: req.body.campDescription };
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

module.exports = router;