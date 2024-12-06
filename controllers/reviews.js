const review = require("../models/review.js")
const listing = require("../models/listing.js");

module.exports.createReview = async(req,res) =>{
   
    let foundListing = await listing.findById(req.params.id);
    
    if (!foundListing) {
        throw new ExpressError(404, "Listing Not Found");
    }

    const newReview = new review(req.body.review)
    newReview.author = req.user._id;
    console.log(newReview);
    
    foundListing.reviews.push(newReview);
    console.log("listing", foundListing);
    
    await newReview.save();
    await foundListing.save();
    req.flash("success", "You added a review!"); 

    console.log("New review saved");

    res.redirect(`/listings/${req.params.id}`);
    
}

module.exports.destroyReview = async(req,res) =>{
    const { id, reviewId } = req.params;

    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove review reference from listing
    await review.findByIdAndDelete(reviewId); // Delete the review itself

    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);

}