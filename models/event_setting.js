const mongoose = require("mongoose");
const schema = mongoose.Schema;

const eventSettingsSchema = new schema(
  {
    title: { type: String, required: true, default: "Default" },
    point_system: [
      {
        covering_area: { type: String },
        category_id: { type: mongoose.ObjectId },
        reserved_points: { type: Number, default: 0 },
        point_type: { type: String, default: "Positive" },
        value_per_point: { type: Number, default: 0 },
        target_type: { type: String, default: "Individual" },
        status: { type: String, default: "Enable" },
      },
    ],
    te_id: { type: mongoose.ObjectId, required: true },
    tournament_id: { type: mongoose.ObjectId, required: true },
    status: { type: String, enum: ["Enable", "Disable"], default: "Enable" },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const award = mongoose.model("event_settings", eventSettingsSchema);

module.exports = award;
