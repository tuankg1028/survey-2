import { STAGES, TOTAL_TRAINING } from "../utils/constants";
import Utils from "../utils";
import Models from "../models";
async function getQuestionsByStage(
  questionIds,
  user,
  stage = "training",
  nextQuestionId
) {
  let stageQuestionIds = [];
  let algorithm;
  let trainingIds = questionIds.slice(0, 20);
  let testingIds = questionIds.slice(20, 40);
  switch (stage) {
    case STAGES.testing1: {
      algorithm = "SVM";
      stageQuestionIds = [nextQuestionId];
      // stageQuestionIds = questionIds.slice(20, 25);
      // get extra tranning questions
      const indexOfNextQuestion = testingIds.indexOf(nextQuestionId);
      trainingIds = [
        ...trainingIds,
        ...questionIds.slice(20, TOTAL_TRAINING + indexOfNextQuestion)
      ];
      break;
    }
    case STAGES.testing2: {
      algorithm = "GradientBoostingClassifier";
      stageQuestionIds = [nextQuestionId];
      // stageQuestionIds = questionIds.slice(25, 30);
      const indexOfNextQuestion = testingIds.indexOf(nextQuestionId);
      trainingIds = [
        ...trainingIds,
        ...questionIds.slice(25, TOTAL_TRAINING + indexOfNextQuestion)
      ];
      break;
    }
    case STAGES.testing3: {
      algorithm = "AdaBoostClassifier";
      stageQuestionIds = [nextQuestionId];
      // stageQuestionIds = questionIds.slice(30, 35);
      const indexOfNextQuestion = testingIds.indexOf(nextQuestionId);
      trainingIds = [
        ...trainingIds,
        ...questionIds.slice(30, TOTAL_TRAINING + indexOfNextQuestion)
      ];
      break;
    }
    case STAGES.end:
    case STAGES.testing4: {
      algorithm = "GradientBoostingRegressor";
      // stageQuestionIds = questionIds.slice(35, 40);
      stageQuestionIds = [nextQuestionId];

      const indexOfNextQuestion = testingIds.indexOf(nextQuestionId);
      trainingIds = [
        ...trainingIds,
        ...questionIds.slice(35, TOTAL_TRAINING + indexOfNextQuestion)
      ];
      break;
    }

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
        ? `You are playing <b>${question.name}</b>. Do you allow to share your <b>${question.lv3.name}</b> with you <b>${question.subItem.name}</b>?`
        : `You are playing <b>${question.name}</b>. Do you allow to share your <b>${question.lv3.name}</b> to collect your <b>${question.subItem.name}</b>?`;
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
        ourPrediction: prediction
      };
    });
  }
  return questions;
}

function getQuestionIdsByStage(stage, questionIds) {
  switch (stage) {
    case STAGES.training:
      return questionIds.slice(0, 20);
    case STAGES.testing1:
      return questionIds.slice(20, 25);
    case STAGES.testing2:
      return questionIds.slice(25, 30);
    case STAGES.testing3:
      return questionIds.slice(30, 35);
    default:
      return questionIds.slice(35, 40);
  }
}
function getQuestionId(current, questionIds, type = "next") {
  const stage = getStageByQuestionId(current, questionIds);
  if (stage === STAGES.training)
    return type === "next" ? questionIds[TOTAL_TRAINING] : undefined;

  const testQuestionIds = questionIds.slice(20, 40);
  const indexOfCurrent = testQuestionIds.indexOf(current);

  if (!~indexOfCurrent) return;

  return questionIds[
    indexOfCurrent + TOTAL_TRAINING + (type === "next" ? 1 : -1)
  ];
}

function showComment(questionId, stage, questionIds) {
  const questionIdsByStage = getQuestionIdsByStage(stage, questionIds);

  return questionIdsByStage.indexOf(questionId) === 4;
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

function getStageByQuestionId(questionId, questionIds) {
  if (!questionId) return STAGES.training;

  const testQuestionIds = questionIds.slice(20, 40);
  const index = testQuestionIds.indexOf(questionId);

  if (index === -1) return STAGES.training;
  else if (index < 5) return STAGES.testing1;
  else if (index < 10) return STAGES.testing2;
  else if (index < 15) return STAGES.testing3;
  else if (index < 20) return STAGES.testing4;
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

function getIndexOfQuestionInStage(current, questionIds) {
  const stage = getStageByQuestionId(current, questionIds);
  const questionIdsByStage = getQuestionIdsByStage(stage, questionIds);

  return questionIdsByStage.indexOf(current);
}
export default {
  getQuestionsByStage,
  getNextStage,
  getPreviousStage,
  getQuestionId,
  showComment,
  getStageByQuestionId,
  getIndexOfQuestionInStage
};
