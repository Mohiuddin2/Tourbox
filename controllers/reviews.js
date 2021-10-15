const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.createReveiw =async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user.id; // for saving/detecting current user
    campground.reviews.push(review)
    await campground.save();
    await review.save();
    req.flash('success', 'Review Created')
    res.redirect(`/campgrounds/${campground._id}`)
  }

  module.exports.reviewDelete  = async(req, res) =>{
    const {id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review Deleted!')
    res.redirect(`/campgrounds/${id}`)
  }