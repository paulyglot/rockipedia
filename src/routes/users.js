const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController");
const User = require('../../src/db/models').User;

router.get("/users/signup", userController.signUp);
router.get("/users/sign_in", userController.signInForm);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);
router.get("/users/sign_out", userController.signOut);
router.post("/users", validation.validateUsers, userController.create);

module.exports = router;