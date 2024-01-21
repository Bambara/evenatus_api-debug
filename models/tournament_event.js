const mongoose = require("mongoose");
const schema = mongoose.Schema;

const tournamentEventsSchema = new schema(
  {
    event_name: { type: String, required: true },
    event_type: { type: String, required: true },
    team_type: { type: String, required: true },
    art_works: [
      {
        cloud_id: { type: String },
        name: { type: String },
        url: { type: String },
      },
    ],
    status: { type: String, required: true },
    game_id: { type: mongoose.ObjectId },
    tournament_id: { type: mongoose.ObjectId },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const tournamentEvent = mongoose.model(
    "tournament_events",
    tournamentEventsSchema,
);

module.exports = tournamentEvent;
