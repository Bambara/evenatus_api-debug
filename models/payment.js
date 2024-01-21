const mongoose = require("mongoose");
const schema = mongoose.Schema;

const paymentSchema = new schema(
  {
    pay_amount: { type: Number, required: true, default: 0 },
    pay_methode: { type: String, required: true },
    payer_type: { type: String, required: true },
    payer_id: { type: mongoose.ObjectId, required: true },
    target_type: { type: String, required: true },
    target_id: { type: mongoose.ObjectId, required: true },
    ref_number: { type: String, required: true },
    attachments: [
      {
        cloud_id: { type: String },
        name: { type: String },
        url: { type: String },
      },
    ],
    pay_reason: { type: String, required: true },
    pay_reason_id: { type: mongoose.ObjectId, required: true },
    remark: { type: String },
    trace: { type: String, required: true, unique: true },
    approve_status: { type: String, required: true },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const tournamentPayment = mongoose.model("payments", paymentSchema);

module.exports = tournamentPayment;
