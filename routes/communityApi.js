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
const mocdata = require('../new.json');
const prefmoc = require('../pref.json');
const communitymoc = require('../community.json');
const Community = require('../models/community');
const Preference = require('../models/preference');
const mongoose = require("mongoose");
const ObjectId = mongoose.mongo.ObjectId

//add community

app.post('/addCommunity' , (req , res) =>{
    if(req.body.uid !== undefined ){
        let data = req.body;
        Community.create(data , (err , doc) =>{
            if(err){
                return res.json(handleErr(err))
            }else{
                return res.json(handleSuccess(doc));
            }
        })
        }else{
            return res.json(handleErr("UID is required"))
        }
})


module.exports = app;