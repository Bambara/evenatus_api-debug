const mongoose = require("mongoose");
const schema = mongoose.Schema;
// const validator = require('validator');

const eventRACSchema = new schema(
  {
    title: { type: String },
    category: { type: String },
    content_text: { type: String },
    validate_date_time: { type: String, required: true },
    cover_area: { type: String },
    covering_ids: [{ type: String }],
    attachments: [
      {
        cloud_id: { type: String },
        name: { type: String },
        url: { type: String },
      },
    ],

    erac_selection_group: [
      {
        type: { type: String },
        boundary: { type: String },
        action: { type: String },
        status: { type: String },
        erac_targets: [
          {
            target_id: { type: mongoose.ObjectId },
            action: { type: String },
          },
        ],
      },
    ],
    te_id: { type: mongoose.ObjectId },
    match_id: { type: mongoose.ObjectId },
    reporter_id: { type: mongoose.ObjectId },
    status: { type: String },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const event_rac = mongoose.model("event_racs", eventRACSchema);

module.exports = event_rac;
