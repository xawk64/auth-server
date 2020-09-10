const mongoose = require("mongoose");

const Profile = mongoose.model(
  "Profile",
  new mongoose.Schema({
      public: {
        fullname: String,
        status: String,
        location: {
          city: String,
          country: String
        },
        photoUrl: {
          small: String,
          large: String
        },
        follows: Array,
        profession: String,
        date: String
      },
      private: {
          sexOrientation: String
      },
      postsId: String
  })
);

module.exports = Profile;