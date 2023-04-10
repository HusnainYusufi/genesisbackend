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


// app.post('/addPreference' , (req , res) =>{
//     if(req.body.uid !== undefined ){
//         const data = req.body;
//         Preference.create(data , (err , doc) =>{
//             if(err){
//                 return res.json(handleErr(err))
//             }else{
//                 return res.json(handleSuccess(doc));
//             }
//         })
//         }else{
//             return res.json(handleErr("UID is required"))
//         }
// })

//add update
app.post('/addPreference:id' , (req , res) =>{
    const sid = req.params.id;

    if(sid !== undefined){
        const data = req.body;
    
        Preference.findOne({uid:sid})
        .exec((err , doc) =>{
            if(err){
                return res.json(handleErr(err))
            }else{

                if(doc !== null){       
                    console.log(data);             
                    Preference.findOneAndUpdate({uid:sid} , data , {new:true})
                    .exec((err2 , doc3) =>{
                        if(err){
                            return res.json(handleErr(err2))
                        }else{
                            return res.json(handleSuccess(doc3));
                        }
                    })

                }else{
                    Preference.create(data , (err , doc4) =>{
                        if(err){
                            return res.json(handleErr(err))
                        }else{
                            return res.json(handleSuccess(doc4));
                        }
                    })
                }
            }
        })
    }else{
        return res.json(handleErr("UID is required"));
    }
})



module.exports = app;