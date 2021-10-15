const express = require('express');
const router = express.Router()
const catchAsync = require("../utility/catchAsync");
const { campgroundSchema} = require("../schemas.js"); // Joi Server side validation
const ExpressError = require("../utility/ExpressError");
const Campground = require("../models/campground");
const {isLoggedIn, isAuthor, validateCampground } = require('../middleware.js') // need curly Braces to bring middleware
const campgrounds = require('../controllers/campgrounds')
const multer  = require('multer')
const {storage} =require('../cloudinary')
const upload = multer({ storage })


router.route('/')
  .get(catchAsync(campgrounds.index))
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
  // .post(upload.array('image'), (req, res) => {
  //   console.log(req.body, req.files)
  //   res.send("Walla")
  // })
  
router.get("/new", isLoggedIn, campgrounds.newcamp)
  //show

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor,validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor,catchAsync(campgrounds.deleteCampground));


  
router.get("/:id/edit", isLoggedIn, isAuthor,catchAsync(campgrounds.edit));

  // for updating campg

module.exports = router;