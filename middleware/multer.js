const multer = require('multer');

module.exports = function (req, res, next) {
  let upload = multer({
    storage: multer.diskStorage({}),
    limits: {
      fileSize: 1024 * 1024, // 1 MB (max file size)
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/jpe|jpeg|png|gif$i/)) {
        cb(new Error('File is not supported'), false)
        return
      }

      cb(null, true)
    }
  }).single('imageFile');

  upload(req, res, function (err) {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    }
    // else if (req.file.size) {
    //   return res.send(err);
    // }

    else if (err instanceof multer.MulterError) {
      return res.send(err);
    }
    else if (err) {
      return res.send(err);
    }
    else if (!req.file) {
      if (req.method !== 'PUT') return res.send('Please select an image to upload');
    }
    next();
  });
}
