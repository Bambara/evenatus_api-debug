const router = require("express").Router();

const playerCtrl = require("../controllers/player");
const { isAuth, isPremium, isPlayer } = require("../utils/authUtils");

router.get("/unregistered", isAuth, playerCtrl.getUnregisteredPlayers);
router.get("/tournament/register/not", isAuth, playerCtrl.getTNotRegPlayers);
router.get("/tournament/register/yes", isAuth, playerCtrl.getTRegPlayers);
router.post("/profile", isAuth, isPlayer, playerCtrl.createPlayerProfile);
router.patch("/profile", isAuth, isPlayer, playerCtrl.updatePlayerProfile);

router.get(
  "/profile/user_id/",
  isAuth,
  isPlayer,
  playerCtrl.getPlayerProfileByUserId,
);

module.exports = router;
