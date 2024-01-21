const mongoose = require("mongoose");
const schema = mongoose.Schema;

const sponsorSchema = new schema(
  {
    name: { type: String, required: true, unique: true },
    business_name: { type: String, required: true },
    sponsor_type: { type: String },
    art_works: [
      {
        cloud_id: { type: String },
        name: { type: String },
        url: { type: String },
      },
    ],
    ts_rate: { type: Number, default: 0 },
    ps_rate: { type: Number, default: 0 },
    status: { type: String, enum: ["Enable", "Disable"], default: "Enable" },
    user_id: { type: mongoose.ObjectId, required: true },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

module.exports = sponsor = mongoose.model("sponsor_profiles", sponsorSchema);
