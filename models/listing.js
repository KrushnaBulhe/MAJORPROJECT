const mongoose = require('mongoose');
const Schema = mongoose.Schema ;
const Review = require("./review.js");
const { types } = require('joi');

const listingSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true 
    },
    description: String,
    image: {
        url: String ,
        filename : String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId , ref:"Review"
        },
    ],
    owner : {
        type:Schema.Types.ObjectId , ref:"User"
    },
});


//middleware to delete reviews when complete listing will be deleted

listingSchema.post("findOneAndDelete" , async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in:listing.reviews}});
    };
});




const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;