const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    
    destination: function(request , file , callback){
        callback(null , './uploads');
    },
    filename : function(request , file , callback){
        
        callback(null , file.fieldname +'-'+Date.now() + path.extname(file.originalname))
    }

})

const upload = multer({storage:storage});

module.exports = upload