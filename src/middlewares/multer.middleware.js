import multer from "multer";

class MulterMidleware {
  constructor() {
    this.upload = multer({
      fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|ico|svg)$/)) {
          return cb(
            new Error("Only image files are allowed! ex: jpg|jpeg|png|gif")
          );
        }
        if (file.size >= 5242880) {
          // 5MB
          return cb(new Error("More than size!"));
        }
        cb(null, true);
      }
    });
  }
  // upload single file
  singleFile(fieldName = "image") {
    this.upload.array("");
    return this.upload.single(fieldName);
  }

  arrayFile(fieldName = "images") {
    return this.upload.array(fieldName);
  }

  // @arrayFiels [{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]
  fields(arrayFiels = []) {
    return this.upload.fields(arrayFiels);
  }
  any(arrayFiels = []) {
    return this.upload.any();
  }
}

export default MulterMidleware;
