const express = require("express");
const router = express.Router();

const { isAuth, isPremium, isPlayer } = require("../utils/authUtils");

const orgCtrl = require("../controllers/organization");

router.post("/create", isAuth, isPremium, orgCtrl.createOrganization);

router.get("/name", isAuth, isPremium, orgCtrl.getOrganizationByName);

router.get("/id", isAuth, isPremium, orgCtrl.getOrganizationById);

router.post("/ids", isAuth, orgCtrl.getOrganizationsByIdList);

router.get("/", isAuth, orgCtrl.getAllOrganizations);

router.get("/type", isAuth, orgCtrl.getAllOrganizationsByType);

router.patch("/update", isAuth, isPremium, orgCtrl.updateOrganization);

module.exports = router;
