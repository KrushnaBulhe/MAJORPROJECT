const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const Review = require("../models/review.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, saveRedirectUrl, isOwner, validateListing } = require("../middleware.js");
const multer = require('multer')
const { storage } = require("../CloudConfig.js");
const upload = multer({ storage });






const listingController = require("../controllers/listings.js");


router.get("/about", (req, res) => {
  res.render("listings/about");
})


// combining the routes of same path by router.route

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    
    wrapAsync(listingController.createListing)
  );





//New route to create new listing

router.get("/new", isLoggedIn, listingController.renderNewForm);





// combining the routes of same path by router.route

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put( upload.single("listing[image]"),validateListing, isLoggedIn, isOwner, wrapAsync(listingController.editListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))




//edit route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEdit));







module.exports = router;