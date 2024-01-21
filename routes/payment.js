const router = require("express").Router();

const paymentCtrl = require("../controllers/payment");
const { isAuth, isPremium, isPlayer } = require("../utils/authUtils");

router.post("/pay/", isAuth, paymentCtrl.addTPayment);
router.get("/", isAuth, paymentCtrl.getAllTPayments);
router.patch("/update/", isAuth, isPremium, paymentCtrl.updateTPayment);
router.delete("/", isAuth, isPremium, paymentCtrl.deleteTPayment);

module.exports = router;
