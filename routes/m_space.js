const express = require("express");
const router = express.Router();

const mSpace = require("../service/m_space");

router.post("/sms/send/", mSpace.sendSMS);
router.post("/caas/direct/debit/", mSpace.directDebit);
router.get("/subscription/notify/", mSpace.catchNewSubscriptionNotify);

module.exports = router;
