const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        let name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({storage: storage});

module.exports = {
    saveImage: upload.single('image'),
    saveImages: upload.array('image', 10),
}