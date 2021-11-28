const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
// const ejsLint = require("ejs-lint"); // for checking error i dont know still

//connect mongoose
mongoose.connect("mongodb://localhost:27017/yelpcamp");
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
      author: "619e1fccc4060dad9122c3a1",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/190727",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat quaerat numquam, sapiente minus, reprehenderit maxime necessitatibus quod praesentium explicabo tempore omnis eaque possimus iusto inventore laborum officiis esse assumenda perferendis.",
      price,
      geometry:{
        type:'Point',
        coordinates:[
          cities[random1000].longitude,
          cities[random1000].latitude,
        ]
      },
      images: [
        {
          url:'https://res.cloudinary.com/dgbkufw6z/image/upload/v1637814428/YelpCamp/h0uoyqpnuxg5rgsfwdix.jpg',
          filename: 'YelpCamp/h0uoyqpnuxg5rgsfwdix'
        }
      ]
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
