const express = require("express");
const router = express.Router();

const authUtils = require("../utils/authUtils");

const eventMatchController = require("../controllers/event_matches");

router.post(
  "/",
  authUtils.isAuth,
  authUtils.isPremium,
  eventMatchController.createEventMatches,
);

router.put(
  "/",
  authUtils.isAuth,
  authUtils.isPremium,
  eventMatchController.updateEventMatches,
);

router.delete(
  "/",
  authUtils.isAuth,
  authUtils.isPremium,
  eventMatchController.deleteEventMatches,
);

router.get(
  "/t_id/",
  authUtils.isAuth,
  // authUtils.isPremium,
  eventMatchController.getAllMatchesByTournamentId,
);

router.get(
  "/te_id/",
  authUtils.isAuth,
  // authUtils.isPremium,
  eventMatchController.getAllMatchesByEventId,
);

router.get(
  "/match_id",
  authUtils.isAuth,
  authUtils.isPremium,
  eventMatchController.getMatchDetailsByMatchId,
);

router.post(
  "/teams/assign",
  authUtils.isAuth,
  authUtils.isPremium,
  eventMatchController.createAssignMatchTeam,
);

router.patch(
  "/teams/score",
  authUtils.isAuth,
  authUtils.isPremium,
  eventMatchController.updateMatchTeamResult,
);

router.patch(
  "/teams/member/score",
  authUtils.isAuth,
  authUtils.isPremium,
  eventMatchController.updateMatchTeamMemberScore,
);

router.post(
  "/teams/assign",
  authUtils.isAuth,
  // authUtils.isPremium,
  eventMatchController.getAllAssignedTeamsOfMatch,
);

module.exports = router;
