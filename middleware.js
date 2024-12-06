// middleware.js

// Protect route middleware
const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const expressError = require("./utils/expressError");

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.path, "..", req.originalUrl);
    
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Save the requested URL in session
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    res.locals.currUser = req.user;
    next();
};

// Middleware to retrieve and delete the stored redirect URL
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Clear after setting
    } 
    console.log("Redirect URL set to:", res.locals.redirectUrl); // Debugging log
    next();
};


module.exports.isOwner = async (req,res,next) =>{
    const { id } = req.params;
    let list = await Listing.findById(id);
    if(!list.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "OOPS :( You are not the owner!")
        return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    // req.flash("success", "listing updated")
    // res.redirect(`/listings/${id}`);
    next();
}

module.exports.validateReview = (req,res,next) =>{
    console.log("review: ", req.body.review);
    
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message.join(","));
        throw new expressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next) =>{
    const { id, reviewId } = req.params;
    let rev = await Review.findById(reviewId);
    if(!rev.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review")
        return res.redirect(`/listings/${id}`);
    }
    next();
}