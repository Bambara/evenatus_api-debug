const mongoose = require("mongoose");
const schema = mongoose.Schema;

const matchTeamListSchema = new schema(
  {
    remark: { type: String },
    status: { type: String },
    match_id: { type: mongoose.ObjectId },
    mc_profile_id: { type: mongoose.ObjectId },
    eta_id: { type: mongoose.ObjectId },
    team_side_id: { type: mongoose.ObjectId },
    team_group_id: { type: mongoose.ObjectId },
    team_score: {
      toxic_level: { type: String },
      total_damage: { type: Number, default: 0 },
      total_kills: { type: Number, default: 0 },
      win_rate: { type: Number, default: 0 },
      skill_level: { type: String },
      place: { type: String },
      total_points: { type: String },
      overall_score: { type: String },
      remark: { type: String },
    },
    member_score: [
      {
        member_id: { type: mongoose.ObjectId },
        toxic_level: { type: String },
        total_damage: { type: Number, default: 0 },
        total_kills: { type: Number, default: 0 },
        win_rate: { type: Number, default: 0 },
        skill_level: { type: String },
        is_mvp: { type: String },
        place: { type: String },
        total_points: { type: String },
        overall_score: { type: String },
        remark: { type: String },
      },
    ],
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const match_team = mongoose.model("match_teams", matchTeamListSchema);

module.exports = match_team;
