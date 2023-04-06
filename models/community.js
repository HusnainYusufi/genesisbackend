const mongoose = require('mongoose');

const communitySchema = mongoose.Schema({
    createdAt : {
        type : Date,
        default : Date.now()
    },
    uid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
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

module.exports = mongoose.model("communities" , communitySchema);