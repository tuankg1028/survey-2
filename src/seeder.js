const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
import "./configs/mongoose.config";
import Models from "./models";
import questionJson from "./question.json";
import chalk from "chalk";

async function main() {
  await Models.Question.deleteMany({});

  questionJson.forEach(question => {
    question.text = `You are playing ${question.name}. Do you allow to share your ${question.lv3.name} to collect your ${question.subItem.name}? (Information collected)`;
    Models.Question.insertMany([question]);
  });
}
// main();
