const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session")
const MongodbSession = require('connect-mongodb-session')(session)
const path = require("path");
const ejsMate = require("ejs-mate");
const { campgroundSchema, reviewSchema } = require("./schemas.js"); // Joi Server side validation
const catchAsync = require("./utility/catchAsync");
const ExpressError = require("./utility/ExpressError");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const bcrypt = require("bcrypt")
const Review = require("./models/review");
const { expression } = require('joi');

app.use(express.static(path.join(__dirname, "public")));

const User = require("./models/user");

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

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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
const validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body);
  console.log(error)
  if(error){const msg = error.details.map(el) = el.message.join(",");
  throw new ExpressError(msg, 400)
  } else{
    next();
  }
  };
// register
app.get("/register", (req, res) => {
console.log("Regster")
  res.render("register");
});

// Register
app.post('/register', catchAsync(async(req, res) => {
const {username, email, password} = req.body;

let user = await User.findOne({email});

if(user){
  return res.redirect("/login")
}
const hashedPsw = await bcrypt.hash(password, 12)
user = new User({
  username,
  email,
  password: hashedPsw
}) 
await user.save();
res.redirect("/login")
}))

app.get("/login", async(req, res) => {
  res.render("login")
})
// Login
app.post('/login', catchAsync(async(req, res) => {
const {email, password} = req.body;
 
const user = await User.findOne({email});
if(!user){
  return res.redirect("/register")
}
 const isMatch = await bcrypt.compare(password, user.password);
if(!isMatch){
  return res.redirect("/login")
}
console.log("Loggint=gggg")
req.session.isAuth = true;
res.redirect('/campgrounds')
}))
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



app.get(
  "/campgrounds", isAuth,
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
app.get("/campgrounds/new", isAuth, (req, res) => {
  res.render("campgrounds/new");
});

app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//show
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    console.log(campground)
    res.render("campgrounds/show", { campground });
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
// for updating campg
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);
//for review POST sec 46 v-3 for review group
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review)
  await campground.save();
  await review.save();
  res.redirect(`/campgrounds/${campground._id}`)
}));

// Delete 46 v 7
app.delete('/campgrounds/:id/reviews/:id', catchAsync(async(req, res) =>{
  const {id, reviewId} = req.params;
  await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
  await Review.findByIdAndDelete(reviewId)
  res.redirect(`/campgrounds/${id}`)
}))

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// default error handler..
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Saomething Went Wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(5000, () => {
  console.log("Serving on port 5000");
});
