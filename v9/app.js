var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    CampGround = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDb = require("./seeds");

var commentRoutes = require("./routes/comments"),
    campGroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// seedDb();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost/yelp_camp_v9", { useNewUrlParser: true });

//PASSPORT CONFIGURATION 
app.use(require("express-session")({
    secret: "I am the bad boy.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//Requiring Routes
app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campGroundRoutes);

app.listen(3000, function () {
    console.log("YelpCamp can be seen now.");
});