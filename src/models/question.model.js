var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var findOrCreate = require("mongoose-findorcreate");

var schema = new Schema(
  {
    id: String,
    name: String,
    lv1: { type: Object },
    lv3: { type: Object },
    subItem: {
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
