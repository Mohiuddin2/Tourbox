const  { campgroundSchema, reviewSchema } = require('./schemas.js'); // for joi validation
const ExpressError = require('./utility/ExpressError');
const campground = require('./models/campground');
const Review = require('./models/review');
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){ //isAuthenticated method from passport
    // console.log(req.path, req.originalUrl)
    req.session.returnTo= req.originalUrl // for redirecting expected path
        req.flash('error', 'You must be logged in');
        return res.redirect('/login') // if you don't put return next code runs but u don't need to run next code..
      }
      next();
}

// server side validator middleware function
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Middleware is Auther
module.exports.isAuthor = async (req, res, next) => {
  const {id} = req.params;
  const campground = await Campground.findById(id)
  if(!campground.author.equals(req.user.id)){
  req.flash('error', "You do not have permission to do")
  return res.redirect(`/campgrounds/${id}`)
  }
  next()
}

module.exports.validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body);
  console.log(error)
  if(error){const msg = error.details.map(el) = el.message.join(",");
  throw new ExpressError(msg, 400)
  } else{
    next();
  }
  };

  // as people can't send request from postman/ or illegal way
module.exports.isReviewAuthor = async (req, res, next) => {
  const {id, reviewId} = req.params;
  const review = await Review.findById(reviewId)
  if(!review.author.equals(req.user.id)){
  req.flash('error', "You do not have permission to do")
  return res.redirect(`/campgrounds/${id}`)
  }
  next()
}