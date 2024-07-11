const { UserController } = require("../../controller");
const { UserMiddleware } = require("../../middlewares");
const express = require("express");
const router = express.Router();

router.route("/").post(UserMiddleware.createUserMiddleware, UserController.registerUser);
router.route("/login").post(UserMiddleware.loginUserMiddleware, UserController.loginUser);
router.route("/logout").post(UserController.logoutUser);
router.route("/").get((req, res) => {
    res.send("Inside User");
});

module.exports = router;