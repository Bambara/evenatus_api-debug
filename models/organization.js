const mongoose = require("mongoose");
const schema = mongoose.Schema;

const organizationSchema = new schema(
  {
    name: { type: String, required: true, unique: true },
    logo: {
      cloud_id: { type: String },
      name: { type: String },
      url: { type: String },
    },
    type: { type: String },
    status: { type: String, enum: ["Enable", "Disable"], default: "Enable" },
    members: [
      {
        level: { type: String },
        member_id: { type: mongoose.ObjectId, required: true },
        status: {
          type: String,
          enum: ["Enable", "Disable"],
          default: "Enable",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = organization = mongoose.model(
  "organizations",
  organizationSchema,
);
