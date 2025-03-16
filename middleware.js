const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schema.js");




const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirectUrl save
        req.session.redirectUrl = req.originalUrl ;
        req.flash("error" , "You are not logged in to Wonderlust");
        return res.redirect("/login");
    } 
    next();
};



const saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl ;
    }
    next();
};

const isOwner = async (req,res,next) => {
    let {id} = req.params ;
    let listing = await Listing.findById(id);

    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error" , "You are not the Owner of this listing");
        return res.redirect(`/listings/${id}`);   //redirect to show route
    }
    next();

}


const isReviewAuthor = async (req,res,next) => {
    let {id, reviewId} = req.params ;
    let review = await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error" , "You did not create this review");
        return res.redirect(`/listings/${id}`);   //redirect to show route
    }
    next();

}


//server side validations for adding new listing
const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }else {
        next();
    };
};



//server side validations for adding reviews on listing
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }else {
        next();
    };
};



module.exports = { isLoggedIn, validateListing ,saveRedirectUrl  , isOwner , validateReview ,isReviewAuthor};