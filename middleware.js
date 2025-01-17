const Listing=require("./models/listing");
const Review=require("./models/reviews");
const Expresserror=require("./utils/Expresserror.js");
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedin=(req,res,next)=>{
  if(!req.isAuthenticated()){
     req.session.redirectUrl=req.originalUrl;
     req.flash("error","You need to login first to create a listing!");
     return res.redirect("/login");
   }
   next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner=async (req,res,next)=>{
  let { id } = req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
  next();  
};

module.exports.validateListing=(req,res,next)=>{
  let{error}=listingSchema.validate(req.body);
  if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new Expresserror(errMsg,400);
  }
  if (!req.body.listing.image || !req.body.listing.image.url) {
      req.body.listing.image = { url: "https://elements-resized.envatousercontent.com/envato-shoebox/a943/29a3-8b02-4108-a90f-ae32662bc364/Walker%20crossing%20bridge%20over%20river%20_T6A7656.jpg?w=1600&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=ad7d643153410b99b07d79a1324eed03f3105bd2c0309ac0e2178d099f817e28" };
  }
  next(); 
};

module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new Expresserror(errMsg,400);
    }else{
        next();
    }
};

module.exports.isreviewAuthor=async (req,res,next)=>{
  let { id, reviewId } = req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
  next();  
};