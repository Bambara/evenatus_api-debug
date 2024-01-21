const router = require("express").Router();

const gameController = require("../controllers/game.js");
const { isAuth, isPremium, isPlayer } = require("../utils/authUtils");

router.post("/add", isAuth, gameController.getGamesByIdList);
router.get("/", isAuth, gameController.getAllGames);
router.post("/ids", isAuth, gameController.getGamesByIdList);
router.post("/add", isAuth, gameController.addNewGame);
router.get("/All_Games", isAuth, gameController.getAllGames);
router.get("/name", isAuth, gameController.getGameByName);

module.exports = router;
