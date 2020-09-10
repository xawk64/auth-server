const db = require("../models");
const Profile = db.profile;
const User = db.user;
const mongoose = require("mongoose");

  exports.setProfile = (req, res) => {
    console.log(req.body)
    User.findById(req.userId, (err, user) => {
      if (err) {
        res.status(500).send ({message: err})
        return
      }

      const profile = {
      public: {
        fullname: req.body.public.fullname,
        status: req.body.public.status,
        location: {
          city: req.body.public.location.city,
          country: req.body.public.location.country
        },
        follows: req.body.public.follows,
        photoUrl: {
          small: req.body.public.photoUrl.small,
          large: req.body.public.photoUrl.large
        },
        profession: req.body.public.profession,
        date: req.body.public.date
      },
      private: {
          sexOrientation: req.body.private.sexOrientation
      },
    }

    Profile.updateOne({_id : user.profileId}, profile, {upsert: false}, (err) => {
      if (err) {
        res.status(500).send({message: err})
      }
      
    })

    console.log("ura!")
    res.status(200).send("was success!")
    })

  }

  exports.getProfiles = (req, res) => {
   
    if (req.query.page > -1) {

      User.findById(req.userId, (err, user) => {
        if (err) {
          res.status(500).send({message: err})
        }

        Profile.findById(user.profileId, (err, userProfile) => {
          if (err) {
            res.status(500).send({message: err})
          }
        
          Profile.find((err, profiles) => {
            if (err) {
              res.status(500).send ({message: err})
            }
            
          let limit = req.query.limit
          let page = req.query.page
      
          let startIndex = (page - 1) * limit
          let endIndex = page * limit

          let profilesWithoutAuthProfile = profiles.filter (profile => String(profile._id) !== String(userProfile._id))
      
          let result = profilesWithoutAuthProfile.slice(startIndex,endIndex)
          let resWithFollow = result.map ( profile => {
            let newProfile = {public: {...profile.public}, _id: profile._id}
            newProfile.public.followed = (userProfile.public.follows.some (elem =>{
              return elem == profile._id
            }))
            return newProfile
          })
          
          res.status(200).json (
              {users: resWithFollow,
              usersCount: profiles.length
              })
          })

        })

      })
    
  }

  if (req.params.profileId === "my") {
    User.findById(req.userId, (err, user) => {
      if (err) {
        res.status(500).send ({message: err})
        return
      }
      
      Profile.findById(user.profileId, (err, profile) => {
        if (err){
        res.status(500).send ({message: err})
        return
      }

        res.status(200).json ({public: profile.public, private: profile.private})
      }
      )
    })
  } 
  
  if (req.params.profileId.length > 10) {

    Profile.findById( req.params.profileId , (err, profile) => {
      if (err){
      res.status(500).send ({message: err})
    }
      res.status(200).json ({public: profile.public})
    }
    )
  }

    
  }
