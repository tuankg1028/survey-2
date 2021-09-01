const path = require("path");
const chalk = require("chalk");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
import "../configs/mongoose.config";
import Models from "../models";
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
import _ from "lodash";
import Utils from "../utils";
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

import fs from "fs";
const file1 = async type => {
  let allAnswers = await Models.Answer.find();
  allAnswers = allAnswers.filter(item => item.questions.length === 26);

  const answers = [];
  for (let i = 0; i < allAnswers.length; i++) {
    const answer = allAnswers[i];

    const user = await Models.User.findById(answer.userId);

    if (user.type === type) answers.push(answer);
  }
  // file 1
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "result",
      title: "Result"
    }
  ];
  const result = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];

    let { questions } = answer;
    questions = [
      answer.questions[13],
      answer.questions[17],
      answer.questions[21],
      answer.questions[25]
    ];
    questions.forEach((question, index) => {
      const responses = question.responses;

      const indexSatisfaction = responses.findIndex(
        item => item.name === "satisfaction"
      );

      result[index][responses[indexSatisfaction].value]++;
    });
  }

  const rows = [
    {
      stt: 1,
      result: `No: ${result[0][0]} - Yes: ${result[0][1]} - Maybe: ${result[0][2]}`
    },
    {
      stt: 2,
      result: `No: ${result[1][0]} - Yes: ${result[1][1]} - Maybe: ${result[1][2]}`
    },
    {
      stt: 3,
      result: `No: ${result[2][0]} - Yes: ${result[2][1]} - Maybe: ${result[2][2]}`
    },
    {
      stt: 4,
      result: `No: ${result[3][0]} - Yes: ${result[3][1]} - Maybe: ${result[3][2]}`
    }
  ];

  const csvWriter = createCsvWriter({
    path: `file-1 (${type === "microworker" ? "microworker" : "expert"}).csv`,
    header
  });
  await csvWriter.writeRecords(rows);
  // eslint-disable-next-line no-console
  console.log("==== DONE FILE 1 ====");
};

const file2 = async type => {
  let allAnswers = await Models.Answer.find();
  allAnswers = allAnswers.filter(item => item.questions.length === 26);

  const answers = [];
  for (let i = 0; i < allAnswers.length; i++) {
    const answer = allAnswers[i];

    const user = await Models.User.findById(answer.userId);

    if (user.type === type) answers.push(answer);
  }

  const header = [
    {
      id: "stt",
      title: "Approach Number"
    },
    {
      id: "email",
      title: "Email"
    },
    {
      id: "comment",
      title: "Comment"
    }
  ];
  let rows = [];
  for (let j = 0; j < answers.length; j++) {
    const answer = answers[j];
    let { questions, userId } = answer;
    questions = [questions[13], questions[17], questions[21], questions[25]];
    const user = await Models.User.findById(userId);

    questions.forEach((question, i) => {
      const responses = question.responses;
      const indexComment = responses.findIndex(item => item.name === "comment");

      rows.push({
        stt: i + 1,
        email: user.email,
        comment: responses[indexComment].value
      });
    });
  }
  rows = _.orderBy(rows, "stt");

  const csvWriter = createCsvWriter({
    path: `file-2 (${type === "microworker" ? "microworker" : "expert"}).csv`,
    header: header
  });
  await csvWriter.writeRecords(rows);
  // eslint-disable-next-line no-console
  console.log("==== DONE FILE 2 ====");
};

const file3 = async type => {
  let allAnswers = await Models.Answer.find();
  allAnswers = allAnswers.filter(item => item.questions.length === 26);

  const answers = [];
  for (let i = 0; i < allAnswers.length; i++) {
    const answer = allAnswers[i];

    const user = await Models.User.findById(answer.userId);

    if (user.type === type) answers.push(answer);
  }

  // file
  const header = [
    {
      id: "email",
      title: "Email"
    },
    {
      id: "appNumber",
      title: "App number"
    },
    {
      id: "satisfiedLevel",
      title: "Satisfied level"
    },
    {
      id: "correctAnswer",
      title: "Correct Answer"
    },
    {
      id: "time",
      title: "Time"
    }
  ];
  const rows1 = [];
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const user = await Models.User.findById(answer.userId);
    const questions = [
      answer.questions[10],
      answer.questions[11],
      answer.questions[12],
      answer.questions[13]
    ];

    questions.forEach(({ responses }, index) => {
      const indexInstall = responses.findIndex(item => item.name === "install");
      const indexAgreePredict = responses.findIndex(
        item => item.name === "agreePredict"
      );
      const indexOurPredict = responses.findIndex(
        item => item.name === "ourPrediction"
      );
      const indexTime = responses.findIndex(item => item.name === "time");
      rows1.push({
        email: user.email,
        appNumber: 11 + index,
        satisfiedLevel: responses[indexAgreePredict].value == 1 ? "Yes" : "No",
        correctAnswer:
          responses[indexAgreePredict].value == 1
            ? "-"
            : responses[indexInstall].value == 0
            ? "No"
            : responses[indexInstall].value == 1
            ? "Yes"
            : "Maybe",
        time: responses[indexTime].value
      });
    });
  }

  const csvWriter1 = createCsvWriter({
    path: `file-3-accuracy-approach-1 (${
      type === "microworker" ? "microworker" : "expert"
    }).csv`,
    header
  });
  await csvWriter1.writeRecords(rows1);

  //
  const rows2 = [];
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const user = await Models.User.findById(answer.userId);
    const questions = [
      answer.questions[14],
      answer.questions[15],
      answer.questions[16],
      answer.questions[17]
    ];

    questions.forEach(({ responses }, index) => {
      const indexInstall = responses.findIndex(item => item.name === "install");
      const indexAgreePredict = responses.findIndex(
        item => item.name === "agreePredict"
      );
      const indexOurPredict = responses.findIndex(
        item => item.name === "ourPrediction"
      );
      const indexTime = responses.findIndex(item => item.name === "time");
      rows2.push({
        email: user.email,
        appNumber: 15 + index,
        satisfiedLevel: responses[indexAgreePredict].value == 1 ? "Yes" : "No",
        correctAnswer:
          responses[indexAgreePredict].value == 1
            ? "-"
            : responses[indexInstall].value == 0
            ? "No"
            : responses[indexInstall].value == 1
            ? "Yes"
            : "Maybe",
        time: responses[indexTime].value
      });
    });
  }

  const csvWriter2 = createCsvWriter({
    path: `file-3-accuracy-approach-2 (${
      type === "microworker" ? "microworker" : "expert"
    }).csv`,
    header
  });
  await csvWriter2.writeRecords(rows2);

  //
  const rows3 = [];
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const user = await Models.User.findById(answer.userId);
    const questions = [
      answer.questions[18],
      answer.questions[19],
      answer.questions[20],
      answer.questions[21]
    ];

    questions.forEach(({ responses }, index) => {
      const indexInstall = responses.findIndex(item => item.name === "install");
      const indexAgreePredict = responses.findIndex(
        item => item.name === "agreePredict"
      );
      const indexOurPredict = responses.findIndex(
        item => item.name === "ourPrediction"
      );
      const indexTime = responses.findIndex(item => item.name === "time");
      rows3.push({
        email: user.email,
        appNumber: 19 + index,
        satisfiedLevel: responses[indexAgreePredict].value == 1 ? "Yes" : "No",
        correctAnswer:
          responses[indexAgreePredict].value == 1
            ? "-"
            : responses[indexInstall].value == 0
            ? "No"
            : responses[indexInstall].value == 1
            ? "Yes"
            : "Maybe",
        time: responses[indexTime].value
      });
    });
  }

  const csvWriter3 = createCsvWriter({
    path: `file-3-accuracy-approach-3 (${
      type === "microworker" ? "microworker" : "expert"
    }).csv`,
    header
  });
  await csvWriter3.writeRecords(rows3);

  //
  const rows4 = [];
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const user = await Models.User.findById(answer.userId);
    const questions = [
      answer.questions[22],
      answer.questions[23],
      answer.questions[24],
      answer.questions[25]
    ];

    questions.forEach(({ responses }, index) => {
      const indexInstall = responses.findIndex(item => item.name === "install");
      const indexAgreePredict = responses.findIndex(
        item => item.name === "agreePredict"
      );
      const indexOurPredict = responses.findIndex(
        item => item.name === "ourPrediction"
      );
      const indexTime = responses.findIndex(item => item.name === "time");
      rows4.push({
        email: user.email,
        appNumber: 23 + index,
        satisfiedLevel: responses[indexAgreePredict].value == 1 ? "Yes" : "No",
        correctAnswer:
          responses[indexAgreePredict].value == 1
            ? "-"
            : responses[indexInstall].value == 0
            ? "No"
            : responses[indexInstall].value == 1
            ? "Yes"
            : "Maybe",
        time: responses[indexTime].value
      });
    });
  }

  const csvWriter4 = createCsvWriter({
    path: `file-3-accuracy-approach-4 (${
      type === "microworker" ? "microworker" : "expert"
    }).csv`,
    header
  });
  await csvWriter4.writeRecords(rows4);
  // eslint-disable-next-line no-console
  console.log("==== DONE FILE 3 ====");
};

