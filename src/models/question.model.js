var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var findOrCreate = require("mongoose-findorcreate");

var schema = new Schema(
  {
    id: String,
    name: String,
    lv1: { type: Map },
    lv3: { type: Map },
    subItem: {
      type: Map
    },
    text: String
  },
  {
    timestamps: true
  }
);
schema.plugin(findOrCreate);
export default mongoose.model("question", schema);
