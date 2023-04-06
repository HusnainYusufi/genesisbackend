const mognoose = require('mongoose');

const preferenceSchema = mognoose.Schema({

    createdAt : {
        type : Date,
        default : Date.now()
    },
    uid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    startage : {
        type : Number,
        default : 0
    },
    endAge : {
        type : Number,
        default : 0
    },
    startHeight : {
        type : String,
        default : ""
    },
    endHeight : {
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
})

module.exports = mongoose.model("preferences" , preferenceSchema)