const file4 = async type => {
  let allAnswers = await Models.Answer.find();
  allAnswers = allAnswers.filter(item => item.questions.length === 26);

  const answers = [];
  for (let i = 0; i < allAnswers.length; i++) {
    const answer = allAnswers[i];

    const user = await Models.User.findById(answer.userId);

    if (user.type === type) answers.push(answer);
  }

  let result1 = 0;
  let resultMaybe1 = 0;

  for (let j = 0; j < answers.length; j++) {
    const answer = answers[j];
    let { questions } = answer;
    questions = [questions[10], questions[11], questions[12], questions[13]];

    questions.forEach((question, i) => {
      const responses = question.responses;
      const indexAgreePredict = responses.findIndex(
        item => item.name === "agreePredict"
      );
      const indexInstall = responses.findIndex(item => item.name === "install");
      responses[indexAgreePredict].value == 0 &&
        responses[indexInstall].value == 2 &&
        resultMaybe1++;
      responses[indexAgreePredict].value == 1 && result1++;
    });
  }

  let result2 = 0;
  let resultMaybe2 = 0;
  for (let j = 0; j < answers.length; j++) {
    const answer = answers[j];
    let { questions } = answer;
    questions = [questions[14], questions[15], questions[16], questions[17]];

    questions.forEach((question, i) => {
      const responses = question.responses;
      const indexAgreePredict = responses.findIndex(
        item => item.name === "agreePredict"
      );
      const indexInstall = responses.findIndex(item => item.name === "install");
      responses[indexAgreePredict].value == 0 &&
        responses[indexInstall].value == 2 &&
        resultMaybe2++;

      responses[indexAgreePredict].value == 1 && result2++;
    });
  }

  let result3 = 0;
  let resultMaybe3 = 0;
  for (let j = 0; j < answers.length; j++) {
    const answer = answers[j];
    let { questions } = answer;
    questions = [questions[18], questions[19], questions[20], questions[21]];

    questions.forEach((question, i) => {
      const responses = question.responses;
      const indexAgreePredict = responses.findIndex(
        item => item.name === "agreePredict"
      );
      const indexInstall = responses.findIndex(item => item.name === "install");
      responses[indexAgreePredict].value == 0 &&
        responses[indexInstall].value == 2 &&
        resultMaybe3++;

      responses[indexAgreePredict].value == 1 && result3++;
    });
  }

  let result4 = 0;
  let resultMaybe4 = 0;
  for (let j = 0; j < answers.length; j++) {
    const answer = answers[j];
    let { questions } = answer;
    questions = [questions[22], questions[23], questions[24], questions[25]];

    questions.forEach((question, i) => {
      const responses = question.responses;
      const indexAgreePredict = responses.findIndex(
        item => item.name === "agreePredict"
      );
      const indexInstall = responses.findIndex(item => item.name === "install");
      responses[indexAgreePredict].value == 0 &&
        responses[indexInstall].value == 2 &&
        resultMaybe4++;

      responses[indexAgreePredict].value == 1 && result4++;
    });
  }

  const content = `
  Accuracy:
    Approach 1: ${Math.round((result1 / (answers.length * 4)) * 10000) / 100} 
    Approach 2: ${Math.round((result2 / (answers.length * 4)) * 10000) / 100} 
    Approach 3: ${Math.round((result3 / (answers.length * 4)) * 10000) / 100} 
    Approach 4: ${Math.round((result4 / (answers.length * 4)) * 10000) / 100}
  Satisfied level: 
    Approach 1: ${Math.round(
      ((result1 * 100 + resultMaybe1 * 50) / (answers.length * 4 * 100)) * 10000
    ) / 100} 
    Approach 2: ${Math.round(
      ((result2 * 100 + resultMaybe2 * 50) / (answers.length * 4 * 100)) * 10000
    ) / 100}  
    Approach 3: ${Math.round(
      ((result3 * 100 + resultMaybe3 * 50) / (answers.length * 4 * 100)) * 10000
    ) / 100}  
    Approach 4: ${Math.round(
      ((result4 * 100 + resultMaybe4 * 50) / (answers.length * 4 * 100)) * 10000
    ) / 100} 
  `;

  fs.writeFileSync(
    `file-4 (${type === "microworker" ? "microworker" : "expert"}).txt`,
    content,
    { encoding: "utf-8" }
  );
  // eslint-disable-next-line no-console
  console.log("==== DONE FILE 4 ====");
};

