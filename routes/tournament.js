const router = require("express").Router();

const tournamentController = require("../controllers/tournament");
const { isAuth, isPremium, isPlayer } = require("../utils/authUtils");

router.post(
  "/create",
  isAuth,
  isPremium,
  tournamentController.createTournament,
);
router.delete(
  "/delete",
  isAuth,
  isPremium,
  tournamentController.deleteTournament,
);
router.patch(
  "/update",
  isAuth,
  isPremium,
  tournamentController.updateTournament,
);
router.post(
  "/team/registration",
  isAuth,
  tournamentController.playerTeamRegistration,
);
router.get(
  "/teams/tournament_id",
  isAuth,
  tournamentController.getRegisteredPlayerTeams,
);
router.get(
  "/tc_member/id",
  isAuth,
  isPremium,
  tournamentController.getTournamentsByTCMemberId,
);
router.patch(
  "/team/update",
  isAuth,
  tournamentController.updateTournamentPlayerTeam,
);
router.patch(
  "/team/resign",
  isAuth,
  isPremium,
  tournamentController.resignPlayer,
);
router.patch(
  "/team/player/resign",
  isAuth,
  isPremium,
  tournamentController.resignPlayer,
);
router.post("/tc_team/add", isAuth, isPremium, tournamentController.addTCTeam);
router.get(
  "/tc_team/t_id/",
  isAuth,
  isPremium,
  tournamentController.getTCTeams,
);
module.exports = router;
