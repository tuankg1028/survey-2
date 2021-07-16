import AuthValidator from "./auth.validator";

class Validator {
  constructor() {
    this.Auth = new AuthValidator();
  }
}

export default new Validator();
