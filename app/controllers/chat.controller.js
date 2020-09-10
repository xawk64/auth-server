const db = require("../models");
const Profile = db.profile;
const User = db.user;
const Chat = db.chat;
const mongoose = require("mongoose");

exports.createChat = (req, res) => {
  User.findById({_id: req.userId}, (err, user) => {
    if (err) {
      res.status(400).send({error: err})
    }

    profileId = user.profileId

    Chat.find ({ members: { $all: [ profileId, req.body.profileId] } }, (err, chat) => {
    if (err) {
      res.status(400).send({error: err})
    }

    if (chat.length < 1) {
        let newChat = new Chat({
          messages: [], 
          members: [ profileId, req.body.profileId]
        })

        newChat.save( err => {
          if (err) {
            res.status(400).send({error: err})
          }
          res.status(200).send({message: "ok!"})
        })
    } else {
      console.log("ok!")
      res.status(200).send({message: "ok!"})
    }
    })
  })
}

exports.setMessage = (req, res) => {
  User.findById({_id: req.userId}, (err, user) => {
    if (err) {
      res.status(400).send({error: err})
    }

    profileId = user.profileId

  Chat.find ({ members: { $all: [ profileId, req.body.profileId] } }, (err,chat) => {
    if (err) {
      res.status(400).send({error: err})
    }

    if (chat.length > 0) {
      Profile.findById({_id: profileId}, (err, profile) => {
        if (err) {
          res.send.status(400).send({error: err})
        }
        const newMessage = {text: req.body.message, author: profile.public.fullname, date: Date.now()}
      Chat.updateOne({_id: chat[0]._id}, {messages: [...chat[0].messages, newMessage]}, {upsert: false}, err => {
        if (err) {
          res.status(400).send({error: err})
        }
        res.status(200).json(newMessage)
      })
    })
    } else {
      Profile.findById({_id: profileId}, (err, profile) => {
        if (err) {
          res.send.status(400).send({error: err})
        }

        let newChat = new Chat({messages: [{
          text: req.body.message,
          author: profile.public.fullname,
          date: Date.now()
        }], 
        members: [ profileId, req.body.profileId]})
        newChat.save( err => {
          if (err) {
            res.status(400).send({error: err})
          }
  
          res.status(200).json(newChat.messages[0])
        })
      })
      

    }
  })
})

  
}

exports.getChats = async (req, res) => {
  //user names part
  let data = {}
  //chats part
  await User.findById({_id: req.userId}, (err, user) => {
    if (err) {
      res.status(400).send({error: err})
    }
    data.user = user
  })

  await Chat.find({ members: data.user.profileId }, (err, chats) => {
    if (err) {
      res.status(400).send ({error: err})
    }
    data.chats = chats
  })

    if (data.chats.length > 0) {
      let chatsExport = data.chats.map( chat => chat.messages)
      let members = data.chats.map( chat => chat.members.filter( (member) => member !== data.user.profileId))
      await Profile.find ( { _id: { $in: members} }, (err, profiles) => {
        if (err) {
          res.status(400).send({error: err})
        }
        data.profiles = profiles
      })
      const usersFullnames = data.profiles.map( profile => profile.public.fullname )
      const usersProfileId = data.profiles.map( profile => profile._id )
     
      res.status(200).json({ usersFullnames, usersProfileId, chatsExport })
     
    } else {
      res.status(200).json([])
    }
}
