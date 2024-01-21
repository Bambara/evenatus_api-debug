const mongoose = require("mongoose");
const schema = mongoose.Schema;
// const validator = require('validator');

const mcProfileSchema = new schema(
  {
    status: { type: String },
    user_id: { type: mongoose.ObjectId },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const mc_profile = mongoose.model("mc_profiles", mcProfileSchema);

module.exports = mc_profile;
