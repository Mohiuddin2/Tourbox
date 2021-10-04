const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const ejsLint = require("ejs-lint"); // for checking error i dont know still

//connect mongoose
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,  
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({}); // it delete everything
  for (let i = 1; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/190727",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat quaerat numquam, sapiente minus, reprehenderit maxime necessitatibus quod praesentium explicabo tempore omnis eaque possimus iusto inventore laborum officiis esse assumenda perferendis.",
      price,
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
