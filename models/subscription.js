const mongoose = require("mongoose");
const schema = mongoose.Schema;

const sponsorSchema = new schema(
  {
    type: { type: String, required: true },
    category: { type: String, required: true },
    purchase_price: { type: Number, default: 0 },
    purchase_date: {
      type: Date,
      required: true,
      default: "2023-03-14T00:00:00.000+00:00",
    },
    billing_cycle: { type: String },
    expire_date: {
      type: Date,
      required: true,
      default: "2023-03-14T00:00:00.000+00:00",
    },
    renewal_date: {
      type: Date,
      required: true,
      default: "2023-03-14T00:00:00.000+00:00",
    },
    renewal_type: { type: String, required: true },
    status: { type: String, enum: ["Enable", "Disable"], default: "Enable" },
    subscription_package_id: { type: mongoose.ObjectId, required: true },
    user_profile_id: { type: mongoose.ObjectId, required: true },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

module.exports = sponsor = mongoose.model("sponsors", sponsorSchema);
