const multer = require('multer');
const path = require('path')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/'))
  },
    filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  },
});

const subirArchivo = multer({ storage: storage })
module.exports = subirArchivo