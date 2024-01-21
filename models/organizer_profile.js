const mongoose = require("mongoose");
const schema = mongoose.Schema;

const organizerSchema = new schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String },
    avatar: {
      cloud_id: { type: String },
      name: { type: String },
      url: { type: String },
    },
    status: { type: String, enum: ["Enable", "Disable"], default: "Enable" },
    user_id: { type: mongoose.ObjectId, required: true, unique: true },
    organization_id: { type: mongoose.ObjectId },
  },
  { timestamps: true },
);

const organizer = mongoose.model("organizer_profiles", organizerSchema);

module.exports = organizer;
