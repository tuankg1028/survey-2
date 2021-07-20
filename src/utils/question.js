import { STAGES } from "../utils/constants";
import Utils from "../utils";
import Models from "../models";
async function getQuestionsByStage(questionIds, user, stage = "training") {
  let stageQuestionIds = [];
  let algorithm;
  const trainingIds = questionIds.slice(0, 20);
  switch (stage) {
    case STAGES.testing1:
      algorithm = "SVM";
      stageQuestionIds = questionIds.slice(20, 25);
      break;
    case STAGES.testing2:
      algorithm = "GradientBoostingClassifier";
      stageQuestionIds = questionIds.slice(25, 30);
      break;
    case STAGES.testing3:
      algorithm = "AdaBoostClassifier";
      stageQuestionIds = questionIds.slice(30, 35);

      break;
    case STAGES.end:
    case STAGES.testing4:
      algorithm = "GradientBoostingRegressor";
      stageQuestionIds = questionIds.slice(35, 40);
      break;
    default:
      stageQuestionIds = trainingIds;
      break;
  }

  let questions = await Promise.all(
    stageQuestionIds.map(id =>
      Models.Question.findById(id).cache(60 * 60 * 24 * 30)
    )
  );

  // convert questions
  questions = questions.map(question => {
    const text =
      question.subItem.type === "permission"
        ? `You are playing ${question.name}. Do you allow to share your ${question.lv3.name} with you ${question.subItem.name}?`
        : `You are playing ${question.name}. Do you allow to share your ${question.lv3.name} to collect your ${question.subItem.name}?`;
    return {
      ...question.toJSON(),
      _id: question._id,
      text
    };
  });

  // get prediction
  if (stage !== STAGES.training && algorithm) {
    const predictions = await Promise.all(
      questions.map(question =>
        Utils.Function.getOurPredictionApproach1(
          trainingIds,
          user,
          question,
          algorithm
        )
      )
    );

    questions = predictions.map((prediction, index) => {
      return {
        ...questions[index],
        ourPrediction: 0
      };
    });
  }
  return questions;
}

function getNextStage(current) {
  switch (current) {
    case STAGES.training:
      return STAGES.testing1;
    case STAGES.testing1:
      return STAGES.testing2;
    case STAGES.testing2:
      return STAGES.testing3;
    case STAGES.testing3:
      return STAGES.testing4;
    default:
      return STAGES.end;
  }
}

function getPreviousStage(current) {
  switch (current) {
    case STAGES.testing1:
      return STAGES.training;
    case STAGES.testing2:
      return STAGES.testing1;
    case STAGES.testing3:
      return STAGES.testing2;
    case STAGES.end:
    case STAGES.testing4:
      return STAGES.testing3;
  }
}
export default { getQuestionsByStage, getNextStage, getPreviousStage };
