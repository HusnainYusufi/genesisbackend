const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({
    createdAt : {
        type : Date,
        default : Date.now()
    },
    messageType:{           //0:text,1:file, 2: Offer
        type:Number,
        default:0,
        min:0
    },
    messageSender:{         //Buyer/seller
        type:String,
        required:[true,'Message sender is required']
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
})

const chatSchema = mongoose.Schema({
    createdAt : {
        type : Date,
        default : Date.now()
    },
    sender : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    receiver : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    lastMessage:{
        type:Date
    },
    message : [MessageSchema],
    request : {
        type : Boolean,
        default : false
    }
})

module.exports = app;