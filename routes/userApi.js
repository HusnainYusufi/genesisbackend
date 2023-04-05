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

//signup user
app.post('/signUp' , (req , res) =>{
    if(req.body.uid !== undefined){
        try {
            let data = req.body;
            User.create(data , (err , doc) =>{
                if(err){
                    return res.json(handleErr(err))
                }else{
                    return res.json(handleSuccess(doc))
                }
            })
        } catch (error) {
            return res.json(handleErr(error));
        }
    }else{
        return res.json(handleErr("UID is required"));
    }
})

//complete profile
app.post('/completeProfile:id' , (req , res) =>{
    let uid = req.params.id;
    
    if(uid !== undefined){
        let data = req.body;
        try {
            User.findByIdAndUpdate(uid , data)
            .exec((err , doc) =>{
                if(err){
                    return res.json(handleErr(err))
                }else{
                    return res.json(handleSuccess(doc));
                }
            })
        } catch (error) {   
            return res.json(handleErr(error));
        }
    }else{
        return res.json(handleErr("UID is required"));
    }
});

//upload profile image
app.post('/profileImage' , (req , res) =>{
    uploadMult(req , res , function(err){
        if(err){
            return res.json(handleErr(err))
        }else{
            let fileData = req.files
            if(fileData !== undefined && req.body.uid !== undefined){
                let image = fileData.map((file) =>{return file.filename}) 
                console.log(image);
                let data = {}
                data.userImages = image

                User.findByIdAndUpdate(uid , data)
                .exec((err , doc) =>{
                    if(err){
                        return res.json(handleErr(err))
                    }else{
                        return res.json(handleSuccess(doc))
                    }
                })
            }else{
                return res.json(handleErr("UID is required"));
            }
        }
    })
})

//search by username
app.post('/searchUser' , (req , res) =>{
    if(req.body.username){
        User.find({username : {$regex : req.body.user + '.*'}})
        .exec((err , doc) =>{
            if(err){
                return res.json(handleErr(err))
            }else{
                return res.json(handleSuccess(doc));
            }
        })
    }else{
        return res.json(handleErr("Username is required"));
    }
})

//get opposite listings


//get user by uid
app.post('/getUsers' , (req , res) =>{ //translate coordincates also preferences
    if(req.body.uid){
        User.find({uid:req.body.uid})
        .exec((err , doc) =>{
            if(err){
                return res.json(handleErr(err))
            }else{
                return res.json(handleSuccess(doc))
            }
        })
    }else{
        return res.json(handleErr("UID is required"))
    }
})

//images delete

module.exports = app;