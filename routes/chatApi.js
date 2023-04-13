const express = require('express');
const moment = require('moment');
const app = express();
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess = require('../HandleFunction/handleSuccess')
const fs = require('fs')
const jwt = require("jsonwebtoken");
const { encrypt } = require('../HandleFunction/Encrypt')
const { decrypt } = require('../HandleFunction/Decrypt');
const accessTokenKey = require('../constants/jwtpasswords').accessTokenKey
const verifytoken = require('../HandleFunction/JWT').auth
const path = require('path')
const uid = require('uid')
const upload = require('../HandleFunction/UploadFile')
const uploadMult = require('../HandleFunction/UploadMulti')
const User = require('../models/user');
const Community = require('../models/community');
const Preference = require('../models/preference');
const mongoose = require("mongoose");
const ObjectId = mongoose.mongo.ObjectId
const Chat = require('../models/chat');


//Get/create chat
app.post('/getChat', (req, res) => {
    if (req.body.sender && req.body.receiver) {
        let { sender, receiver} = req.body
        let data = {
            sender,
            receiver
        }
        Chat.find({ $or: [{ sender: sender }, { receiver: sender } , {sender : receiver} , {receiver : receiver}] }).populate('sender receiver').exec((err, doc) => {
            if (err) {
                console.log(err);
            }else {
                if (doc !== null) {
                    return res.json(handleSuccess(doc))
                } else {
                    Chat.create(data, (err, docc) => {
                        if (err) return res.json(handleErr(err))
                        else {
                            Chat.populate(docc, [
                                {
                                    path: "sender",
                                    model: "users"
                                },
                                {
                                    path: "receiver",
                                    model: "users"
                                }
                            ], (er, chat) => {
                                if (er) return res.json(handleErr(er))
                                else {
                                  
                                    return res.json(handleSuccess(chat))
                                }
                            })
                        }
                    })
                }
            }
        })

    } else {
        return res.json(handleErr('Chat data can not be null'))
    }
});

//My buyer chats
app.post('/senderChats', (req, res) => {
    if (req.body.sender) {
        let { sender } = req.body
        Chat.find({ sender:req.body.sender }).sort({ lastMessage: -1 }).populate([
            {
                path: "sender",
                model: "users"
            },
            {
                path: "receiver",
                model: "users"
            }
        ]).exec((err, docs) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(docs))
            }
        })
    } else {
        return res.json(handleErr('User can not be null'))
    }
})

//My seller chats
app.post('/receiverChats', (req, res) => {
    if (req.body.receiver) {
        let { receiver } = req.body
        Chat.find({ receiver:req.body.receiver }).sort({ lastMessage: -1 }).populate([
            {
                path: "sebder",
                model: "users"
            },
            {
                path: "receiver",
                model: "users"
            }
        ]).exec((err, docs) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(docs))
            }
        })
    } else {
        return res.json(handleErr('User can not be null'))
    }
})

//Get my all chats
app.post('/getAllMyChats', (req, res) => {
    if (req.body.user) {
        let { user } = req.body
        Chat.find({ $or: [{ sender: user }, { receiver: user }] }).sort({ lastMessage: -1 })
        .populate([
            {
                "path" : "sender",
                "model" : "users"
            },
            {
                "path" : "receiver",
                "model" : "users"
            }
        ])
        .exec((err, docs) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(docs))
            }
        })
    } else {
        return res.json(handleErr('User can not be null'))
    }
})


module.exports = app;