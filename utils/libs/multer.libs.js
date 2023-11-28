const multer = require('multer');
const path = require('path');

function generateFilter(props) {
  try {
    let { allowedMimeTypes } = props;
    return multer({
      fileFilter: (req, file, callback) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          const err = new Error(`!only ${allowedMimeTypes.join(',')} allowed to upload`);
          return callback(err, false);
        }
        callback(null, true);
      },
      onError: (err, next) => {
        next(err);
      },
    });
  } catch (err) {
    return err.message;
  }
}

module.exports = {
  image: generateFilter({
    allowedMimeTypes: ['image/png', 'image/jpeg'],
  }),
};
