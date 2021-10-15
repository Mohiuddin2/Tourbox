const User = require("../models/user");



module.exports.renderRegister = (req, res) => {
    // res.send("Register")
    res.render("user/register");
  }

  module.exports.register = async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const newUser = await User.register(user, password);
      req.login(newUser, err => { // for login after register
        if(err) return next(err);
        req.flash('success', 'Welcome Yelpcamp')
        res.redirect('/campgrounds');
      })
    } catch (e) {
      req.flash("error", e.message) // Flash is not working
      res.redirect("/register");
    }
  }

  module.exports.loginRender = (req, res) => {
    res.render("user/login");
    // res.send("login");
  }

  module.exports.login=  (req, res) => {
    console.log(req.body)
      req.flash('success', 'Welcome');
      const redirectUrl = req.session.returnTo || '/campgrounds'; // to return expected path 
      delete req.session.returnTo
      res.redirect(redirectUrl)
    }
  module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", 'Logged Out Succesfully') 
    res.redirect('/campgrounds')
  }
 