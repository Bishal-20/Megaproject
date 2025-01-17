const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedin,isreviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");

//Reviews
//post route for reviews
router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.createReview));

//delete route for reviews
router.delete("/:reviewId",isLoggedin,isreviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;