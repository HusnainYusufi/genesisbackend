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
        type : Date,
        default : Date.now()
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

 const purchaseHistorySchema = mongoose.Schema({
    createdAt : {
        type : Date,
        default : Date.now()
    },
    paymentMethod:{
        type:String
    },
    transactionId:{
        type:String
    },
    amount:{
        type:Number,
        min:0
    }

 })

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
        type : String,
        default : ""
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
    height : { //parsing is done on backend 5'11"
        type : String,
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
    community  : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "communities"
    },
    preference : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "preferences"
    },
    subscription : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "package"
    },
    publish : {
        type : String,
        default : "Pending"
    },
    purchaseHistory : [purchaseHistorySchema]
})

userSchema.index({username : 'text'});

module.exports = mongoose.model("users" , userSchema);