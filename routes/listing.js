const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js")
const listingController = require("../controllers/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })




const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

// Index route
router.get("/", wrapAsync(listingController.index));

// New listing form route
router.get("/new",isLoggedIn, listingController.renderNewForm);

// Create listing route
router.post("/", upload.single("listing[image]"), wrapAsync(listingController.create));


// Edit route
router.get("/:id/edit", wrapAsync(listingController.renderEditForm));

// Show route
router.get("/:id", wrapAsync(listingController.show));

// Update route
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing));


// Delete route
// Delete route should work with the DELETE HTTP method
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
   console.log('request received');
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully!");
    res.redirect("/listings");
}));


module.exports = router;
