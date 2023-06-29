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
const cors = require("cors");


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
        return res.json(handleSuccess(doc));
    } catch (error) {
        return res.json(handleErr(error));
    }
})

//get single profile
app.get('/getSingleProfile:id' , async (req , res) =>{
    const pid = req.params.id;
    if(pid){
        try {
            const doc = await User.findOne({_id:pid}).exec();
            return res.json(handleSuccess(doc));
        } catch (error) {
            return res.json(handleErr(error));
        }
    }else{
        return res.json(handleErr("PID is required"));
    }
})


//approving profile
app.post('/updateStatus:id' , async (req , res) =>{
    const pid = req.params.id;
    if(pid !== undefined){
        try {
            let data = req.body;
            const doc = await User.findOneAndUpdate({_id:pid} , data , {new:true}).exec()
            return res.json(handleSuccess(doc));
        } catch (error) {
            return res.json(handleErr(error));
        }
    }else{  
        return res.json(handleErr("Profile ID is required"));
    }
})


app.post('/deleteUser' , async(req , res) =>{

    if(req.body.userid !== undefined){

        try {
            const doc = await User.find({_id:req.body.userid}).exec();
            if(doc !== null){
                
                try {
                    const doc2 = await User.findOneAndUpdate({_id:req.body.userid} , {isDeleted:true}).exec();
                    if(doc2 !== null){
                        return res.json(handleSuccess("User has been deleted"));
                    }
                } catch (error) {
                    return res.json(handleErr(error));
                }
            }else{
                return res.json(handleErr("User not found"));
            }
        } catch (error) {
            return res.json(handleErr(error));
        }

    }else{
        return res.json(handleErr("User is required"));
    }

})
module.exports = app;