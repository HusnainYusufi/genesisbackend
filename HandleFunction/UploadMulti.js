const multer = require('multer')
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const uploadMult = multer({ storage: storage }).array('files', 30);

module.exports = uploadMult
