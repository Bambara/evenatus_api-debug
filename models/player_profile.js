const mongoose = require("mongoose");
const schema = mongoose.Schema;

const playerProfileSchema = new schema(
  {
    default_ign: { type: String },
    avatar: {
      cloud_id: { type: String },
      name: { type: String },
      url: { type: String },
    },
    club_id: { type: mongoose.ObjectId, required: true },
    clan_id: { type: mongoose.ObjectId, required: true },
    local_rank: { type: Number, default: 0.0 },
    global_rank: { type: Number, default: 0.0 },
    win_rate: { type: Number, default: 0.0 },
    toxic_level: { type: Number, default: 0.0 },
    discipline_level: { type: Number, default: 0.0 },
    skill_level: { type: Number, default: 0.0 },
    report_count: { type: Number, default: 0.0 },
    game_list: [
      {
        ign: { type: String },
        play_frequency: [
          {
            type: { type: String },
            value: { type: String },
          },
        ],
        performance_result: {
          match_count: { type: Number, default: 0.0 },
          win_count: { type: Number, default: 0.0 },
          toxic_level: { type: Number, default: 0.0 },
          average_damage: { type: Number, default: 0.0 },
          average_skill: { type: Number, default: 0.0 },
          mvp_count: { type: Number, default: 0.0 },
          remark: { type: String },
        },
        game_id: { type: mongoose.ObjectId, required: true },
      },
    ],
    sponsor_list: [
      {
        type: { type: String },
        agreement_start_date: { type: String },
        agreement_end_date: { type: String },
        remark: { type: String },
        status: {
          type: String,
          enum: ["Enable", "Disable"],
          default: "Enable",
        },
        sponsor_id: { type: mongoose.ObjectId },
      },
    ],
    status: { type: String, enum: ["Enable", "Disable"], default: "Enable" },
    user_id: { type: mongoose.ObjectId, required: true },
  },
  {
    timestamps: true,
  },
);

const player_profile = mongoose.model("player_profiles", playerProfileSchema);

module.exports = player_profile;
