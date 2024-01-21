const mongoose = require("mongoose");
const schema = mongoose.Schema;
// const validator = require('validator');

const gameSchema = new schema(
  {
    name: { type: String, unique: true, required: true },
    poster: {
      cloud_id: { type: String },
      name: { type: String },
      url: { type: String },
    },
    age_category: { type: String, required: true },
    publisher_id: { type: mongoose.ObjectId, required: true },
    play_type: { type: String },
    player_type: { type: String },
    status: { type: String },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const game = mongoose.model("games", gameSchema);

module.exports = game;
