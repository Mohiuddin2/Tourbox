const express = require('express');
const router = express.Router({mergeParams: true})
const catchAsync = require("../utility/catchAsync");
const { reviewSchema} = require("../schemas.js"); // Joi Server side validation
const ExpressError = require("../utility/ExpressError");
const Review = require("../models/review");
const Campground = require("../models/campground");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const reveiwController = require('../controllers/reviews')

//for review POST sec 46 v-3 for review group
router.post('/', isLoggedIn, validateReview, catchAsync(reveiwController.createReveiw));
  
  // Delete 46 v 7 Delete
  router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reveiwController.reviewDelete))
  
  module.exports = router