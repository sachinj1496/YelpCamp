var expres = require("express");
var router = expres.Router({mergeParams : true});
var CampGround = require("../models/campground");
var Comment = require("../models/comment");

//======================================
//COMMENTS ROUTES
//======================================

//Comments New
router.get("/new", isLoggedIn, function (req, res) {
    CampGround.findById(req.params.id, function (err, foundCampGround) {
        if (err) console.log(err);
        else {
            res.render("comments/new", { campGround: foundCampGround });
        }
    });
});

//Comments Create
router.post("/", isLoggedIn, function (req, res) {
    CampGround.findById(req.params.id, function (err, foundCampGround) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) console.log(err);
                else {
                    foundCampGround.comments.push(comment);
                    foundCampGround.save();
                    res.redirect("/campgrounds/" + foundCampGround._id);
                }
            });
        }
    });
});

//Middle-Ware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}

module.exports = router; 