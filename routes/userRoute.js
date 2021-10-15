const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utility/catchAsync");
const passport = require("passport");
const usercontroller = require("../controllers/users");


router.route('/register')
    .get(usercontroller.renderRegister) // Register
    .post(catchAsync(usercontroller.register)) //create register


router.route("/login")
    .get(usercontroller.loginRender)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), usercontroller.login);


router.get('/logout', usercontroller.logout)

module.exports = router;
 