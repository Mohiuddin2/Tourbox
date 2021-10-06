const express = require('express');
const router = express.Router()
const catchAsync = require("../utility/catchAsync");
const { campgroundSchema} = require("../schemas.js"); // Joi Server side validation
const ExpressError = require("../utility/ExpressError");
const Campground = require("../models/campground");
const {isLoggedIn} = require('../middleware.js') // need curly Braces to bring middleware
// server side validator middleware function
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
//campgrounds
router.get(
    "/", 
    catchAsync(async (req, res) => {
      const campgrounds = await Campground.find({});
      res.render("campgrounds/index", { campgrounds });
    })
  );
  router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
  });
  
  router.post(
    "/",isLoggedIn, validateCampground,
    catchAsync(async (req, res, next) => {
      const campground = new Campground(req.body.campground);
      await campground.save();
      req.flash('success', 'Campground Created succesfully')
      res.redirect(`/campgrounds/${campground._id}`);
    })
  );
  
  //show
  router.get(
    "/:id",
    catchAsync(async (req, res) => {
      const campground = await Campground.findById(req.params.id).populate("reviews");
      if(!campground){
          req.flash('error', 'Campground not found ')
          return res.redirect('/campgrounds')
      }
      res.render("campgrounds/show", { campground });
    })
  );
  
  router.get(
    "/:id/edit", isLoggedIn,
    catchAsync(async (req, res) => {
      const campground = await Campground.findById(req.params.id);
      res.render("campgrounds/edit", { campground });
    })
  );
  // for updating campg
  router.put(
    "/:id", isLoggedIn,
    validateCampground,
    catchAsync(async (req, res) => {
      const { id } = req.params;
      const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
      });
      req.flash('success', 'Campground Updated succesfully')
      res.redirect(`/campgrounds/${campground._id}`);
    })
  );
  
  router.delete(
    "/:id", isLoggedIn,
    catchAsync(async (req, res) => {
      const { id } = req.params;
      await Campground.findByIdAndDelete(id);
      req.flash('success', 'Campground Deleted succesfully')
      res.redirect("/campgrounds");
    })
  );


  
  module.exports = router;