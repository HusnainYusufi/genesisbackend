const mongoose  = require('mongoose');



const packagesSchema  = mongoose.Schema({
    
    createdAt : {
        type : Date,
        default : Date.now()
    },
    type : {
        type : String,
        default : ""
    },
    description : {
        type : String,
        default : ""
    },
    amount : {
        type : Number,
        min : 0
    },
    endDate : {
        type : Date
    }

})

module.exports = mongoose.model("packages" , packagesSchema);