const express = require("express");
const router = express.Router();

const serviceSMS = require("../service/sms");

router.post("/send/", serviceSMS.sendSMS);

module.exports = router;
