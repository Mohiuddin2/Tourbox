module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){ //isAuthenticated method from passport
    // console.log(req.path, req.originalUrl)
    req.session.returnTo= req.originalUrl // for redirecting expected path
        req.flash('error', 'You must be logged in');
        return res.redirect('/login') // if you don't put return next code runs but u don't need to run next code..
      }
      next();
}