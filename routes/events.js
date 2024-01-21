const router = require("express").Router();

const authUtils = require("../utils/authUtils");

const eventController = require("../controllers/events.js");

router.post(
  "/add_event",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.createTournamentEvent,
);

router.get(
  "/",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.getAllEvents,
);

router.get(
  "/tournament_id",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.getEventsByTournamentId,
);

router.patch(
  "/update_event",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.updateTournamentEvent,
);

router.delete(
  "/remove_event",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.deleteTournamentEvent,
);

router.delete(
  "/",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.deleteTournamentEvent,
);

router.post(
  "/player_team/assign/",
  authUtils.isAuth,
  eventController.assignPlayerTeam,
);

router.post(
  "/player_team/assign/event_list/",
  authUtils.isAuth,
  eventController.assignPlayerTeamToEventList,
);

router.get(
  "/player_team/te_id/",
  authUtils.isAuth,
  eventController.getAllAssignedPlayerTeamsByEventId,
);

router.get(
  "/player_team/ptl_id/",
  authUtils.isAuth,
  eventController.getAssignedPlayerTeamsByPtlId,
);

router.post(
  "/add_announcement",
  //authUtils.isAuth,
  //authUtils.isPremium,
  eventController.addEventAnnouncement,
);

router.post(
  "/add_rar",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.createEvent_rar,
);

router.delete(
  "/remove_rar",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.removeRAROfEvent,
);

router.get(
  "/get_rars",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.getAllRARsByEventId,
);

router.post(
  "/update_rar",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.updateRAROfEvent,
);

router.post(
  "/add_rac",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.createEvent_rac,
);

router.post(
  "/update_rac",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.updateRACOfEvent,
);

router.delete(
  "/remove_rac",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.removeRACOfEvent,
);

router.get(
  "/get_rac",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.getAllRACsByRACId,
);

router.get(
  "/get_racs",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.getAllEventRACs,
);

router.delete(
  "/player_team/resign/",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.resignTeam,
);

router.patch(
  "/player_team/update",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.updateEventAssignedTeam,
);

router.patch(
  "/announcement/update",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.updateEventAnnouncement,
);

router.get(
  "/announcement/get/all",
  authUtils.isAuth,
  authUtils.isPremium,
  eventController.getAllAnnouncementsOfEvent,
);

module.exports = router;
