const Listing = require("../models/listing.js");
const mbxTGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = 'pk.eyJ1IjoiZGl2eWFuc2hpdmF0cyIsImEiOiJjbTNmaWNvYmwwNHp1MmlzY2Vlb2k3MWN2In0.mhXDgUytW1X2U1smbn9T0A';

const geocodingClient = mbxTGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const alListings = await Listing.find({});
    res.render("listings/index.ejs", { alListings });
}

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const listData = await Listing.findById(id).populate({path: "reviews", 
        populate: {
        path: "author",
    }}).populate("owner");
    if (!listData) {
        throw new ExpressError(404, "Listing Not Found");
    }
    // Check if owner is populated
    if (!listData.owner) {
        console.log("Owner is not populated or is null.");
    }
    res.render("listings/show.ejs", { listData });
}
module.exports.create = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
    
    
    const url = req.file.path;
    const filename = req.file.filename;
    console.log(url, "...", filename);
    const createData = new Listing(req.body.listing);    
    createData.owner = req.user._id;
    createData.image = {url, filename};
    createData.geometry = response.body.features[0].geometry
    let saved = await createData.save();
    console.log(saved);
    
    req.flash("success", "Wow! your location is on CozyNestle"); // to flash that new data is created
    res.redirect("/listings");
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listData = await Listing.findById(id);
    if(!listData){
        req.flash("error", "Listing you requested for does not exists");
        res.redirect("/listings");
    }
    let orgImageUrl = listData.image.url;
    orgImageUrl = orgImageUrl.replace("/upload", "/upload/w_250,h_250,c_fill")
    res.render("listings/edit.ejs", { listData, orgImageUrl });
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    console.log("id", id);
    
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "listing updated")
    res.redirect(`/listings/${id}`);
}


