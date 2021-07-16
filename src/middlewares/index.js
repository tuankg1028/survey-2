import AuthMiddleware from "./auth.middleware";
import ValidationMiddleware from "./validation.midleware";
class Middleware {
  constructor() {
    this.Auth = new AuthMiddleware();
    this.Validation = new ValidationMiddleware();
    // this.Multer = new MulterMiddleware();
  }
}

export default new Middleware();
