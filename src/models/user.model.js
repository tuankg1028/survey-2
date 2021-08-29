var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var findOrCreate = require("mongoose-findorcreate");

var userSchema = new Schema(
  {
    email: String,
    fullName: String,
    education: String,
    city: String,
    country: String,
    speciality: String,
    occupation: String,
    age: Number,
    groupSurvey: String,
    questionIds: [String],
    campaignId: {
      type: String
    },
    nextStage: {
      type: String,
      default: "training"
    },
    nextQuestionId: mongoose.Types.ObjectId,
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
    isAnswerd: {
      type: Boolean,
      default: false
    },
    gender: {
      type: String,
      enum: ["male", "female"]
    },
    fieldOfWork: {
      type: String
    },
    OSOfDevices: {
      type: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

userSchema.virtual("answers", {
  ref: "answer",
  localField: "_id",
  foreignField: "userId"
});

userSchema.plugin(findOrCreate);

export default mongoose.model("user", userSchema);
