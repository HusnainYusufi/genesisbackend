const mongoose = require('mongoose');

const hobbiesSchema = mongoose.Schema({
 
    hobby : {
        type : String,
    },

    type : {
        type : String
    }
})

const qualificationSchema  = mongoose.Schema({
    createdAt : {

    },
    qualificationType : {
        type : String,
        default : ""
    },
    collegeOne : {
        type : String,
        default : ""
    },
    collegeTwo : {
        type : String,
        default : ""
    }


})

const communitySchema = mongoose.Schema({
    createdAt : {
        type : Date,
        default : Date.now()
    },
    religion : {
        type : String,
        default : ""
    },
    communityType : {
        type : String,
        default : ""
    },
    motherTounge : {
        type : String,
        default : ""
    }

})

const preferencesSchema = mongoose.Schema({
    createdAt : {
        type : Date,
        default : Date.now()
    },
    ageRange : { //parse it into int
        type : String,
        default : ""
    },
    heightRange : { //parse it into int
        type : String,
        default : ""
    },
    preferedMartialStatus : {
        type :  String,
        default : ""
    },
    preferedReligion : {
        type : String,
        default : ""
    },
    preferedCommunity : {
        type : String,
        default : ""
    },
    preferedMotherTongue : {
        type : String,
        default : ""
    }
});

const locationSchema = mongoose.Schema({

    type : {
       type : String,
       default : 'Point'
    },
    coordinates : {
       type :  [Number],
       index : '2dsphere',
       default: [0, 0]
    }
 
 });

const userSchema = mongoose.Schema({

    createdAt : {
        type : Date,
        default : Date.now()
    },
    username : {
        type : String
    },
    email : {
        type : String
    },
    uid : {
        type : String
    },
    defaultImg : [String],
    userImages : [String],
    provider : {
        type : String
    },
    profileFor : {
        type : String
    },
    phone : {
        type : String,
        default : ""
    },
    country : {
        type : String,
        default : ""
    },
    state : {
        type : String,
        default : ""
    },
    city : {
        type : String,
        default : ""
    },
    marialStatus : {
        type : String,
        default : ""
    },
    diet : {
        type : String,
        default : ""
    },
    height : { //parsing is done on backend
        type : Number,
    }, 
    qualification : [qualificationSchema],
    employment : {
        type : String,
        default : ""
    },
    designation : {
        type : String,
        default : ""
    },
    ownBuisness : {
        type : String,
        default : ""
    },
    anualIncome : {
        type : String,
        default : ""
    },
    hobbies : [hobbiesSchema],
    isArchive : {
        type : Boolean,
        default : false
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    isPromoted : {
        type : Boolean,
        default : false
    },
    gender : {
        type : String,
        default : ""
    },
    bio : {
        type : String,
        default : ""
    },
    age  : {
        type : Number,
        min : 0
    },
    geometry : locationSchema,
    community  : [communitySchema],
    preference : [preferencesSchema],
    subscription : {
        type : mongoose.Schema.Types.ObjectId,
        ref : ""
    },
    publish : {
        type : String,
        default : "Pending"
    }
})

userSchema.index({username : 'text'});

module.exports = mongoose.model("users" , userSchema);