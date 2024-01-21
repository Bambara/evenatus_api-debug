const mongoose = require("mongoose");
const schema = mongoose.Schema;
// const validator = require('validator');

const tournamentSchema = new schema(
  {
    name: { type: String, required: true },
    start_date: { type: String },
    start_time: { type: String },
    end_date: { type: String },
    end_time: { type: String },
    reg_open_date: { type: String },
    reg_open_time: { type: String },
    reg_close_date: { type: String },
    reg_close_time: { type: String },
    art_works: [
      {
        cloud_id: { type: String },
        name: { type: String },
        url: { type: String },
      },
    ],
    type: { type: String },
    participant_type: { type: String },
    status: {
      type: String,
      enum: ["Schedule", "Ongoing", "Finished", "Cancel"],
      default: "Schedule",
    },
    to_list: [
      {
        organization_id: { type: mongoose.ObjectId },
        type: { type: String },
        role: { type: String },
        status: {
          type: String,
          default: "Enable",
          enum: ["Enable", "Disable"],
        },
      },
    ],
    ts_list: [
      {
        sponsor_id: { type: mongoose.ObjectId },
        type: { type: String },
        coverage: { type: String },
        status: {
          type: String,
          enum: ["Enable", "Disable"],
          default: "Enable",
        },
      },
    ],
    team_groups: [
      {
        code: { type: String },
        name: { type: String },
        status: {
          type: String,
          enum: ["Enable", "Disable"],
          default: "Enable",
        },
      },
    ],
    team_sides: [
      {
        side: { type: String },
        name: { type: String },
        status: {
          type: String,
          enum: ["Enable", "Disable"],
          default: "Enable",
        },
      },
    ],
    tg_list: [
      {
        status: {
          type: String,
          enum: ["Enable", "Disable"],
          default: "Enable",
        },
        game_id: { type: mongoose.ObjectId },
      },
    ],
    finance_details: [
      {
        type: { type: String },
        bank: { type: String },
        branch: { type: String },
        account_number: { type: String },
        account_holder: { type: String },
        status: {
          type: String,
          enum: ["Enable", "Disable"],
          default: "Enable",
        },
      },
    ],
    tct_list: [
      {
        code: { type: String },
        name: { type: String },
        avatar: {
          cloud_id: { type: String },
          name: { type: String },
          url: { type: String },
        },
        role: { type: String },
        status: {
          type: String,
          enum: ["Enable", "Disable"],
          default: "Enable",
        },
        members: [
          {
            user_id: { type: mongoose.ObjectId },
            role: { type: String },
            status: {
              type: String,
              enum: ["Enable", "Disable"],
              default: "Enable",
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const tournament = mongoose.model("tournaments", tournamentSchema);

module.exports = tournament;
