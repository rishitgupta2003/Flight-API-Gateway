const { UserController } = require("../../controller");
const { UserMiddleware } = require("../../middlewares");
const express = require("express");
const router = express.Router();

router.route("/").post(UserMiddleware.createUserMiddleware, UserController.registerUser);
router.route("/").get((req, res) => {
    res.send("Working");
});

module.exports = router;