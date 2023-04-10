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
const Admin = require('../models/admin');

//login admin
app.post('/login' , async (req , res) =>{
    if(req.body.email !== undefined && req.body.password !== undefined){
        let data = req.body;
        try {
            const doc = await Admin.findOne({email:data.email , password:data.password}).exec()
            if(doc !== null){
                return res.json(handleSuccess(doc));
            }else{
                return res.json(handleErr("No User"));
            }
        } catch (error) {
            return res.json(handleErr(error));   
        }
    }else{
        return res.json(handleErr("All Fields are required"));
    }
})

//register admin
app.post('/registerAdmin' , async (req , res) =>{
    if(req.body.username !== undefined && req.body.email !== undefined && req.body.password !== undefined){
        try {
            let data = req.body;
            const doc = await Admin.create(data).exec()
            if(doc !== undefined){
                return res.json(handleSuccess(doc))
            }else{
                return res.json(handleErr("No User Found"));
            }
        } catch (error) {
            return res.json(handleErr(error));
        }
    }else{
        return res.json(handleErr("All Fields are required"));
    }
})

//get all profiles
app.get('/getAllProfiles' , async (req , res) =>{
    
    try {
        const doc = await User.find({}).exec();
        return res.json(handleSuccess(doc[0]));
    } catch (error) {
        return res.json(handleErr(error));
    }
})

module.exports = app;