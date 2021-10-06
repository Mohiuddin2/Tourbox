const express = require('express');
const router = express.Router({mergeParams: true})
const catchAsync = require("../utility/catchAsync");
const { reviewSchema} = require("../schemas.js"); // Joi Server side validation
const ExpressError = require("../utility/ExpressError");
const Review = require("../models/review");
const Campground = require("../models/campground");

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    console.log(error)
    if(error){const msg = error.details.map(el) = el.message.join(",");
    throw new ExpressError(msg, 400)
    } else{
      next();
    }
    };

//for review POST sec 46 v-3 for review group
router.post('/', validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review)
    await campground.save();
    await review.save();
    req.flash('success', 'Review Created')
    res.redirect(`/campgrounds/${campground._id}`)
  }));
  
  // Delete 46 v 7
  router.delete('/:reviewId', catchAsync(async(req, res) =>{
    const {id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review Deleted!')
    res.redirect(`/campgrounds/${id}`)
  }))
  
  module.exports = router