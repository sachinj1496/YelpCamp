var CampGround = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampGroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        CampGround.findById(req.params.id, function (err, foundCampGround) {
            if (err) {
                res.redirect("back");
            }
            else {
                if (foundCampGround.author.id.equals(req.user.id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            }
            else {
                if (foundComment.author.id.equals(req.user.id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

 middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}

module.exports = middlewareObj ;