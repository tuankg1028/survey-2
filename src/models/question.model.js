var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var findOrCreate = require("mongoose-findorcreate");

var schema = new Schema(
  {
    id: String,
    name: String,
    path: String,
    type: String,
    param2: { type: Object },
    param3: {
      type: Object
    },
    text: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);
schema.plugin(findOrCreate);
export default mongoose.model("question", schema);
