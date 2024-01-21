const mongoose = require("mongoose");
const schema = mongoose.Schema;
// const validator = require('validator');

const subscriptionPackagesSchema = new schema(
  {
    title: { type: String },
    type: { type: String },
    description: { type: String },
    feature_list: [
      {
        package_features_id: { type: mongoose.ObjectId },
        status: { type: String, default: "Active" },
      },
    ],
    base_value: { type: Number, default: 0 },
    value_per_feature: { type: Number, default: 0 },
    total_feature_value: { type: Number, default: 0 },
    net_value: { type: Number, default: 0 },
    status: { type: String, enum: ["Enable", "Disable"], default: "Enable" },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const subscriptionPackages = mongoose.model(
  "subscription_packages",
  subscriptionPackagesSchema,
);

module.exports = subscriptionPackages;
