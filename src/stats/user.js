const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
import "../configs/mongoose.config";
import Models from "../models";
import rq from "request-promise";
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
import _, { isNumber } from "lodash";
import fs from "fs";
// số lượng người tham gia theo độ tuổi, quốc gia, giới tính và vùng (có 5 vùng) nha em
function getRegionByCampaignId(campaignId) {
  const regions = {
    "0d3a745340d0": "Europe East",
    "99cf426fa790": "Latin America",
    "7cfcb3709b44": "Europe West",
    "4d74caeee538": "Asia - Africa",
    e0a4b9cf46eb: "USA - Western"
  };
  return regions[campaignId];
}
async function file1(type) {
  const result = { ages: {}, countries: {}, genders: {}, regions: {} };
  const users = await Models.User.find({
    type
  });
  if (type === "normal") {
    users.forEach(function({ age, country, gender }) {
      if (Number(age) >= 0) {
        age = Number(age);
      }
      if (age >= 0 && age <= 20) age = "[0;20]";
      else if (age > 20 && age <= 30) age = "[20;30]";
      else if (age > 30 && age <= 40) age = "[30;40]";
      else if (age > 40) age = ">40";
      result.ages[age] ? result.ages[age]++ : (result.ages[age] = 1);
      result.countries[country.trim()]
        ? result.countries[country.trim()]++
        : (result.countries[country.trim()] = 1);

      result.genders[gender]
        ? result.genders[gender]++
        : (result.genders[gender] = 1);
    });
  } else {
    users.forEach(({ age, country, gender, campaignId }) => {
      result.ages[age] ? result.ages[age]++ : (result.ages[age] = 1);
      result.countries[country.trim()]
        ? result.countries[country.trim()]++
        : (result.countries[country.trim()] = 1);

      result.genders[gender]
        ? result.genders[gender]++
        : (result.genders[gender] = 1);

      result.countries[country.trim()]
        ? result.countries[country.trim()]++
        : (result.countries[country.trim()] = 1);

      const region = getRegionByCampaignId(campaignId);
      result.regions[region]
        ? result.regions[region]++
        : (result.regions[region] = 1);
    });
  }

  let content = `
    * Ages: 
        - [0;20]: ${result.ages["[0;20]"]} (${(
    (result.ages["[0;20]"] / users.length) *
    100
  ).toFixed(2)}%)

        - [20;30]: ${result.ages["[20;30]"]} (${(
    (result.ages["[20;30]"] / users.length) *
    100
  ).toFixed(2)}%)

        - [30;40]: ${result.ages["[30;40]"]} (${(
    (result.ages["[30;40]"] / users.length) *
    100
  ).toFixed(2)}%)
            
        - [>40]: ${result.ages[">40"]} (${(
    (result.ages[">40"] / users.length) *
    100
  ).toFixed(2)}%)

    * Genders: 
        - Male: ${result.genders["male"]} (${(
    (result.genders["male"] / users.length) *
    100
  ).toFixed(2)}%)

        - Female: ${result.genders["female"]} (${(
    (result.genders["female"] / users.length) *
    100
  ).toFixed(2)}%)
  `;

  // sort country by name
  content += "\n    * Countries: \n";
  _.sortBy(Object.entries(result.countries), [
    function(o) {
      return o[0];
    }
  ]).forEach(([country, value]) => {
    content += `        - ${country}: ${value} (${(
      (value / users.length) *
      100
    ).toFixed(2)}%) \n`;
  });

  // region
  if (!_.isEmpty(result.regions)) {
    content += "\n    * Regions: \n";
    for (const region in result.regions) {
      const value = result.regions[region];

      content += `        - ${region}: ${value} (${(
        (value / users.length) *
        100
      ).toFixed(2)}%) \n`;
    }
  }
  fs.writeFile(
    `./reports/Microworker_statistic(${
      type === "microworker" ? "microworker" : "expert"
    }).txt`,
    content,
    () => {}
  );
}

async function file23(condition, isRequiredComplete, pathFile) {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "email",
      title: "email"
    },
    {
      id: "age",
      title: "age"
    },
    {
      id: "gender",
      title: "gender"
    },
    {
      id: "fieldOfWork",
      title: "fieldOfWork"
    },
    {
      id: "education",
      title: "education"
    },
    {
      id: "country",
      title: "country"
    },
    ...Array.from({ length: 26 }, (_, i) => {
      return i + 1;
    }).map(index => {
      return {
        id: `question${index}`,
        title: `Question ${index}`
      };
    })
  ];

  const users = await Models.User.find({
    ...condition
  });

  const rows = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const answer = await Models.Answer.findOne({
      userId: user.id
    });

    if (
      isRequiredComplete &&
      ((answer && answer.questions.length !== 26) || !answer)
    )
      continue;

    const questions = {};
    if (answer && answer.questions) {
      answer.questions.forEach(({ responses }, questionIndex) => {
        let itemQuestion;

        if (questionIndex >= 10)
          itemQuestion = responses.find(item => item.name === "agreePredict");
        else itemQuestion = responses.find(item => item.name === "install");

        if (itemQuestion) {
          questions[`question${questionIndex + 1}`] =
            Number(itemQuestion.value) === 1
              ? "YES"
              : Number(itemQuestion.value) === 0
              ? "NO"
              : "MAYBE";
        }
      });
    }

    rows.push({
      stt: i + 1,
      email: user.email,
      age: user.age,
      gender: user.gender,
      email: user.email,
      fieldOfWork: user.fieldOfWork,
      education: user.education,
      country: user.country,
      ...questions
    });
  }

  const csvWriter = createCsvWriter({
    path: pathFile,
    header
  });
  await csvWriter.writeRecords(rows);

  // eslint-disable-next-line no-console
  console.log("==== DONE FILE 23 ====");
}
async function main() {
  await file1("microworker");
  await file1("normal");

  await file23(
    {
      type: "microworker"
    },
    false,
    "./reports/Microworker_User(microworker).csv"
  );
  await file23(
    {
      type: "normal"
    },
    false,
    "./reports/Microworker_User(expert).csv"
  );

  await file23(
    {
      type: "microworker"
    },
    true,
    "./reports/Microworker_FinishSurvey(microworker).csv"
  );
  await file23(
    {
      type: "normal"
    },
    true,
    "./reports/Microworker_FinishSurvey(expert).csv"
  );

  console.log("Completed exporting users");
}
main();
