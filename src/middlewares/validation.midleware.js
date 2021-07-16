import { validationResult } from "express-validator";
import Utils from "../utils";

class Validation {
  validateInput(req, res, next) {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return Utils.Error.ERR_400(res, errors.array());
    } else {
      next();
    }
  }
}

export default Validation;
