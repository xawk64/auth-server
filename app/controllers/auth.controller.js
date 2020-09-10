const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Profile = db.profile;


var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

        const profile = new Profile({
            public: {
              fullname: req.body.username,
              status: '',
              location: {
                city: '',
                country: ''
              },
              follows: [],
              photoUrl: {
                small: 'https://cdn.iconscout.com/icon/free/png-512/avatar-380-456332.png',
                large: 'https://imgcomfort.com/Userfiles/Upload/images/illustration-geiranger.jpg'
              },
              profession: '',
              date: ''
            },
            private: {
                sexOrientation: ''
            }
        })


        profile.save( (err) => {
          if (err) {
            res.status(500).send({mesage: err})
          }
        })
        
        user.profileId = profile._id

        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.status(200).send({ message: "User was registered successfully!" })
        })

      })
    }

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ error: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ error: "User Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          error: "Invalid Password!"
        });
      }

      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      console.log (user.profileId)
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        profileId: user.profileId,
        accessToken: token
      });
    });
};

exports.authMe = (req, res) => {
    User.findById(req.userId, (err, user) => {
      if (err) {
        res.status(200).send ({message: err})
      }
      console.log (user.profileId)

      res.status(200).send ({
        id: user._id,
        username: user.username,
        email: user.email,
        profileId: user.profileId
      })

    })
}