const mongoose = require("mongoose");
const schema = mongoose.Schema;
const validator = require("validator");

const userSchema = new schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    user_name: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.default.isEmail,
        message: "{VALUE} is not a valid email",
        isAsync: false,
      },
    },
    mobile: {
      type: String,
      required: true,
      validate: {
        validator: validator.default.isMobilePhone,
        message: "{VALUE} is not a valid mobile number",
        isAsync: false,
      },
    },
    contact_info: {
      email_address: { type: String },
      mobile_number: { type: String },
      work_number: { type: String },
      fax_number: { type: String },
      web_address: { type: String },
    },
    address_info: {
      line_01: { type: String },
      line_02: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zip_code: { type: String },
    },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["PREMIUM", "FREE"] },
    tfa_status: { type: String },
    status: { type: String, enum: ["Enable", "Disable"], default: "Enable" },
    avatar: {
      cloud_id: {
        type: String,
        default: "users/gamer_stlxnd",
      },
      name: { type: String, default: "gamer_stlxnd" },
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dptexius9/image/upload/v1672609164/users/gamer_stlxnd.png",
      },
    },
    account_type: [
      {
        type: { type: String },
        status: { type: Boolean },
      },
    ],
    play_frequency: [
      {
        type: { type: String },
        value: { type: String },
      },
    ],
    reminder_type: [
      {
        type: { type: String },
        status: { type: Boolean },
      },
    ],
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

const user = mongoose.model("user_profiles", userSchema);

module.exports = user;