const file4ByRegion = async campaignId => {
  let allAnswers = await Models.Answer.find();
  allAnswers = allAnswers.filter(item => item.questions.length === 26);

  const answers = [],
    users = [];
  for (let i = 0; i < allAnswers.length; i++) {
    const answer = allAnswers[i];

    const user = await Models.User.findById(answer.userId);

    if (user.type === "microworker" && user.campaignId === campaignId) {
      answers.push(answer);
      users.push(user);
    }
  }

  let result1 = 0;
  let resultMaybe1 = 0;

  for (let j = 0; j < answers.length; j++) {
    const answer = answers[j];
    let { questions } = answer;
    questions = [questions[10], questions[11], questions[12], questions[13]];

    questions.forEach((question, i) => {
      const responses = question.responses;
      const indexAgreePredict = responses.findIndex(
        item => item.name === "agreePredict"
      );
      const indexInstall = responses.findIndex(item => item.name === "install");
      responses[indexAgreePredict].value == 0 &&
        responses[indexInstall].value == 2 &&
        resultMaybe1++;
      responses[indexAgreePredict].value == 1 && result1++;
    });
  }

  let result2 = 0;
  let resultMaybe2 = 0;
  for (let j = 0; j < answers.length; j++) {
    const answer = answers[j];
    let { questions } = answer;
    questions = [questions[14], questions[15], questions[16], questions[17]];

    questions.forEach((question, i) => {
      const responses = question.responses;
      const indexAgreePredict = responses.findIndex(
        item => item.name === "agreePredict"
      );
      const indexInstall = responses.findIndex(item => item.name === "install");
      responses[indexAgreePredict].value == 0 &&
        responses[indexInstall].value == 2 &&
        resultMaybe2++;

      responses[indexAgreePredict].value == 1 && result2++;
    });
  }

  let result3 = 0;
  let resultMaybe3 = 0;
  for (let j = 0; j < answers.length; j++) {
    const answer = answers[j];
    let { questions } = answer;
    questions = [questions[18], questions[19], questions[20], questions[21]];

    questions.forEach((question, i) => {
      const responses = question.responses;
      const indexAgreePredict = responses.findIndex(
        item => item.name === "agreePredict"
      );
      const indexInstall = responses.findIndex(item => item.name === "install");
      responses[indexAgreePredict].value == 0 &&
        responses[indexInstall].value == 2 &&
        resultMaybe3++;

      responses[indexAgreePredict].value == 1 && result3++;
    });
  }

  let result4 = 0;
  let resultMaybe4 = 0;
  for (let j = 0; j < answers.length; j++) {
    const answer = answers[j];
    let { questions } = answer;
    questions = [questions[22], questions[23], questions[24], questions[25]];

    questions.forEach((question, i) => {
      const responses = question.responses;
      const indexAgreePredict = responses.findIndex(
        item => item.name === "agreePredict"
      );
      const indexInstall = responses.findIndex(item => item.name === "install");
      responses[indexAgreePredict].value == 0 &&
        responses[indexInstall].value == 2 &&
        resultMaybe4++;

      responses[indexAgreePredict].value == 1 && result4++;
    });
  }

  let content = `
  Accuracy:
    Approach 1: ${Math.round((result1 / (answers.length * 4)) * 10000) / 100} 
    Approach 2: ${Math.round((result2 / (answers.length * 4)) * 10000) / 100} 
    Approach 3: ${Math.round((result3 / (answers.length * 4)) * 10000) / 100} 
    Approach 4: ${Math.round((result4 / (answers.length * 4)) * 10000) / 100}
  Satisfied level: 
    Approach 1: ${Math.round(
      ((result1 * 100 + resultMaybe1 * 50) / (answers.length * 4 * 100)) * 10000
    ) / 100} 
    Approach 2: ${Math.round(
      ((result2 * 100 + resultMaybe2 * 50) / (answers.length * 4 * 100)) * 10000
    ) / 100}  
    Approach 3: ${Math.round(
      ((result3 * 100 + resultMaybe3 * 50) / (answers.length * 4 * 100)) * 10000
    ) / 100}  
    Approach 4: ${Math.round(
      ((result4 * 100 + resultMaybe4 * 50) / (answers.length * 4 * 100)) * 10000
    ) / 100} \n
  `;

  // stats gender, country, ...
  const result = { ages: {}, countries: {}, genders: {}, regions: {} };
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

  content += `
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

  fs.writeFileSync(
    `./reports/file-4 (microworker-${getRegionByCampaignId(campaignId)}).txt`,
    content,
    {
      encoding: "utf-8"
    }
  );
  // eslint-disable-next-line no-console
  console.log("==== DONE FILE 4 ====");
};

async function usersPaid() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "workerId",
      title: "Worker ID"
    },
    {
      id: "email",
      title: "Email"
    },
    {
      id: "gender",
      title: "Gender"
    },
    {
      id: "region",
      title: "Region"
    },
    {
      id: "country",
      title: "Country"
    },
    {
      id: "isPaid",
      title: "Paid"
    },
    {
      id: "numberOfQuestions",
      title: "Number of questions the user did"
    }
  ];
  let rows = [];
  const users = await Models.User.find({
    type: "microworker"
  });

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const answer = await Models.Answer.findOne({
      userId: user.id
    });

    // numberOfQuestions
    let numberOfQuestions = 0;
    if (answer && answer.questions) {
      numberOfQuestions = answer.questions.length;
    }
    rows.push({
      stt: i + 1,
      workerId: user.workerId,
      email: user.email,
      gender: user.gender,
      region: getRegionByCampaignId(user.campaignId),
      country: user.country,
      isPaid: user.isPaid ? "YES" : "NO",
      numberOfQuestions
    });
  }

  rows = _.sortBy(rows, ["isPaid"], ["desc"]);
  const csvWriter = createCsvWriter({
    path: "./reports/users-paid.csv",
    header
  });
  await csvWriter.writeRecords(rows);
}

// confusionMaxtrix();
async function confusionMaxtrix() {
  const header = [
    {
      id: "name",
      title: ""
    },
    {
      id: "predictY",
      title: "Predicted value: YES"
    },
    {
      id: "predictN",
      title: "Predicted value: NO"
    },
    {
      id: "predictM",
      title: "Predicted value: MAYBE"
    }
  ];

  const matrix = {
    expert: {
      1: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      2: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      3: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      4: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]
    },
    // paid: {
    //   1: [
    //     [0, 0, 0],
    //     [0, 0, 0],
    //     [0, 0, 0]
    //   ],
    //   2: [
    //     [0, 0, 0],
    //     [0, 0, 0],
    //     [0, 0, 0]
    //   ],
    //   3: [
    //     [0, 0, 0],
    //     [0, 0, 0],
    //     [0, 0, 0]
    //   ],
    //   4: [
    //     [0, 0, 0],
    //     [0, 0, 0],
    //     [0, 0, 0]
    //   ]
    // },
    unpaid: {
      1: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      2: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      3: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      4: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]
    }
  };

  const users = await Models.User.find({
    ignored: { $exists: false }
  });

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const { questions } = user;
    if (!user || questions.length <= 20) continue;
    // userType
    const userType =
      user.type === "expert" ? "expert" : user.isPaid ? "paid" : "unpaid";

    for (let j = 20; j < questions.length; j++) {
      const question = questions[j];
      // approach
      let approach;
      if (j >= 20 && j < 25) approach = 1;
      else if (j >= 25 && j < 30) approach = 2;
      else if (j >= 30 && j < 35) approach = 3;
      else if (j >= 35 && j < 40) approach = 4;

      // agreePredict
      let agreePredict = question.responses.find(
        item => item.name === "agreePredict"
      );
      agreePredict = Number(agreePredict.value);

      // ourPrediction
      let ourPrediction = question.responses.find(
        item => item.name === "ourPrediction"
      );
      ourPrediction = Number(ourPrediction.value);

      if (agreePredict) {
        matrix[userType][approach][ourPrediction][ourPrediction]++;
      } else {
        //install
        let install = question.responses.find(item => item.name === "install");
        install = Number(install.value);

        matrix[userType][approach][install][ourPrediction]++;
      }
    }
  }

  const rows = {};
  for (const type in matrix) {
    const approaches = matrix[type];
    rows[type] = [];

    for (const approachNum in approaches) {
      const values = approaches[approachNum];

      rows[type].push({ name: `Approach ${approachNum}` });
      rows[type].push({
        name: "Actual value: Yes",
        predictY: values[1][1],
        predictN: values[1][0],
        predictM: values[1][2]
      });

      rows[type].push({
        name: "Actual value: No",
        predictY: values[0][1],
        predictN: values[0][0],
        predictM: values[0][2]
      });
      rows[type].push({
        name: "Actual value: Maybe",
        predictY: values[2][1],
        predictN: values[2][0],
        predictM: values[2][2]
      });
    }
  }

  // const rowsForExpert = [
  //   { name: "Approach 1" },
  //   {
  //     name: "Actual value: Yes",
  //     predictY: matrix["expert"][1][1][1],
  //     predictN: matrix["expert"][1][1][0],
  //     predictM: matrix["expert"][1][1][2]
  //   },
  //   {
  //     name: "Actual value: No",
  //     predictY: matrix["expert"][1][0][1],
  //     predictN: matrix["expert"][1][0][0],
  //     predictM: matrix["expert"][1][0][2]
  //   },
  //   {
  //     name: "Actual value: Maybe",
  //     predictY: matrix["expert"][1][2][1],
  //     predictN: matrix["expert"][1][2][0],
  //     predictM: matrix["expert"][1][2][2]
  //   },

  //   //
  //   { name: "Approach 2" },
  //   {
  //     name: "Actual value: Yes",
  //     predictY: matrix["expert"][2][1][1],
  //     predictN: matrix["expert"][2][1][0],
  //     predictM: matrix["expert"][2][1][2]
  //   },
  //   {
  //     name: "Actual value: No",
  //     predictY: matrix["expert"][2][0][1],
  //     predictN: matrix["expert"][2][0][0],
  //     predictM: matrix["expert"][2][0][2]
  //   },
  //   {
  //     name: "Actual value: Maybe",
  //     predictY: matrix["expert"][2][2][1],
  //     predictN: matrix["expert"][2][2][0],
  //     predictM: matrix["expert"][2][2][2]
  //   },

  //   //
  //   { name: "Approach 3" },
  //   {
  //     name: "Actual value: Yes",
  //     predictY: matrix["expert"][3][1][1],
  //     predictN: matrix["expert"][3][1][0],
  //     predictM: matrix["expert"][3][1][2]
  //   },
  //   {
  //     name: "Actual value: No",
  //     predictY: matrix["expert"][3][0][1],
  //     predictN: matrix["expert"][3][0][0],
  //     predictM: matrix["expert"][3][0][2]
  //   },
  //   {
  //     name: "Actual value: Maybe",
  //     predictY: matrix["expert"][3][2][1],
  //     predictN: matrix["expert"][3][2][0],
  //     predictM: matrix["expert"][3][2][2]
  //   },

  //   { name: "Approach 4" },
  //   {
  //     name: "Actual value: Yes",
  //     predictY: matrix["expert"][4][1][1],
  //     predictN: matrix["expert"][4][1][0],
  //     predictM: matrix["expert"][4][1][2]
  //   },
  //   {
  //     name: "Actual value: No",
  //     predictY: matrix["expert"][4][0][1],
  //     predictN: matrix["expert"][4][0][0],
  //     predictM: matrix["expert"][4][0][2]
  //   },
  //   {
  //     name: "Actual value: Maybe",
  //     predictY: matrix["expert"][4][2][1],
  //     predictN: matrix["expert"][4][2][0],
  //     predictM: matrix["expert"][4][2][2]
  //   }
  // ];

  // const rowsForPaid = [
  //   { name: "Approach 1" },
  //   {
  //     name: "Actual value: Yes",
  //     predictY: matrix["paid"][1][1][1],
  //     predictN: matrix["paid"][1][1][0],
  //     predictM: matrix["paid"][1][1][2]
  //   },
  //   {
  //     name: "Actual value: No",
  //     predictY: matrix["paid"][1][0][1],
  //     predictN: matrix["paid"][1][0][0],
  //     predictM: matrix["paid"][1][0][2]
  //   },
  //   {
  //     name: "Actual value: Maybe",
  //     predictY: matrix["paid"][1][2][1],
  //     predictN: matrix["paid"][1][2][0],
  //     predictM: matrix["paid"][1][2][2]
  //   },

  //   //
  //   { name: "Approach 2" },
  //   {
  //     name: "Actual value: Yes",
  //     predictY: matrix["paid"][2][1][1],
  //     predictN: matrix["paid"][2][1][0],
  //     predictM: matrix["paid"][2][1][2]
  //   },
  //   {
  //     name: "Actual value: No",
  //     predictY: matrix["paid"][2][0][1],
  //     predictN: matrix["paid"][2][0][0],
  //     predictM: matrix["paid"][2][0][2]
  //   },
  //   {
  //     name: "Actual value: Maybe",
  //     predictY: matrix["paid"][2][2][1],
  //     predictN: matrix["paid"][2][2][0],
  //     predictM: matrix["paid"][2][2][2]
  //   },

  //   //
  //   { name: "Approach 3" },
  //   {
  //     name: "Actual value: Yes",
  //     predictY: matrix["paid"][3][1][1],
  //     predictN: matrix["paid"][3][1][0],
  //     predictM: matrix["paid"][3][1][2]
  //   },
  //   {
  //     name: "Actual value: No",
  //     predictY: matrix["paid"][3][0][1],
  //     predictN: matrix["paid"][3][0][0],
  //     predictM: matrix["paid"][3][0][2]
  //   },
  //   {
  //     name: "Actual value: Maybe",
  //     predictY: matrix["paid"][3][2][1],
  //     predictN: matrix["paid"][3][2][0],
  //     predictM: matrix["paid"][3][2][2]
  //   },

  //   { name: "Approach 4" },
  //   {
  //     name: "Actual value: Yes",
  //     predictY: matrix["paid"][4][1][1],
  //     predictN: matrix["paid"][4][1][0],
  //     predictM: matrix["paid"][4][1][2]
  //   },
  //   {
  //     name: "Actual value: No",
  //     predictY: matrix["paid"][4][0][1],
  //     predictN: matrix["paid"][4][0][0],
  //     predictM: matrix["paid"][4][0][2]
  //   },
  //   {
  //     name: "Actual value: Maybe",
  //     predictY: matrix["paid"][4][2][1],
  //     predictN: matrix["paid"][4][2][0],
  //     predictM: matrix["paid"][4][2][2]
  //   }
  // ];

  // const rowsForUnPaid = [
  //   { name: "Approach 1" },
  //   {
  //     name: "Actual value: Yes",
  //     predictY: matrix["unpaid"][1][1][1],
  //     predictN: matrix["unpaid"][1][1][0],
  //     predictM: matrix["unpaid"][1][1][2]
  //   },
  //   {
  //     name: "Actual value: No",
  //     predictY: matrix["unpaid"][1][0][1],
  //     predictN: matrix["unpaid"][1][0][0],
  //     predictM: matrix["unpaid"][1][0][2]
  //   },
  //   {
  //     name: "Actual value: Maybe",
  //     predictY: matrix["unpaid"][1][2][1],
  //     predictN: matrix["unpaid"][1][2][0],
  //     predictM: matrix["unpaid"][1][2][2]
  //   },

  //   //
  //   { name: "Approach 2" },
  //   {
  //     name: "Actual value: Yes",
  //     predictY: matrix["unpaid"][2][1][1],
  //     predictN: matrix["unpaid"][2][1][0],
  //     predictM: matrix["unpaid"][2][1][2]
  //   },
  //   {
  //     name: "Actual value: No",
  //     predictY: matrix["unpaid"][2][0][1],
  //     predictN: matrix["unpaid"][2][0][0],
  //     predictM: matrix["unpaid"][2][0][2]
  //   },
  //   {
  //     name: "Actual value: Maybe",
  //     predictY: matrix["unpaid"][2][2][1],
  //     predictN: matrix["unpaid"][2][2][0],
  //     predictM: matrix["unpaid"][2][2][2]
  //   },

  //   //
  //   { name: "Approach 3" },
  //   {
  //     name: "Actual value: Yes",
  //     predictY: matrix["unpaid"][3][1][1],
  //     predictN: matrix["unpaid"][3][1][0],
  //     predictM: matrix["unpaid"][3][1][2]
  //   },
  //   {
  //     name: "Actual value: No",
  //     predictY: matrix["unpaid"][3][0][1],
  //     predictN: matrix["unpaid"][3][0][0],
  //     predictM: matrix["unpaid"][3][0][2]
  //   },
  //   {
  //     name: "Actual value: Maybe",
  //     predictY: matrix["unpaid"][3][2][1],
  //     predictN: matrix["unpaid"][3][2][0],
  //     predictM: matrix["unpaid"][3][2][2]
  //   },

  //   { name: "Approach 4" },
  //   {
  //     name: "Actual value: Yes",
  //     predictY: matrix["unpaid"][4][1][1],
  //     predictN: matrix["unpaid"][4][1][0],
  //     predictM: matrix["unpaid"][4][1][2]
  //   },
  //   {
  //     name: "Actual value: No",
  //     predictY: matrix["unpaid"][4][0][1],
  //     predictN: matrix["unpaid"][4][0][0],
  //     predictM: matrix["unpaid"][4][0][2]
  //   },
  //   {
  //     name: "Actual value: Maybe",
  //     predictY: matrix["unpaid"][4][2][1],
  //     predictN: matrix["unpaid"][4][2][0],
  //     predictM: matrix["unpaid"][4][2][2]
  //   }
  // ];
  const csvWriterExpert = createCsvWriter({
    path: "./reports/confusion matrix/expert.csv",
    header
  });
  await csvWriterExpert.writeRecords(rows["expert"]);

  // paid
  // const csvWriterPaid = createCsvWriter({
  //   path: "./reports/confusion matrix/microworker-paid.csv",
  //   header
  // });
  // await csvWriterPaid.writeRecords(rowsForPaid);

  // unpaid
  const csvWriterUnPaid = createCsvWriter({
    path: "./reports/confusion matrix/microworker-unpaid.csv",
    header
  });
  await csvWriterUnPaid.writeRecords(rows["unpaid"]);
}
// metricsDefinition();
async function metricsDefinition() {
  const matrix = {
    expert: {
      1: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      2: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      3: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      4: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]
    },
    paid: {
      1: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      2: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      3: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      4: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]
    },
    unpaid: {
      1: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      2: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      3: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      4: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]
    },
    totalexpert: {
      1: 0,
      2: 0,
      3: 0,
      4: 0
    },
    totalpaid: {
      1: 0,
      2: 0,
      3: 0,
      4: 0
    },
    totalunpaid: {
      1: 0,
      2: 0,
      3: 0,
      4: 0
    },
    satisfactionexpert: {
      1: {
        attendanceNumber: 0,
        value: 0
      },
      2: {
        attendanceNumber: 0,
        value: 0
      },
      3: {
        attendanceNumber: 0,
        value: 0
      },
      4: {
        attendanceNumber: 0,
        value: 0
      }
    },
    satisfactionpaid: {
      1: {
        attendanceNumber: 0,
        value: 0
      },
      2: {
        attendanceNumber: 0,
        value: 0
      },
      3: {
        attendanceNumber: 0,
        value: 0
      },
      4: {
        attendanceNumber: 0,
        value: 0
      }
    },
    satisfactionunpaid: {
      1: {
        attendanceNumber: 0,
        value: 0
      },
      2: {
        attendanceNumber: 0,
        value: 0
      },
      3: {
        attendanceNumber: 0,
        value: 0
      },
      4: {
        attendanceNumber: 0,
        value: 0
      }
    }
  };
  const users = await Models.User.find({
    ignored: { $exists: false }
  });
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const { questions } = user;

    if (!user || questions.length <= 20) continue;
    // userType
    const userType =
      user.type === "expert" ? "expert" : user.isPaid ? "paid" : "unpaid";

    for (let j = 20; j < questions.length; j++) {
      const question = questions[j];
      // approach
      let approach;
      if (j >= 20 && j < 25) approach = 1;
      else if (j >= 25 && j < 30) approach = 2;
      else if (j >= 30 && j < 35) approach = 3;
      else if (j >= 35 && j < 40) approach = 4;

      // calculate satisfaction
      if (j === 24 || j === 29 || j === 34 || j === 39) {
        let satisfaction = question.responses.find(
          item => item.name === "satisfaction"
        );
        satisfaction = Number(satisfaction.value);
        const value = satisfaction === 1 ? 1 : satisfaction === 2 ? 0.5 : 0;

        matrix[`satisfaction${userType}`][approach]["value"] =
          matrix[`satisfaction${userType}`][approach]["value"] + value;

        matrix[`satisfaction${userType}`][approach]["attendanceNumber"]++;
      }
      matrix[`total${userType}`][approach]++;
      // agreePredict
      let agreePredict = question.responses.find(
        item => item.name === "agreePredict"
      );
      agreePredict = Number(agreePredict.value);

      // ourPrediction
      let ourPrediction = question.responses.find(
        item => item.name === "ourPrediction"
      );
      ourPrediction = Number(ourPrediction.value);

      if (agreePredict) {
        matrix[userType][approach][ourPrediction][ourPrediction]++;
      } else {
        //install
        let install = question.responses.find(item => item.name === "install");
        install = Number(install.value);

        matrix[userType][approach][install][ourPrediction]++;
      }
    }
  }
  console.log(matrix);
  const result = {
    expert: { 1: {}, 2: {}, 3: {}, 4: {} },
    paid: { 1: {}, 2: {}, 3: {}, 4: {} },
    unpaid: { 1: {}, 2: {}, 3: {}, 4: {} }
  };
  // expert
  for (const approach in result.expert) {
    result["expert"][approach]["accurancy"] =
      (matrix["expert"][approach][0][0] +
        matrix["expert"][approach][1][1] +
        matrix["expert"][approach][2][2]) /
      matrix.totalexpert[approach];

    result["expert"][approach]["satisfaction"] =
      matrix["satisfactionexpert"][approach].value /
      matrix["satisfactionexpert"][approach].attendanceNumber;
    //precisionY
    result["expert"][approach]["precisionY"] =
      matrix["expert"][approach][0][0] /
      (matrix["expert"][approach][0][0] +
        matrix["expert"][approach][1][0] +
        matrix["expert"][approach][2][0]);
    //precisionN
    result["expert"][approach]["precisionN"] =
      matrix["expert"][approach][0][0] /
      (matrix["expert"][approach][0][0] +
        matrix["expert"][approach][1][0] +
        matrix["expert"][approach][2][0]);

    //precisionM
    result["expert"][approach]["precisionM"] =
      matrix["expert"][approach][2][2] /
      (matrix["expert"][approach][2][2] +
        matrix["expert"][approach][1][2] +
        matrix["expert"][approach][0][2]);

    //recallY
    result["expert"][approach]["recallY"] =
      matrix["expert"][approach][0][0] /
      (matrix["expert"][approach][0][0] +
        matrix["expert"][approach][0][1] +
        matrix["expert"][approach][0][2]);

    //recallN
    result["expert"][approach]["recallN"] =
      matrix["expert"][approach][1][1] /
      (matrix["expert"][approach][1][1] +
        matrix["expert"][approach][1][0] +
        matrix["expert"][approach][1][2]);

    //recallM
    result["expert"][approach]["recallM"] =
      matrix["expert"][approach][2][2] /
      (matrix["expert"][approach][2][2] +
        matrix["expert"][approach][2][0] +
        matrix["expert"][approach][2][1]);

    result["expert"][approach]["F1Y"] =
      (2 *
        (result["expert"][approach]["precisionY"] *
          result["expert"][approach]["recallY"])) /
      (result["expert"][approach]["precisionY"] +
        result["expert"][approach]["recallY"]);

    result["expert"][approach]["F1N"] =
      (2 *
        (result["expert"][approach]["precisionN"] *
          result["expert"][approach]["recallN"])) /
      (result["expert"][approach]["precisionN"] +
        result["expert"][approach]["recallN"]);

    result["expert"][approach]["F1M"] =
      (2 *
        (result["expert"][approach]["precisionM"] *
          result["expert"][approach]["recallM"])) /
      (result["expert"][approach]["precisionM"] +
        result["expert"][approach]["recallM"]);
  }

  // ========= paid ========
  for (const approach in result.paid) {
    result["paid"][approach]["accurancy"] =
      (matrix["paid"][approach][0][0] +
        matrix["paid"][approach][1][1] +
        matrix["paid"][approach][2][2]) /
      matrix.totalpaid[approach];

    result["paid"][approach]["satisfaction"] =
      matrix["satisfactionpaid"][approach].value /
      matrix["satisfactionpaid"][approach].attendanceNumber;
    //precisionY
    result["paid"][approach]["precisionY"] =
      matrix["paid"][approach][1][1] /
      (matrix["paid"][approach][1][1] +
        matrix["paid"][approach][0][1] +
        matrix["paid"][approach][2][1]);
    //precisionN
    result["paid"][approach]["precisionN"] =
      matrix["paid"][approach][0][0] /
      (matrix["paid"][approach][0][0] +
        matrix["paid"][approach][1][0] +
        matrix["paid"][approach][2][0]);

    //precisionM
    result["paid"][approach]["precisionM"] =
      matrix["paid"][approach][2][2] /
      (matrix["paid"][approach][2][2] +
        matrix["paid"][approach][1][2] +
        matrix["paid"][approach][0][2]);

    //recallY
    result["paid"][approach]["recallY"] =
      matrix["paid"][approach][1][1] /
      (matrix["paid"][approach][1][1] +
        matrix["paid"][approach][1][0] +
        matrix["paid"][approach][1][2]);

    //recallN
    result["paid"][approach]["recallN"] =
      matrix["paid"][approach][0][0] /
      (matrix["paid"][approach][0][0] +
        matrix["paid"][approach][0][1] +
        matrix["paid"][approach][0][2]);

    //recallM
    result["paid"][approach]["recallM"] =
      matrix["paid"][approach][2][2] /
      (matrix["paid"][approach][2][2] +
        matrix["paid"][approach][2][0] +
        matrix["paid"][approach][2][1]);

    result["paid"][approach]["F1Y"] =
      (2 *
        (result["paid"][approach]["precisionY"] *
          result["paid"][approach]["recallY"])) /
      (result["paid"][approach]["precisionY"] +
        result["paid"][approach]["recallY"]);

    result["paid"][approach]["F1N"] =
      (2 *
        (result["paid"][approach]["precisionN"] *
          result["paid"][approach]["recallN"])) /
      (result["paid"][approach]["precisionN"] +
        result["paid"][approach]["recallN"]);

    result["paid"][approach]["F1M"] =
      (2 *
        (result["paid"][approach]["precisionM"] *
          result["paid"][approach]["recallM"])) /
      (result["paid"][approach]["precisionM"] +
        result["paid"][approach]["recallM"]);
  }
  // ========= unpaid ========
  for (const approach in result.unpaid) {
    result["unpaid"][approach]["accurancy"] =
      (matrix["unpaid"][approach][0][0] +
        matrix["unpaid"][approach][1][1] +
        matrix["unpaid"][approach][2][2]) /
      matrix.totalunpaid[approach];

    result["unpaid"][approach]["satisfaction"] =
      matrix["satisfactionunpaid"][approach].value /
      matrix["satisfactionunpaid"][approach].attendanceNumber;
    //precisionY
    result["unpaid"][approach]["precisionY"] =
      matrix["unpaid"][approach][0][0] /
      (matrix["unpaid"][approach][0][0] +
        matrix["unpaid"][approach][1][0] +
        matrix["unpaid"][approach][2][0]);

    //precisionN
    result["unpaid"][approach]["precisionN"] =
      matrix["unpaid"][approach][0][0] /
      (matrix["unpaid"][approach][0][0] +
        matrix["unpaid"][approach][1][0] +
        matrix["unpaid"][approach][2][0]);

    //precisionM
    result["unpaid"][approach]["precisionM"] =
      matrix["unpaid"][approach][2][2] /
      (matrix["unpaid"][approach][2][2] +
        matrix["unpaid"][approach][1][2] +
        matrix["unpaid"][approach][0][2]);

    //recallY
    result["unpaid"][approach]["recallY"] =
      matrix["unpaid"][approach][1][1] /
      (matrix["unpaid"][approach][1][1] +
        matrix["unpaid"][approach][1][0] +
        matrix["unpaid"][approach][1][2]);

    //recallN
    result["unpaid"][approach]["recallN"] =
      matrix["unpaid"][approach][0][0] /
      (matrix["unpaid"][approach][0][0] +
        matrix["unpaid"][approach][0][1] +
        matrix["unpaid"][approach][0][2]);

    //recallM
    result["unpaid"][approach]["recallM"] =
      matrix["unpaid"][approach][2][2] /
      (matrix["unpaid"][approach][2][2] +
        matrix["unpaid"][approach][2][0] +
        matrix["unpaid"][approach][2][1]);

    result["unpaid"][approach]["F1Y"] =
      (2 *
        (result["unpaid"][approach]["precisionY"] *
          result["unpaid"][approach]["recallY"])) /
      (result["unpaid"][approach]["precisionY"] +
        result["unpaid"][approach]["recallY"]);

    result["unpaid"][approach]["F1N"] =
      (2 *
        (result["unpaid"][approach]["precisionN"] *
          result["unpaid"][approach]["recallN"])) /
      (result["unpaid"][approach]["precisionN"] +
        result["unpaid"][approach]["recallN"]);

    result["unpaid"][approach]["F1M"] =
      (2 *
        (result["unpaid"][approach]["precisionM"] *
          result["unpaid"][approach]["recallM"])) /
      (result["unpaid"][approach]["precisionM"] +
        result["unpaid"][approach]["recallM"]);
  }

  // expert
  let expertContent = "";
  for (const approach in result["expert"]) {
    expertContent += `
    * Approach ${approach}: 
      Accurancy: ${result["expert"][approach]["accurancy"]} 

      Satisfaction: ${result["expert"][approach]["satisfaction"]} 
    
      Precision Yes: ${result["expert"][approach]["precisionY"]}
      Precision No: ${result["expert"][approach]["precisionN"]}
      Precision Maybe: ${result["expert"][approach]["precisionM"]} 
    
      Recall Yes: ${result["expert"][approach]["recallY"]}
      Recall No: ${result["expert"][approach]["recallN"]}
      Recall Maybe: ${result["expert"][approach]["recallM"]}
    
      F1 Yes: ${result["expert"][approach]["F1Y"]}
      F1 No: ${result["expert"][approach]["F1N"]}
      F1 Maybe: ${result["expert"][approach]["F1M"]} \n
  `;
  }

  fs.writeFileSync("./reports/metrics definition/expert.txt", expertContent);

  // paid
  let paidContent = "";
  for (const approach in result["paid"]) {
    paidContent += `
    * Approach ${approach}: 
      Accurancy: ${result["paid"][approach]["accurancy"]} 

      Satisfaction: ${result["paid"][approach]["satisfaction"]} 
    
      Precision Yes: ${result["paid"][approach]["precisionY"]}
      Precision No: ${result["paid"][approach]["precisionN"]}
      Precision Maybe: ${result["paid"][approach]["precisionM"]} 
    
      Recall Yes: ${result["paid"][approach]["recallY"]}
      Recall No: ${result["paid"][approach]["recallN"]}
      Recall Maybe: ${result["paid"][approach]["recallM"]}
    
      F1 Yes: ${result["paid"][approach]["F1Y"]}
      F1 No: ${result["paid"][approach]["F1N"]}
      F1 Maybe: ${result["paid"][approach]["F1M"]} \n
  `;
  }
  fs.writeFileSync(
    "./reports/metrics definition/microworker-paid.txt",
    paidContent
  );

  // unpaid
  let unpaidContent = "";
  for (const approach in result["unpaid"]) {
    unpaidContent += `
    * Approach ${approach}: 
      Accurancy: ${result["unpaid"][approach]["accurancy"]} 

      Satisfaction: ${result["unpaid"][approach]["satisfaction"]} 

      Precision Yes: ${result["unpaid"][approach]["precisionY"]}
      Precision No: ${result["unpaid"][approach]["precisionN"]}
      Precision Maybe: ${result["unpaid"][approach]["precisionM"]} 
    
      Recall Yes: ${result["unpaid"][approach]["recallY"]}
      Recall No: ${result["unpaid"][approach]["recallN"]}
      Recall Maybe: ${result["unpaid"][approach]["recallM"]}
    
      F1 Yes: ${result["unpaid"][approach]["F1Y"]}
      F1 No: ${result["unpaid"][approach]["F1N"]}
      F1 Maybe: ${result["unpaid"][approach]["F1M"]} \n
  `;
  }
  fs.writeFileSync(
    "./reports/metrics definition/microworker-unpaid.txt",
    unpaidContent
  );
}

async function calculateAccuranceByAlgorithm(algorithm, experimentNumber) {
  const matrix = {
    paid: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ],
    unpaid: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ],
    expert: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ],

    total: {
      paid: 0,
      unpaid: 0,
      expert: 0
    },
    satisfaction: {
      paid: {
        attendanceNumber: 0,
        value: 0
      },
      unpaid: {
        attendanceNumber: 0,
        value: 0
      },
      expert: {
        attendanceNumber: 0,
        value: 0
      }
    }
  };
  let allAnswers = await Models.Answer.find();

  allAnswers = allAnswers.filter(item => item.questions.length === 26);

  const totalTranningApps = experimentNumber + 5;
  const getMatrixFromApp = async (
    answer,
    matrix,
    totalTranningApps,
    algorithm
  ) => {
    const { questions, userId } = answer;
    const user = await Models.User.findById(userId);
    if (!user) return;

    // userType
    const userType =
      user.type === "normal" ? "expert" : user.isPaid ? "paid" : "unpaid";

    for (let j = totalTranningApps; j < questions.length; j++) {
      const question = questions[j];

      // calculate satisfaction
      if (j === 13 || j === 17 || j === 21 || j === 25) {
        let satisfaction = question.responses.find(
          item => item.name === "satisfaction"
        );
        satisfaction = Number(
          satisfaction.value.replace("[", "").replace("]", "")
        );
        const value = satisfaction === 1 ? 1 : satisfaction === 2 ? 0.5 : 0;

        matrix["satisfaction"][userType]["value"] =
          matrix["satisfaction"][userType]["value"] + value;

        matrix["satisfaction"][userType]["attendanceNumber"]++;
      }

      // agreePredict
      let agreePredict = question.responses.find(
        item => item.name === "agreePredict"
      );
      if (agreePredict)
        agreePredict = Number(
          agreePredict.value.replace("[", "").replace("]", "")
        );

      // get tranning apps
      let tranningAppIds = [];
      if (totalTranningApps === 6)
        tranningAppIds = [
          ...user.questionIds.slice(0, 3),
          ...user.questionIds.slice(5, 8),
          ...(algorithm === "EM" ? user.questionIds.slice(10, j + 1) : [])
        ];
      else if (totalTranningApps === 7)
        tranningAppIds = [
          ...user.questionIds.slice(0, 4),
          ...user.questionIds.slice(5, 8),
          ...(algorithm === "EM" && user.questionIds.slice(10, j + 1))
        ];
      else if (totalTranningApps === 8)
        tranningAppIds = [
          ...user.questionIds.slice(0, 4),
          ...user.questionIds.slice(5, 9),
          ...(algorithm === "EM" ? user.questionIds.slice(10, j + 1) : [])
        ];
      else if (totalTranningApps === 9)
        tranningAppIds = [
          ...user.questionIds.slice(0, 5),
          ...user.questionIds.slice(5, 9),
          ...(algorithm === "EM" ? user.questionIds.slice(10, j + 1) : [])
        ];
      else
        tranningAppIds = [
          ...user.questionIds.slice(0, 5),
          ...user.questionIds.slice(5, 10),
          ...(algorithm === "EM" ? user.questionIds.slice(10, j + 1) : [])
        ];

      let app = await Models.App.findById(user.questionIds[j]).cache(
        60 * 60 * 24 * 30
      ); // 1 month;

      let ourPrediction;
      try {
        ourPrediction = await Utils.Function.getOurPredictionApproach1(
          tranningAppIds,
          answer,
          app,
          algorithm
        );
      } catch (err) {
        console.log(err);
        continue;
      }
      matrix["total"][userType]++;
      console.log(1, ourPrediction);
      if (agreePredict) {
        matrix[userType][ourPrediction][ourPrediction]++;
      } else {
        //install
        let install = question.responses.find(item => item.name === "install");
        install = Number(install.value.replace("[", "").replace("]", ""));

        matrix[userType][install][ourPrediction]++;
      }
    }
    return;
  };
  await Promise.all(
    allAnswers.map(answer =>
      getMatrixFromApp(answer, matrix, totalTranningApps, algorithm)
    )
  );

  console.log("matrix", matrix);
  const result = {
    paid: {},
    unpaid: {},
    expert: {}
  };
  //
  for (const userType in result) {
    result[userType]["accurancy"] =
      (matrix[userType][0][0] +
        matrix[userType][1][1] +
        matrix[userType][2][2]) /
      matrix.total[userType];

    result[userType]["satisfaction"] =
      matrix["satisfaction"][userType].value /
      matrix["satisfaction"][userType].attendanceNumber;
    //precisionY
    result[userType]["precisionY"] =
      matrix[userType][0][0] /
      (matrix[userType][0][0] +
        matrix[userType][1][0] +
        matrix[userType][2][0]);

    //precisionN
    result[userType]["precisionN"] =
      matrix[userType][0][0] /
      (matrix[userType][0][0] +
        matrix[userType][1][0] +
        matrix[userType][2][0]);

    //precisionM
    result[userType]["precisionM"] =
      matrix[userType][2][2] /
      (matrix[userType][2][2] +
        matrix[userType][1][2] +
        matrix[userType][0][2]);

    //recallY
    result[userType]["recallY"] =
      matrix[userType][1][1] /
      (matrix[userType][1][1] +
        matrix[userType][1][0] +
        matrix[userType][1][2]);

    //recallN
    result[userType]["recallN"] =
      matrix[userType][0][0] /
      (matrix[userType][0][0] +
        matrix[userType][0][1] +
        matrix[userType][0][2]);

    //recallM
    result[userType]["recallM"] =
      matrix[userType][2][2] /
      (matrix[userType][2][2] +
        matrix[userType][2][0] +
        matrix[userType][2][1]);

    result[userType]["F1Y"] =
      (2 * (result[userType]["precisionY"] * result[userType]["recallY"])) /
      (result[userType]["precisionY"] + result[userType]["recallY"]);

    result[userType]["F1N"] =
      (2 * (result[userType]["precisionN"] * result[userType]["recallN"])) /
      (result[userType]["precisionN"] + result[userType]["recallN"]);

    result[userType]["F1M"] =
      (2 * (result[userType]["precisionM"] * result[userType]["recallM"])) /
      (result[userType]["precisionM"] + result[userType]["recallM"]);
  }
  console.log("result ", result);
  let content = "";
  for (const userType in result) {
    content += `
    * ${userType}: 
      Accurancy: ${result[userType]["accurancy"]} 

      Satisfaction: ${result[userType]["satisfaction"]} 

      Precision Yes: ${result[userType]["precisionY"]}
      Precision No: ${result[userType]["precisionN"]}
      Precision Maybe: ${result[userType]["precisionM"]} 
    
      Recall Yes: ${result[userType]["recallY"]}
      Recall No: ${result[userType]["recallN"]}
      Recall Maybe: ${result[userType]["recallM"]}
    
      F1 Yes: ${result[userType]["F1Y"]}
      F1 No: ${result[userType]["F1N"]}
      F1 Maybe: ${result[userType]["F1M"]} \n
  `;
  }
  fs.writeFileSync(
    `./reports/accurance by algorithms/${algorithm}-${experimentNumber}.txt`,
    content
  );
  return;
}
calculateAccuranceByTranningApps();
async function calculateAccuranceByTranningApps() {
  const matrix = {
    expert: {
      1: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      2: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      3: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      4: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]
    },
    paid: {
      1: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      2: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      3: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      4: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]
    },
    unpaid: {
      1: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      2: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      3: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      4: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]
    },
    totalexpert: {
      1: 0,
      2: 0,
      3: 0,
      4: 0
    },
    totalpaid: {
      1: 0,
      2: 0,
      3: 0,
      4: 0
    },
    totalunpaid: {
      1: 0,
      2: 0,
      3: 0,
      4: 0
    }
  };
  const approaches = [1, 2, 3, 4];
  const users = await Models.User.find({
    ignored: { $exists: false }
  });

  const getMatrixFromApp = async (user, matrix) => {
    const { questions, id: userId } = user;
    if (!user || questions.length <= 20) return;
    // userType
    const userType =
      user.type === "expert" ? "expert" : user.isPaid ? "paid" : "unpaid";
    const questionPrediction = [];
    for (let j = 0; j < 20; j++) {
      for (let k = 0; k < approaches.length; k++) {
        const approach = approaches[k];

        const question = questions[j];

        // ourPrediction
        let questionDetail = await Models.Question.findById(question.id).cache(
          60 * 60 * 24 * 30
        ); // 1 month;

        let tranningAppIds = user.questionIds.slice(0, 10);

        let ourPrediction;
        try {
          ourPrediction = await Utils.Function.getOurPredictionApproach1(
            tranningAppIds,
            user,
            questionDetail,
            "EM",
            questionPrediction
          );
          console.log(1, ourPrediction);
        } catch (err) {
          console.log(3, err);
          continue;
        }
        matrix[`total${userType}`][approach]++;
        questionPrediction.push({
          id: question.id,
          value: ourPrediction
        });

        //install
        let install = question.responses.find(item => item.name === "install");
        install = Number(install.value.replace("[", "").replace("]", ""));

        matrix[userType][approach][install][ourPrediction]++;
      }
    }
    return;
  };

  await Promise.all(users.map(user => getMatrixFromApp(user, matrix)));

  console.log("matrix", JSON.stringify(matrix));
  const result = {
    expert: { 1: {}, 2: {}, 3: {}, 4: {} },
    paid: { 1: {}, 2: {}, 3: {}, 4: {} },
    unpaid: { 1: {}, 2: {}, 3: {}, 4: {} }
  };
  // expert
  for (const approach in result.expert) {
    result["expert"][approach]["accurancy"] =
      (matrix["expert"][approach][0][0] +
        matrix["expert"][approach][1][1] +
        matrix["expert"][approach][2][2]) /
      matrix.totalexpert[approach];

    //precisionY
    result["expert"][approach]["precisionY"] =
      matrix["expert"][approach][0][0] /
      (matrix["expert"][approach][0][0] +
        matrix["expert"][approach][1][0] +
        matrix["expert"][approach][2][0]);

    //precisionN
    result["expert"][approach]["precisionN"] =
      matrix["expert"][approach][0][0] /
      (matrix["expert"][approach][0][0] +
        matrix["expert"][approach][1][0] +
        matrix["expert"][approach][2][0]);

    //precisionM
    result["expert"][approach]["precisionM"] =
      matrix["expert"][approach][2][2] /
      (matrix["expert"][approach][2][2] +
        matrix["expert"][approach][1][2] +
        matrix["expert"][approach][0][2]);

    //recallY
    result["expert"][approach]["recallY"] =
      matrix["expert"][approach][1][1] /
      (matrix["expert"][approach][1][1] +
        matrix["expert"][approach][1][0] +
        matrix["expert"][approach][1][2]);

    //recallN
    result["expert"][approach]["recallN"] =
      matrix["expert"][approach][0][0] /
      (matrix["expert"][approach][0][0] +
        matrix["expert"][approach][0][1] +
        matrix["expert"][approach][0][2]);

    //recallM
    result["expert"][approach]["recallM"] =
      matrix["expert"][approach][2][2] /
      (matrix["expert"][approach][2][2] +
        matrix["expert"][approach][2][0] +
        matrix["expert"][approach][2][1]);

    result["expert"][approach]["F1Y"] =
      (2 *
        (result["expert"][approach]["precisionY"] *
          result["expert"][approach]["recallY"])) /
      (result["expert"][approach]["precisionY"] +
        result["expert"][approach]["recallY"]);

    result["expert"][approach]["F1N"] =
      (2 *
        (result["expert"][approach]["precisionN"] *
          result["expert"][approach]["recallN"])) /
      (result["expert"][approach]["precisionN"] +
        result["expert"][approach]["recallN"]);

    result["expert"][approach]["F1M"] =
      (2 *
        (result["expert"][approach]["precisionM"] *
          result["expert"][approach]["recallM"])) /
      (result["expert"][approach]["precisionM"] +
        result["expert"][approach]["recallM"]);
  }

  // ========= paid ========
  for (const approach in result.paid) {
    result["paid"][approach]["accurancy"] =
      (matrix["paid"][approach][0][0] +
        matrix["paid"][approach][1][1] +
        matrix["paid"][approach][2][2]) /
      matrix.totalpaid[approach];

    //precisionY
    result["paid"][approach]["precisionY"] =
      matrix["paid"][approach][0][0] /
      (matrix["paid"][approach][0][0] +
        matrix["paid"][approach][1][0] +
        matrix["paid"][approach][2][0]);

    //precisionN
    result["paid"][approach]["precisionN"] =
      matrix["paid"][approach][0][0] /
      (matrix["paid"][approach][0][0] +
        matrix["paid"][approach][1][0] +
        matrix["paid"][approach][2][0]);

    //precisionM
    result["paid"][approach]["precisionM"] =
      matrix["paid"][approach][2][2] /
      (matrix["paid"][approach][2][2] +
        matrix["paid"][approach][1][2] +
        matrix["paid"][approach][0][2]);

    //recallY
    result["paid"][approach]["recallY"] =
      matrix["paid"][approach][1][1] /
      (matrix["paid"][approach][1][1] +
        matrix["paid"][approach][1][0] +
        matrix["paid"][approach][1][2]);

    //recallN
    result["paid"][approach]["recallN"] =
      matrix["paid"][approach][0][0] /
      (matrix["paid"][approach][0][0] +
        matrix["paid"][approach][0][1] +
        matrix["paid"][approach][0][2]);

    //recallM
    result["paid"][approach]["recallM"] =
      matrix["paid"][approach][2][2] /
      (matrix["paid"][approach][2][2] +
        matrix["paid"][approach][2][0] +
        matrix["paid"][approach][2][1]);

    result["paid"][approach]["F1Y"] =
      (2 *
        (result["paid"][approach]["precisionY"] *
          result["paid"][approach]["recallY"])) /
      (result["paid"][approach]["precisionY"] +
        result["paid"][approach]["recallY"]);

    result["paid"][approach]["F1N"] =
      (2 *
        (result["paid"][approach]["precisionN"] *
          result["paid"][approach]["recallN"])) /
      (result["paid"][approach]["precisionN"] +
        result["paid"][approach]["recallN"]);

    result["paid"][approach]["F1M"] =
      (2 *
        (result["paid"][approach]["precisionM"] *
          result["paid"][approach]["recallM"])) /
      (result["paid"][approach]["precisionM"] +
        result["paid"][approach]["recallM"]);
  }
  // ========= unpaid ========
  for (const approach in result.unpaid) {
    result["unpaid"][approach]["accurancy"] =
      (matrix["unpaid"][approach][0][0] +
        matrix["unpaid"][approach][1][1] +
        matrix["unpaid"][approach][2][2]) /
      matrix.totalunpaid[approach];

    //precisionY
    result["unpaid"][approach]["precisionY"] =
      matrix["unpaid"][approach][0][0] /
      (matrix["unpaid"][approach][0][0] +
        matrix["unpaid"][approach][1][0] +
        matrix["unpaid"][approach][2][0]);

    //precisionN
    result["unpaid"][approach]["precisionN"] =
      matrix["unpaid"][approach][0][0] /
      (matrix["unpaid"][approach][0][0] +
        matrix["unpaid"][approach][1][0] +
        matrix["unpaid"][approach][2][0]);

    //precisionM
    result["unpaid"][approach]["precisionM"] =
      matrix["unpaid"][approach][2][2] /
      (matrix["unpaid"][approach][2][2] +
        matrix["unpaid"][approach][1][2] +
        matrix["unpaid"][approach][0][2]);

    //recallY
    result["unpaid"][approach]["recallY"] =
      matrix["unpaid"][approach][1][1] /
      (matrix["unpaid"][approach][1][1] +
        matrix["unpaid"][approach][1][0] +
        matrix["unpaid"][approach][1][2]);

    //recallN
    result["unpaid"][approach]["recallN"] =
      matrix["unpaid"][approach][0][0] /
      (matrix["unpaid"][approach][0][0] +
        matrix["unpaid"][approach][0][1] +
        matrix["unpaid"][approach][0][2]);

    //recallM
    result["unpaid"][approach]["recallM"] =
      matrix["unpaid"][approach][2][2] /
      (matrix["unpaid"][approach][2][2] +
        matrix["unpaid"][approach][2][0] +
        matrix["unpaid"][approach][2][1]);

    result["unpaid"][approach]["F1Y"] =
      (2 *
        (result["unpaid"][approach]["precisionY"] *
          result["unpaid"][approach]["recallY"])) /
      (result["unpaid"][approach]["precisionY"] +
        result["unpaid"][approach]["recallY"]);

    result["unpaid"][approach]["F1N"] =
      (2 *
        (result["unpaid"][approach]["precisionN"] *
          result["unpaid"][approach]["recallN"])) /
      (result["unpaid"][approach]["precisionN"] +
        result["unpaid"][approach]["recallN"]);

    result["unpaid"][approach]["F1M"] =
      (2 *
        (result["unpaid"][approach]["precisionM"] *
          result["unpaid"][approach]["recallM"])) /
      (result["unpaid"][approach]["precisionM"] +
        result["unpaid"][approach]["recallM"]);
  }

  console.log("result", JSON.stringify(result));
  let content = "";
  for (const userType in result) {
    content += `
    * ${userType}: 
  `;

    for (const approach in result[userType]) {
      content += `
      - Approach ${approach}: 
        Accurancy: ${result[userType][approach]["accurancy"]} 

        Precision Yes: ${result[userType][approach]["precisionY"]}
        Precision No: ${result[userType][approach]["precisionN"]}
        Precision Maybe: ${result[userType][approach]["precisionM"]} 
      
        Recall Yes: ${result[userType][approach]["recallY"]}
        Recall No: ${result[userType][approach]["recallN"]}
        Recall Maybe: ${result[userType][approach]["recallM"]}
      
        F1 Yes: ${result[userType][approach]["F1Y"]}
        F1 No: ${result[userType][approach]["F1N"]}
        F1 Maybe: ${result[userType][approach]["F1M"]} \n
  `;
    }
  }

  fs.writeFileSync("./reports/accurance-by-tranning-apps.txt", content);
  return;
}

// File 1 xem có bao nhiều người chọn theo từng phương án (Yes, No, Maybe)
// File 2 chứa các comment của họ
const main = async () => {
  // const types = ["normal", "microworker"];
  // for (let i = 0; i < types.length; i++) {
  //   const type = types[i];

  //   await Promise.all([file1(type), file2(type), file3(type), file4(type)]);
  // }

  // const regions = {
  //   "0d3a745340d0": "Europe East",
  //   "99cf426fa790": "Latin America",
  //   "7cfcb3709b44": "Europe West",
  //   "4d74caeee538": "Asia - Africa",
  //   e0a4b9cf46eb: "USA - Western"
  // };

  // for (const campaignId in regions) {
  //   await file4ByRegion(campaignId);
  // }

  // await usersPaid();

  // await confusionMaxtrix();
  // await metricsDefinition();

  for (let i = 1; i < 6; i++) {
    await Promise.all([
      calculateAccuranceByAlgorithm("SVM", i),
      calculateAccuranceByAlgorithm("GradientBoostingClassifier", i),
      calculateAccuranceByAlgorithm("AdaBoostClassifier", i),
      calculateAccuranceByAlgorithm("GradientBoostingRegressor", i),
      calculateAccuranceByAlgorithm("EM", i)
    ]);

    console.log(
      chalk.default.bgGreen.black("==== Created accurance by algorithms====")
    );
  }

  // await calculateAccuranceByTranningApps();
  // console.log(
  //   chalk.default.bgGreen.black("==== Created accurance by tranning apps ====")
  // );
  console.log(chalk.default.bgGreen.black("==== DONE ===="));
};
// main();
