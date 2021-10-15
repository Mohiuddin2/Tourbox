const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');
const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require('../middleware.js'); // need curly Braces to bring middleware

router.get('/', isLoggedIn, (req, res) => {
  res.render('campgrounds/donation');
});


router.post('/create/orderId', catchAsync((req, res) => {
    console.log('Create orderId request', req.body)
    let options = {
        amount: req.body.amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "rcp1"
      };
      instance.orders.create(options, function(err, order) {
        console.log(order);
        res.send({oerderId : order.id});
      });
}))



module.exports = router;