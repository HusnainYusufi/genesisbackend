const multer = require('multer')
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        const newExt = '.webp';
        const newFilename = file.fieldname + '-' + Date.now() + newExt;
        callback(null, newFilename);
    }
});
const uploadMult = multer({ storage: storage }).array('files', 30);

module.exports = uploadMult
