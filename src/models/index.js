import userModel from "./user.model";
import answerModel from "./answer.model";
import questionModel from "./question.model";

class Model {
  constructor() {
    this.User = userModel;
    this.Answer = answerModel;
    this.Question = questionModel;
  }
}
export default new Model();
