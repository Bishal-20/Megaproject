const express=require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedin,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});
const Listing=require("../models/listing.js");
// Search Route
router.get('/search', wrapAsync(async (req, res) => {
    const { query } = req.query;
    const listings = await Listing.find({
        $or: [
            { location: new RegExp(query, 'i') },
            { country: new RegExp(query, 'i') }
        ]
    });
    res.render('search', { allListings: listings, searchQuery: query  });
}));

//(Get all the listings)(Post a new listing)
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedin,upload.single("listing[image]"), wrapAsync(listingController.newListing));



//New Route
router.get("/new", isLoggedin, listingController.newRenderform);

//(Get a specific listing)(Update a specific listing)(Delete a specific listing)
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedin, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedin, isOwner,wrapAsync(listingController.deleteListing));

//Edit Route
router.get("/:id/edit", isLoggedin, isOwner,wrapAsync(listingController.renderEditform));

module.exports=router;