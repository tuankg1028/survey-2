var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var findOrCreate = require("mongoose-findorcreate");

var answerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId
    },
    workerId: {
      type: String
    },
    slotId: {
      type: String
    },
    randKey: {
      type: String
    },
    campaignId: {
      type: String
    },
    categories: [String],
    comment: String,
    clientIp: String,
    isPaid: {
      type: Boolean,
      default: false
    },
    groupSurvey: {
      type: String
    },
    questions: [
      {
        responses: [
          {
            name: {
              type: String,
              required: true
            },
            value: {
              type: String,
              required: true
            }
          }
        ]
      }
    ],
    basicInfo: {
      age: {
        type: String
      },
      gender: {
        type: String
      },
      education: {
        type: String
      },
      occupation: {
        type: String
      },
      fieldOfWork: {
        type: String
      },
      OSOfDevices: {
        type: String
      },
      country: {
        type: String
      },
      email: {
        type: String
      }
    },
    apps: [
      {
        name: {
          type: String,
          required: true
        },
        appId: {
          type: Schema.Types.ObjectId,
          required: true
        },
        response: { type: String, required: true },
        time: Schema.Types.Number,
        comment: String,
        nodes: [
          {
            name: {
              type: String,
              required: true
            },
            response: { type: String },
            leafNodes: [
              {
                name: String,
                response: String
              }
            ]
          }
        ]
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);
answerSchema.plugin(findOrCreate);

answerSchema.virtual("user", {
  ref: "user",
  localField: "_id",
  foreignField: "userId"
});

export default mongoose.model("answer", answerSchema);
