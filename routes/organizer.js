const express = require("express");
const router = express.Router();

const { isAuth, isPremium, isPlayer } = require("../utils/authUtils");

const organizerController = require("../controllers/organizer");

router.post(
  "/create",
  isAuth,
  isPremium,
  organizerController.createOrganizerProfile,
);
router.get("/", isAuth, isPremium, organizerController.getOrganizerProfile);
router.patch(
  "/update",
  isAuth,
  isPremium,
  organizerController.updateOrganizerProfile,
);

module.exports = router;
