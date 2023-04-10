const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({

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

    password : {
        type : String
    },
    
    role : {
        type : String
    }
})

module.exports = mongoose.model("admins" , adminSchema);