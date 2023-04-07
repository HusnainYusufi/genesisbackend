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
const community = require('../models/community');
const preference = require('../models/preference');
const ObjectId = mongoose.mongo.ObjectId

//bulk upload user
app.post('/bulkUpload' , (req , res) =>{
    User.create(mocdata , (err , doc) =>{
        if(err){
            return res.json(handleErr(err))
        }else{
            return res.json(handleSuccess(doc))
        }
    })
})

//bulk upload community
app.post('/bulkUploadCommunity' , (req , res) =>{
   let updcom = communitymoc.map((item) =>({
    uid : mongoose.Types.ObjectId(String(item.uid)),
        religion : item.religion,
        communityType : item.communityType,
        motherTounge : item.motherTounge,
        gender : item.gender
   }))
   Community.insertMany(updcom , (err , doc) =>{
    if(err){
        return res.json(handleErr(err))
    }else{
        return res.json(handleSuccess(doc))
    }
})
})

//bulk upload preference
app.post('/bulkUploadPreference' , (req , res) =>{
    let updpref = prefmoc.map((item) =>({
        uid : mongoose.Types.ObjectId(String(item.uid)),
        startage : item.startage,
        endAge : item.endAge,
        startHeight : item.startHeight,
        endHeight : item.endHeight,
        preferedMartialStatus: item.preferedMartialStatus,
        preferedReligion : item.preferedReligion,
        preferedCommunity : item.preferedCommunity,
        preferedMotherTongue : item.preferedMotherTongue,
       }))
    Preference.insertMany(updpref , (err , doc) =>{
        if(err){
            return res.json(handleErr(err))
        }else{
            return res.json(handleSuccess(doc))
        }
    })
})

//bulk delete
app.get('/deleteUsers' , (req , res) =>{
    try {
        Community.deleteMany((err , doc) =>{
            if(err){
                return res.json(handleErr(err))
            }else{
                return res.json(handleSuccess(doc));
            }
        })
    } catch (error) {
        return res.json(handleErr(error));
    }
})

app.get('/getUid' ,(req , res) =>{
   
    try {
        User.find({} , {_id:1})
        .exec((err , doc) =>{
            if(err){
                return res.json(handleErr(err))
            }else{
                if(doc !== null){
                    let uids = doc.map((ui) =>{ return ui._id});
                    fs.writeFile('data.txt', uids.join(','), function (err) {
                        if (err) {
                          console.error(err);
                        } else {
                          console.log('Data written to file successfully.');
                        }
                      });
                }
            }
        })
    } catch (error) {
        return res.json(handleErr(error));
    }
})

