const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// UserSchema.plugin(passportLocalMongoose)
//I have to define if I want use usernameField as email as bellow
UserSchema.plugin(passportLocalMongoose,
  { usernameField : 'email'});

module.exports = mongoose.model("User", UserSchema);

