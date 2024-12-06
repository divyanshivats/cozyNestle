const express = require("express");
const router = express.Router({ mergeParams: true });
 // Enables access to :id in parent route
 // When you nest routes, such as /listings/:id/reviews, you need mergeParams: true in the review router. This allows req.params.id to be accessible within reviewRoute.
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/expressError.js")
const { reviewSchema } = require("../schema.js")
const review = require("../models/review.js")
const listing = require("../models/listing.js");
const {isLoggedIn, isOwner, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")


const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(error);
    }
    else{
        next();
    }
}

// create REview
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//delete route
router.delete("/:reviewId", isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview))


router.use((err,req,res,next) =>{
    let {status=500, msg="something went wrong"} =err;
   // res.status(status).send(msg);
   res.render("error.ejs", 
    { msg }
   )
})
module.exports = router;
