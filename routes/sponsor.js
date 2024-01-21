const express = require("express");
const router = express.Router();

const { isAuth, isPremium, isPlayer } = require("../utils/authUtils");

const sponsorController = require("../controllers/sponsor");
require("../controllers/organization");
router.post("/create", isAuth, isPremium, sponsorController.createSponsor);
router.get("/name", isAuth, sponsorController.getSponsorByName);
router.get("/status", isAuth, sponsorController.getSponsorsByStatus);
router.put("/update", isAuth, isPremium, sponsorController.updateSponsor);
router.post("/ids", isAuth, sponsorController.getSponsorsByIdList);

module.exports = router;
