const mongoose = require("mongoose");
const schema = mongoose.Schema;
// const validator = require('validator');

const eventAnnouncementSchema = new schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    content_text: { type: String, required: true },
    content_art_works: [
      {
        cloud_id: { type: String },
        name: { type: String },
        url: { type: String },
      },
    ],
    validate_date_time: {
      type: Date,
      required: true,
      default: "2023-03-14T00:00:00.000+00:00",
    },
    reminder_type: { type: String },
    reminder_frq: { type: Number, default: 0 },
    cover_area: { type: String },
    covering_ids: [{ type: mongoose.ObjectId }],
    ea_selection_group: [
      {
        group_id: { type: mongoose.ObjectId },
        type: { type: String },
        status: {
          type: String,
          enum: ["Enable", "Disable"],
          default: "Enable",
        },
        ea_targets: [
          {
            target_id: { type: mongoose.ObjectId },
            status: {
              type: String,
              enum: ["Enable", "Disable"],
              default: "Enable",
            },
          },
        ],
      },
    ],
    tournament_event_id: { type: mongoose.ObjectId },
    status: { type: String, enum: ["Enable", "Disable"], default: "Enable" },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

const event_announcement = mongoose.model(
  "event_announcements",
  eventAnnouncementSchema,
);

module.exports = event_announcement;
