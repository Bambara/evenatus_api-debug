const mongoose = require("mongoose");
const schema = mongoose.Schema;

const eventMatchesSchema = new schema(
  {
    name: { type: String },
    start_date: { type: String },
    start_time: { type: String },
    end_date: { type: String },
    end_time: { type: String },
    status: { type: String },
    te_id: { type: mongoose.ObjectId, required: true },
    tournament_id: { type: mongoose.ObjectId, required: true },
    match_place: {
      address: { type: String },
      gps_location: {
        latitude: { type: String },
        longitude: { type: String },
      },
      images: [
        {
          cloud_id: { type: String },
          name: { type: String },
          url: { type: String },
        },
      ],
    },
    match_results: {
      win_teams: [
        {
          match_team_id: { type: mongoose.ObjectId },
          place: { type: String },
        },
      ],
      awards: [
        {
          award_id: { type: mongoose.ObjectId },
          winner_id: { type: mongoose.ObjectId },
          winner_type: { type: String },
        },
      ],
    },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const event_matches = mongoose.model("event_matches", eventMatchesSchema);

module.exports = event_matches;
