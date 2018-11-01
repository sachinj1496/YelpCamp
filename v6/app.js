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

seedDb();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+"/public"));
mongoose.connect("mongodb://localhost/yelp_camp_v6", { useNewUrlParser: true });

//PASSPORT CONFIGURATION 
app.use(require("express-session")({
    secret : "I am the bad boy.",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

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

app.get("/campgrounds/:id/comments/new",isLoggedIn ,function(req,res){
    CampGround.findById(req.params.id,function(err,foundCampGround){
        if(err) console.log(err);
        else {
            res.render("comments/new",{ campGround : foundCampGround });
        }
    });
});

app.post("/campgrounds/:id/comments",isLoggedIn ,function(req,res){
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
//==============================
// AUTH ROUTE 
//==============================

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    var newUser = new User({ username : req.body.username });
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");   
        });
    });
});


app.get("/login",function(req,res){
    res.render("login");   
});

app.post("/login",passport.authenticate("local",{
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
}),function(req,res){});


app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }   

    res.redirect("/login");
}
app.listen(3000, function () {
    console.log("YelpCamp can be seen now.");
});