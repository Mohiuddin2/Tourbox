// if (process.env.NODE_ENV !== "production") {
//   require('dotenv').config();
// }

console.log(process.env.Api_Key)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session")
const flash = require("connect-flash");
const MongodbSession = require('connect-mongodb-session')(session)
const path = require("path");
const ejsMate = require("ejs-mate");
// const { campgroundSchema, reviewSchema } = require("./schemas.js"); // Joi Server side validation
const catchAsync = require("./utility/catchAsync");
const ExpressError = require("./utility/ExpressError");
const methodOverride = require("method-override");
const User = require("./models/user");
const { expression } = require('joi');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const dotenv = require('dotenv');
const Razorpay = require('razorpay')
dotenv.config();

//instantiate Razorpay
var instance = new Razorpay({  key_id: 'rzp_test_ngxOrke35Nhg0f',  key_secret: '7ZCezd6WzC55NKyZgePAjWER'});


const campgroundsRoute = require('./routes/campground')
const reviewsRoute = require('./routes/reviews')
const userRoute = require('./routes/userRoute')
const donationRoute = require('./routes/donation')

// For connect flash must follow this secuencial order-- accor. to doc pass.. initialize will be after session as bellow
app.use(session({
  secret:"YelcampSecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires:Date.now() + 1000*60*60*24*7, 
    maxAge: 1000*60*60*24*7,
  }
}))
// Connect-flash must follow order-- before router and flas.. app use
app.use(flash());
// passport will be here--
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()))

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},User.authenticate()
));


passport.serializeUser(User.serializeUser()) // for how do we store user in the session
passport.deserializeUser(User.deserializeUser()) // for removing user form session

app.use((req,res, next) => {
  // console.log(req.session)
  res.locals.currentUser = req.user, // this for session logged in or for
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})
// 
const mongoURI = "mongodb://localhost:27017/yelp-camp"
//connect mongoose
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

// mongodb session
const store = new MongodbSession({
  uri: mongoURI,
  collection: "mySession",
})

//to execute folowing
app.engine("ejs", ejsMate);
app.set("view engine", "ejs"); // setting ejs view engine
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Router
app.use('/', userRoute);
app.use('/campgrounds', campgroundsRoute)
app.use('/campgrounds/:id/reviews', reviewsRoute)
app.use('/donation', donationRoute)


const sessionconfig = {
  secret: 'High_secrete',
  resave: false,
  saveUninitialized: false,
  store: store,
  // cookie: { secure: true }
}
app.use(session(sessionconfig))
// Middleware for session
const isAuth = (req, res, next) => {
if(req.session.isAuth){
  next()
}
else{
res.redirect("/login")
}
}

//razorpay
app.post("/api/payment/verify",(req,res)=>{

  let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
 
   var crypto = require("crypto");
   var expectedSignature = crypto.createHmac('sha256', '7ZCezd6WzC55NKyZgePAjWER')
                                   .update(body.toString())
                                   .digest('hex');
                                   console.log("sig received " ,req.body.response.razorpay_signature);
                                   console.log("sig generated " ,expectedSignature);
   var response = {"signatureIsValid":"false"}
   if(expectedSignature === req.body.response.razorpay_signature)
    response={"signatureIsValid":"true"}
       res.send(response);
   });





// Logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if(err) throw err;
    res.redirect("/login")
  })
})

// Home
app.get("/", isAuth, (req, res) => {
  // req.session.isAuth = true;
  res.render("home");
});

// This is mystry I need add this on project


// app.all("*", (req, res, next) => {
//   next(new ExpressError("Page Not Found", 404));
// });

// // // default error handler..
// app.use((err, req, res, next) => {
//   const { statusCode = 500 } = err;
//   if (!err.message) err.message = "Saomething Went Wrong";
//   res.status(statusCode).render("error", { err });
// });

app.listen(5000, () => {
  console.log("Serving on port 5000");
});
