const mongoose = require("mongoose");
const schema = mongoose.Schema;
// const validator = require('validator');

const packageFeatureSchema = new schema(
  {
    title: { type: String },
    package_type: { type: String },
    description: { type: String },
    value_factor: { type: Number, default: 0 },
    status: { type: String },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const packageFeature = mongoose.model("package_features", packageFeatureSchema);

module.exports = packageFeature;
