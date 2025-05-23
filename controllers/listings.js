const Listing  = require("../models/listing.js"); 
   

module.exports.index = async (req, res) => {
    try {
        let query = {};
        if (req.query.q) {
            query = { title: { $regex: req.query.q, $options: "i" } }; // Case-insensitive search
        }

        const allListings = await Listing.find(query);
        res.render('listings/index.ejs', { listings: allListings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        req.flash("error", "Something went wrong!");
        res.redirect("/listings");
    }
};    


module.exports.renderNewForm = (req, res) => {    
    res.render("listings/new.ejs")};


module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path :"reviews" , 
        populate: {path:"author"},
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "The listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs" , {listing});
}


module.exports.createListing = async (req , res , next)=>{
    let url = req.file.path ;
    let filename = req.file.filename ;
    console.log(url , filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id ;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success" , "new listing was added..!");
    res.redirect("/listings");
}

module.exports.renderEdit = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "The listing you requested for does not exist");
        return res.redirect("/listings");
    };

    let ogImageUrl = listing.image.url ;
    ogImageUrl = ogImageUrl.replace("/upload" , "/upload/w_250");
    res.render("listings/edit.ejs" ,{listing , ogImageUrl});
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let listing =await Listing.findByIdAndUpdate(id ,{ ...req.body.listing });

    if(typeof req.file !== "undefined"){
    let url = req.file.path ;
    let filename = req.file.filename ;
    console.log(url, filename);
    listing.image = {url,filename};
    await listing.save();
    }

    req.flash("success" , "listing is updated !");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "listing is deleted !");
    res.redirect("/listings");
}   