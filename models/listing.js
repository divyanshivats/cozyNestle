const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const review = require("./review.js")

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'  // This should refer to the User model
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    }
    
});

listingSchema.post("findOneAndDelete", async (listing) =>{
    if(listing){
        await review.deleteMany({_id: {$in : listing.reviews}})
    }
})


// creating model
const listing = mongoose.model("listing", listingSchema)
module.exports = listing; 