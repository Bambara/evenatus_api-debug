const mongoose = require("mongoose");
const schema = mongoose.Schema;
// const validator = require('validator');

const eventRARSchema = new schema(
  {
    title: { type: String },
    category: { type: String },
    content_text: { type: String },
    validate_date_time: { type: String, required: true },
    cover_area: { type: String },
    covering_ids: [{ type: String }],
    ea_selection_group: [
      {
        group_id: { type: mongoose.ObjectId },
        type: { type: String },
        status: { type: String },
        ea_targets: [
          {
            target_id: { type: mongoose.ObjectId },
            status: { type: String },
          },
        ],
      },
    ],
    status: { type: String },
    te_id: { type: String },
    match_id: { type: String },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const event_rar = mongoose.model("event_rars", eventRARSchema);

module.exports = event_rar;
