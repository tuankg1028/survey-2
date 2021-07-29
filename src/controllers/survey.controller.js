import Models from "../models";
import _ from "lodash";
import Utils from "../utils";
import Services from "../services";
import * as constants from "../utils/constants";

const TOTAL_TRAINING = 20;
const TOTAL_TESTING = 20;
class SurveyController {
  async getSurvey(req, res, next) {
    try {
      const { email } = req.session.user || {};
      if (!email) res.redirect("/auth/login");

      res.render("survey/templates/survey-intro", {
        pageName: "Basic information",
        email
      });
    } catch (error) {
      next(error);
    }
  }

  async handleIntroSurvey(req, res, next) {
    try {
      const {
        email,
        age,
        gender,
        education,
        occupation,
        fieldOfWork,
        country
      } = req.body;

      const user = await Models.User.create(
        email,
        age,
        gender,
        education,
        occupation,
        fieldOfWork,
        country
      );

      const token = Services.Authentication.genToken(user.toJSON());
      req.session.token = token;

      res.redirect("/questions");
    } catch (error) {
      next(error);
    }
  }

  async getSuccess(req, res, next) {
    try {
      res.render("survey/templates/survey-success");
    } catch (error) {
      next(error);
    }
  }

  async handleAnswer(req, res, next) {
    try {
      return res.redirect("/success");
      const { _id: userId } = req.user;
      // get questions (intro)
      const data = JSON.parse(req.body.data);

      // const data = Utils.Function.objectToArray(req.body);
      const apps = [];
      for (const appId in data.questions) {
        // nodes
        const nodes = data.questions[appId];
        const { name: appName } = await Models.App.findById(appId).cache(
          60 * 60 * 24 * 30
        ); // 1 month

        // loop nodes
        const nodeData = [];
        for (const nodeName in nodes) {
          if (
            nodeName === "group" ||
            nodeName === "final" ||
            nodeName === "time"
          )
            continue;

          const leafNodes = nodes[nodeName];
          // leaf node
          const leafNodesData = [];
          for (const leafNodeName in leafNodes) {
            if (leafNodeName === "group" || leafNodeName === "final") continue;

            const leafNodeValue = leafNodes[leafNodeName];
            leafNodesData.push({
              name: leafNodeName,
              response: leafNodeValue
            });
          }

          nodeData.push({
            name: nodeName,
            // response: leafNodes.final,
            leafNodes: leafNodesData
          });
        }
        // data
        apps.push({
          name: appName,
          appId,
          time: nodes.time,
          nodes: nodeData,
          response: nodes.final
        });
      }

      // categories
      let categories = [];
      if (Array.isArray(data.categories)) {
        categories = data.categories;
      } else {
        categories = data.categories ? [data.categories] : [];
      }
      // create
      await Models.Answer.create({
        apps,
        userId,

        comment: data.comment,
        categories
      });

      res.json({
        message: "Created successfully"
      });
    } catch (error) {
      next(error);
    }
  }
  async getQuestions(req, res, next) {
    try {
      const user = req.user;
      let questionIds;

      const refreshUser = await Models.User.findById(user.id);

      // question
      const currentQuestionId =
        req.query.questionId || refreshUser.nextQuestionId;
      const previousQuestionId = Utils.Question.getQuestionId(
        currentQuestionId,
        refreshUser.questionIds,
        "previous"
      );

      // stage
      const currentStage = Utils.Question.getStageByQuestionId(
        currentQuestionId,
        refreshUser.questionIds
      );
      const previousStage = Utils.Question.getStageByQuestionId(
        previousQuestionId,
        refreshUser.questionIds
      );

      if (refreshUser.questionIds && refreshUser.questionIds.length)
        questionIds = refreshUser.questionIds;
      else {
        let tranningIds = await Models.Question.aggregate([
          { $sample: { size: TOTAL_TRAINING } },
          { $project: { _id: 1 } }
        ]);
        tranningIds = _.map(tranningIds, "_id");

        let testingIds = await Models.Question.aggregate([
          { $sample: { size: TOTAL_TESTING - 4 } },
          { $project: { _id: 1 } },
          {
            $match: {
              _id: {
                $nin: tranningIds
              }
            }
          }
        ]);
        testingIds = _.map(testingIds, "_id");

        questionIds = [
          ...tranningIds,
          // test 1
          ...testingIds.splice(0, 4),
          ...tranningIds.slice(0, 1),
          // test 2
          ...testingIds.splice(0, 4),
          ...tranningIds.slice(1, 2),
          // test 3
          ...testingIds.splice(0, 4),
          ...tranningIds.slice(2, 3),
          // test 4
          ...testingIds.splice(0, 4),
          ...tranningIds.slice(3, 4)
        ];

        await Models.User.updateOne(
          {
            _id: user.id
          },
          {
            $set: {
              questionIds
            }
          },
          {}
        );
      }

      let questions = await Utils.Question.getQuestionsByStage(
        questionIds,
        refreshUser,
        currentStage,
        currentQuestionId
      );
      const isShowComment =
        currentStage !== constants.STAGES.training &&
        Utils.Question.showComment(
          currentQuestionId,
          currentStage,
          questionIds
        );
      const indexQuestionInStage = Utils.Question.getIndexOfQuestionInStage(
        currentQuestionId,
        questionIds
      );

      const questionsAnswered =
        currentStage === constants.STAGES.training
          ? refreshUser.questions.slice(0, 20)
          : refreshUser.questions.slice(20);
      // map question to answered
      questions = questions.map(question => {
        const questionAnswered = questionsAnswered.find(
          item => item._id.toString() === question._id.toString()
        );

        let responses = {};
        if (questionAnswered) {
          let { responses: responsesQuestion } = questionAnswered.toJSON();

          responses = responsesQuestion.reduce((acc, item) => {
            acc[item.name] = item.value;

            return acc;
          }, {});
        }

        return { ...question, responses };
      });

      res.render("survey/templates/survey-question", {
        questions,
        lastQuestion: _.last(questions),
        // question
        previousQuestionId,
        isShowComment,
        // stage
        currentStage,
        previousStage,
        indexQuestionInStage
      });
    } catch (error) {
      next(error);
    }
  }

