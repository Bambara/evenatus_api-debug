const mongoose = require("mongoose");
const schema = mongoose.Schema;

const playerTeamListSchema = new schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    logo: {
      cloud_id: { type: String },
      name: { type: String },
      url: { type: String },
    },
    team_type: { type: String },
    clan_id: { type: mongoose.ObjectId, required: true },
    club_id: { type: mongoose.ObjectId, required: true },
    members: [
      {
        is_leader: { type: Boolean },
        remark: { type: String },
        status: {
          type: String,
          enum: ["Enable", "Disable"],
          default: "Enable",
        },
        default_ign: { type: String },
        player_profile_id: { type: mongoose.ObjectId, required: true },
      },
    ],
    status: { type: String, enum: ["Enable", "Disable"], default: "Enable" },
    tournament_id: { type: mongoose.ObjectId, required: true },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const playerTeam = mongoose.model("player_teams", playerTeamListSchema);

module.exports = playerTeam;