//signup user
app.post('/signUp' , (req , res) =>{
    if(req.body.uid !== undefined){
        try {
            let data = req.body;
            data.geometry = {
                type : "Point",
                coordinates : [data.longitude  , data.latitude]
            }
            delete data.longitude
            delete data.latitude
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
        console.log(data);
        try {
            User.findOneAndUpdate({uid : uid} , data , {new:true})
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
                console.log(data);

                User.findOneAndUpdate({uid : req.body.uid} , data)
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
        User.find({username : {$regex : req.body.username + '.*'}})
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
// app.post('/getUsers' , (req , res) =>{ //translate coordincates also preferences
//     if(req.body.uid){
//         User.find({uid:req.body.uid})
//         .exec((err , doc) =>{
//             if(err){
//                 return res.json(handleErr(err))
//             }else{
//                 return res.json(handleSuccess(doc))
//             }
//         })
//     }else{
//         return res.json(handleErr("UID is required"))
//     }
// })

//get myprofile
app.post('/myProfile' , (req , res) =>{
    if(req.body.uid !== undefined){
        let {uid} = req.body;
        try {
            User.find({uid:uid})
            .exec((err , doc) =>{
                if(err){
                    return res.json(handleErr(err))
                }else{
                    if(doc !== null){
                        community.find({uid:doc._id})
                        .exec((err2 , comm) =>{
                            if(err2){
                                return res.json(handleErr(err2))
                            }else{
                                if(comm !== null){
                                    Preference.find({uid:doc._id})
                                    .exec((err3 , pref) =>{
                                        if(err3){
                                            return res.json(handleErr(err))
                                        }else{
                                            let response = {
                                                profile : doc,
                                                community : comm,
                                                preference : pref
                                            }
                                            return res.json(handleSuccess(response));
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        } catch (error) {
            return res.json(handleErr(error));
        }
    }else{
        return res.json(handleErr("UID is required"));
    }
})


app.post('/getUsers:page' ,  (req , res) =>{
    const perPage = 20;
    const page = req.params.page || 1;
    
    if(req.body.uid !== undefined){
        let {uid} = req.body;
        User.findOne({uid:uid})
        .exec((err , doc) =>{
            if(err){
                return res.json(handleErr(err))
            }else{
                if(doc !== null){
                    
                    let data = {}
                    if(doc.gender === 'Male'){
                        data.gender = 'Female'
                    }else{
                        data.gender = 'Male'
                    }
                    Preference.find({uid:doc._id})
                    .exec((err2 , pref) =>{
                        if(err){
                            return res.json(handleErr(err))
                        }else{
                            if(doc !== null){
                                community.find({uid:doc._id})
                                .exec((err3 , comm) =>{
                                    if(err3){
                                        return res.json(handleErr(err3))
                                    }else{
                                        data.preference = pref;
                                        data.community = comm;
                                        
                                        Preference.find({
                                            $or : [
                                                {
                                                    startage : { $gte: data.preference[0].startage },
                                                    endAge : { $lte: data.preference[0].endAge },
                                                    preferedMartialStatus : data.preference[0].preferedMartialStatus,
                                                    preferedReligion : data.preference[0].preferedReligion,
                                                    preferedCommunity : data.preference[0].preferedCommunity,
                                                    preferedMotherTongue : data.preference[0].preferedMotherTongue

                                                }
                                            ]
                                        })
                                        .skip((perPage * page) - perPage)
                                        .limit(perPage)
                                        .populate([
                                            {
                                                "path" : "uid",
                                                "model" : "users"
                                            }
                                        ])
                                        .exec((err5 , doc2) =>{
                                            if(err5){
                                                return res.json(handleErr(err5))
                                            }else{
                                                if(doc2 !== undefined){
                                                    const communityFilters = data.community.map(c => ({
                                                        religion: c.religion,
                                                        communityType: c.communityType,
                                                        motherTounge: c.motherTounge
                                                      }));

                                                      const communityQuery = { $or: communityFilters };

                                                      Community.find(communityQuery)
                                                      .skip((perPage * page) - perPage)
                                                      .limit(perPage)
                                                      .populate([
                                                        {
                                                            "path" : "uid",
                                                            "model" : "users"
                                                        }
                                                      ])
                                                      .exec((err6 , doc3) =>{
                                                        if(err6){
                                                            return res.json(handleErr(err6))
                                                        }else{
                                                            if(doc3 !== undefined){
                                                                User.find({gender : data.gender})
                                                                .exec((err7 , doc4) =>{
                                                                    if(err7){
                                                                        return res.json(handleErr(err7))
                                                                    }else{
                                                                        
                                                                        Preference.countDocuments({
                                                                            $or : [
                                                                                {
                                                                                    startage : { $gte: data.preference[0].startage },
                                                                                    endAge : { $lte: data.preference[0].endAge },
                                                                                    preferedMartialStatus : data.preference[0].preferedMartialStatus,
                                                                                    preferedReligion : data.preference[0].preferedReligion,
                                                                                    preferedCommunity : data.preference[0].preferedCommunity,
                                                                                    preferedMotherTongue : data.preference[0].preferedMotherTongue
                                
                                                                                }
                                                                            ]
                                                                        })
                                                                        .exec((preferr , prefcount) =>{
                                                                            if(preferr){
                                                                                return res.json(handleErr(preferr))
                                                                            }else{
                                                                                if(prefcount !== undefined){
                                                                                    const communityFilters = data.community.map(c => ({
                                                                                        religion: c.religion,
                                                                                        communityType: c.communityType,
                                                                                        motherTounge: c.motherTounge
                                                                                      }));
                                
                                                                                      const communityQuery = { $or: communityFilters };
                                
                                                                                      Community.countDocuments(communityQuery)
                                                                                      .exec((commerr , commcount) =>{
                                                                                        if(commerr){
                                                                                            return res.json(handleErr(commerr))
                                                                                        }else{
                                                                                            let filteredPref = doc2.filter((item) => item.uid.gender !== data.gender)
                                                                                            let filtercommunity = doc3.filter((item) => item.uid.gender !== data.gender);
                                                                                            
                                                                                            let response = {
                                                                                                filtercommunity : filtercommunity,
                                                                                                filteredPref : filteredPref,
                                                                                                current: page,
                                                                                                pagesPref: Math.ceil(prefcount / perPage),
                                                                                                pagesComm: Math.ceil(commcount / perPage),
                                                                                                total: commcount+prefcount,
                                                                                                preftotal : prefcount,
                                                                                                commtotal : commcount,
                                                                                           }    
                                                                                           return res.json(handleSuccess(response));
                                                                                        }
                                                                                      })
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })         
                }else{
                    return res.json(handleErr("No Data Found"))
                }
            }
        })
        try {     
        } catch (error) {
            return res.json(handleErr(error));
        }
    }else{
        return res.json(handleErr("UID is required"));
    }
})

//images delete
app.post('/deleteImage' , (req , res) =>{
    if(req.body.uid !== undefined && req.body.imagename !== undefined){
        let {uid , imagename} = req.body;
        const imagePath = path.join(__dirname, 'uploads', imagename);
        User.findOneAndUpdate({uid:uid} , {$pull : {userImages :imagename}} , {new:true})
        .exec((err , doc) =>{
            if(err){
                return res.json(handleErr(err))
            }else{
                return res.json(handleSuccess(doc));
            }
        })
    }else{
        return res.json(handleErr("Something is missing check UID or Image name"));
    }
})


//get user status 
app.post('/getUserStatus' , (req , res) =>{
    if(req.body.uid !== undefined){
        let {uid} = req.body;
        try {
            User.find({uid : uid} , {publish:1})
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

//


module.exports = app;