const db = require("../models");
const Profile = db.profile;
const User = db.user;
const mongoose = require("mongoose");

  exports.follow = (req, res) => {

    User.findById(req.userId, (err, user) => {
      if (err) {
        res.status(500).send ({message: err})
      }

    Profile.findById(user.profileId, (err, profile) => {
      if (err) {
        res.status(500).send ({message: err})
      }

      profile.public.follows.push(req.body.profileId)
      Profile.updateOne({_id : user.profileId}, {public: {...profile.public}}, {upsert: false}, (err) => {
        if (err) {
          res.status(500).send({message: err})
        }
      
      res.status(200).send ("success")
      })

    })
   
    })

  }

  exports.unfollow = (req, res) => {

    User.findById(req.userId, (err, user) => {
      if (err) {
        res.status(500).send ({message: err})
      }

    Profile.findById(user.profileId, (err, profile) => {
      if (err) {
        res.status(500).send ({message: err})
      }
console.log(req.body.profileId)
      let filtered = profile.public.follows.filter(id => id != req.body.profileId)
      console.log(filtered)
      profile.public.follows = filtered
      console.log(profile.public.follows)
      Profile.updateOne({_id : user.profileId}, {public: {...profile.public}}, {upsert: false}, (err) => {
        if (err) {
          res.status(500).send({message: err})
        }
      
      res.status(200).send ("success")
      })

    })

   
    })


  }