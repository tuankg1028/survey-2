import AuthenticationService from "./authentication.service";
import TokenService from "./token.service";
import Prediction from "./prediction.service";
class Service {
  constructor() {
    this.Authentication = new AuthenticationService();
    this.Prediction = new Prediction();
    // this.Token = new TokenService();
  }
}
export default new Service();
