const mongoose = require("mongoose");
const schema = mongoose.Schema;

const awardsSchema = new schema(
  {
    title: { type: String, required: true, default: "Default" },
    desc: { type: String },
    type: { type: String },
    status: { type: String, enum: ["Enable", "Disable"], default: "Enable" },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const award = mongoose.model("awards", awardsSchema);

module.exports = award;
