const router = require("express").Router();

const userController = require("../controllers/user");
const { isAuth, isPremium, isPlayer } = require("../utils/authUtils");

router.post("/signing", userController.signing);
router.post("/signup", userController.signup);
router.patch("/update", isAuth, userController.update);
router.get("/getAllUsers", isAuth, userController.getAllUsers);
router.get("/getUserById", isAuth, userController.getUserById);
router.delete("/id/", userController.deleteFreshUser);

module.exports = router;