  async handleQuestions(req, res, next) {
    try {
      const { id: userId } = req.user;
      const { questions, currentStage } = req.body;

      const user = await Models.User.findById(userId);
      let {
        questions: oldQuestions,
        questionIds,
        nextQuestionId: currentQuestionId
      } = user;

      currentQuestionId =
        req.query.questionId ||
        _.last(Object.keys(questions)) ||
        currentQuestionId;

      const nextQuestionId = Utils.Question.getQuestionId(
        currentQuestionId,
        questionIds,
        "next"
      );

      let nextStage;
      if (
        currentStage === constants.STAGES.testing4 &&
        Utils.Question.getIndexOfQuestionInStage(
          currentQuestionId,
          questionIds
        ) === 4
      ) {
        nextStage = constants.STAGES.end;
      } else {
        nextStage = Utils.Question.getStageByQuestionId(
          nextQuestionId,
          questionIds
        );
      }

      // get answers
      const newQuestions = [...oldQuestions];
      for (const questionId in questions) {
        const responses = questions[questionId];

        const answerData = [];
        for (const questionName in responses) {
          const answerValue = responses[questionName];

          answerData.push({
            name: questionName,
            value: answerValue
          });
        }

        const indexQuestion = newQuestions.findIndex(
          (item, index) =>
            item._id.toString() === questionId &&
            ((currentStage === constants.STAGES.training && index < 10) ||
              (currentStage !== constants.STAGES.training && index >= 10))
        );

        if (
          ~indexQuestion &&
          ((currentStage === constants.STAGES.training && indexQuestion < 10) ||
            (currentStage !== constants.STAGES.training && indexQuestion >= 10))
        ) {
          newQuestions[indexQuestion].responses = answerData;
        } else {
          newQuestions.push({
            _id: questionId,
            responses: answerData
          });
        }
      }

      // update anwsers
      await Models.User.updateOne(
        {
          _id: userId
        },
        {
          $set: {
            nextStage,
            nextQuestionId,
            questions: newQuestions
          }
        },
        {}
      );

      return nextStage === constants.STAGES.end
        ? res.redirect("/success")
        : res.redirect("/");
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      let users = await Models.User.find({}, "email fullName").populate({
        path: "answers",
        select: { _id: 1 }
      });
      let content = "";
      for (let i = 0; i < users.length; i++) {
        const { email, fullName, answers } = users[i];

        if (answers.length > 0) {
          content += `<div>${fullName}-${email}</div>`;
        }
      }
      res.send(content);
    } catch (error) {
      next(error);
    }
  }
}
// (new SurveyController()).getQuestions()
export default SurveyController;
