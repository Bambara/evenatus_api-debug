const mongoose = require("mongoose");
const schema = mongoose.Schema;
// const validator = require('validator');

const eventTeamAssignSchema = new schema(
  {
    status: { type: String },
    card_color: { type: String },
    ptl_id: { type: mongoose.ObjectId, required: true },
    te_id: { type: mongoose.ObjectId, required: true },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const event_team_assign = mongoose.model(
  "event_team_assigns",
  eventTeamAssignSchema,
);

module.exports = event_team_assign;
