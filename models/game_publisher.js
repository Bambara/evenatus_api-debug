const mongoose = require("mongoose");
const schema = mongoose.Schema;

const gamePublisherSchema = new schema(
  {
    name: { type: String, required: true },
    logo: {
      cloud_id: { type: String },
      name: { type: String },
      url: { type: String },
    },
    status: { type: String },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const game_publishers = mongoose.model("game_publishers", gamePublisherSchema);

module.exports = game_publishers;
