var expres = require("express");
var router = expres.Router();
var passport = require("passport");
var User = require("../models/user");

//Root Route
router.get("/", function (req, res) {
    res.render("landing");
});

//==============================
// AUTH ROUTE 
//==============================

//Show Register Form
router.get("/register", function (req, res) {
    res.render("register");
});

//Handles Sign Up Login
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error",err.message);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req, res, function () {
                req.flash("success","WELCOME TO YELPCAMP "+user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

//Show Login Form
router.get("/login", function (req, res) {
    res.render("login");
});

//Handles Login 
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) { 
});

//Logout Route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/");
})


module.exports = router;