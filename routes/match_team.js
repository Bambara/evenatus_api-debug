const express = require("express");
const router = express.Router();

const authUtils = require("../utils/authUtils");

const eventMatchController = require("../controllers/event_matches");

router.get(
  "/",
  authUtils.isAuth,
  authUtils.isPremium,
  eventMatchController.Get_All_Teams_Of_Match,
);

module.exports = router;
