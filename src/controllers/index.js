import AuthController from "./auth.controller";
import SurveyController from "./survey.controller";

class Controller {
  constructor() {
    this.Auth = new AuthController();
    this.Survey = new SurveyController();
  }
}

export default new Controller();
