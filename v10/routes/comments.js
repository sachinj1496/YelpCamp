var expres = require("express");
var router = expres.Router({mergeParams : true});
var CampGround = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
//======================================
//COMMENTS ROUTES
//======================================

//Comments New
router.get("/new", middleware.isLoggedIn, function (req, res) {
    CampGround.findById(req.params.id, function (err, foundCampGround) {
        if (err) console.log(err);
        else {
            res.render("comments/new", { campGround: foundCampGround });
        }
    });
});

//Comments Create
router.post("/", middleware.isLoggedIn, function (req, res) {
    CampGround.findById(req.params.id, function (err, foundCampGround) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) console.log(err);
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCampGround.comments.push(comment);
                    foundCampGround.save();
                    res.redirect("/campgrounds/" + foundCampGround._id);
                }
            });
        }
    });
});

//EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err) {
            res.redirect("back");
        }else{
            res.render("comments/edit",{ campGround_id : req.params.id , comment : foundComment });
        }
    });
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//COMMENT DESTROY ROUTE 
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


module.exports = router; 