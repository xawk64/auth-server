const db = require("../models");
const Profile = db.profile;
const User = db.user;
const Post = db.post;
const mongoose = require("mongoose");

  exports.setPost = (req, res) => {

    User.findById(req.userId, (err, user) => {
      if (err) {
        res.status(500).send ({message: err})
      }

      Profile.findById(user.profileId, (err, profile) => {
        if (err) {
          res.status(500).send ({message: err})
        }

        if (profile.postsId != null) {
          Post.findById(profile.postsId, (err, posts) => {
            if (err) {
              res.status(500).send ({message: err})
            }
        
            Post.updateOne({_id : profile.postsId}, {data: [...posts.data, {text: req.body.postText, likesCount: 0}]}, {upsert: false}, (err) => {
              if (err) {
                res.status(500).send({message: err})
              }
            
            res.status(200).send ("success")
            })
      
          })
          } else {
            const posts = new Post ({
              data: [{
                text: req.body.postText, 
                likesCount: 0
              }]
            })
      
            posts.save((err) => {
              if (err) {
                res.status(500).send({mesage: err})
              }
            }
            )
      
            Profile.updateOne({_id : user.profileId}, {postsId: posts._id}, {upsert: false}, (err) => {
              if (err) {
                res.status(500).send({message: err})
              }
            
            res.status(200).send ("success")
            })
          }
          })

      })
      
  }

  exports.getPosts = (req, res) => {

    Profile.findById(req.params.profileId, (err, profile) => {
      
      if (err) {
        return res.status(500).send ({message: err})
      }

      if (profile.postsId) {
      Post.findById(profile.postsId, (err, posts) => {
      if (err) {
        res.status(500).send ({message: err})
      }
     
      res.status(200).json ({posts: posts.data})
    })
  } else {
    res.status(200).json ({posts: []})
  }
    
 })
}


  exports.putLike = (req, res) => {

    User.findById({_id: req.userId}, (err, user) => {
      if (err) {
        res.status(500).send({error: err})
      }
      console.log(req.body)
    Profile.findById(req.body.profileId, (err, profile) => {
      
      if (err) {
        res.status(500).send ({message: err})
      }

      if (profile.postsId) {
    Post.findById(profile.postsId, (err, posts) => {
      if (err) {
        res.status(500).send ({message: err})
      }

      let likeAlreadyPut = false
      for (let post of posts.data){
          if (post._id == req.body.likeId){
              post.likeProfileId.forEach( profileId => {
                  if (profileId == user.profileId) {
                      likeAlreadyPut = true
                  }
              })
          }
      }

      if (!likeAlreadyPut) {
        let newData = posts.data.map( post => {
          if (post._id == req.body.likeId) {
          post.likesCount++
          post.likeProfileId.push(user.profileId)
          return post
          } else {
          return post
        }
        }
     
        )

        Post.updateOne({_id : profile.postsId}, {data: newData}, {upsert: false}, (err) => {
          if (err) {
            res.status(500).send({message: err})
          }
        
        res.status(200).send ("success")
        })
      
      } else {
          res.status(500).send({error: "Like already put"})
        }
          })
        } else {
          res.status(500).send({error: "This profile do not have posts"})
        }
      })
    })
  }