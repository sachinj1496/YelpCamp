var mongoose = require("mongoose"),
    CampGround = require("./models/campground"),
    Comment = require("./models/comment");
var data = [
    { 
        name : "Cloud's Rest",
        image : "https://farm4.staticflickr.com/3910/14868621954_64820165d7.jpg",
        description : "blah blah"  
    },
    {
        name : "Desert Mesa",
        image : "https://farm3.staticflickr.com/2524/3875579827_d74d424902.jpg",
        description : "blah blah blah"
    },
    {
        name : "Canyon Floor",
        image : "https://farm7.staticflickr.com/6060/6347468615_8c990b0a2f.jpg",
        description : "blah blah blah blah"
    }
];

function seedDb(){
    //Remove all campground
    CampGround.remove({},function(err){
        if(err) console.log(err);
        console.log("removed campgrounds");
        //add a few campgrounds
        data.forEach(function(seed){
            CampGround.create(seed,function(err,campground){
                if(err) console.log(err);
                else{
                    console.log("added a campground");
                    Comment.create({
                        text : "This place is great. I wish it had interent",
                        author : "Homer"
                    },function(err,comment){
                        if(err) console.log(err);
                        else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created a new comment");
                        }
                    });
                }
            });
        });
    });  
}

module.exports = seedDb;