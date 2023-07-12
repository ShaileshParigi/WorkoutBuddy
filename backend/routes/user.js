const express = require("express");

const router = express.Router();

const { loginUser, signupUser } = require("../Controllers/userController");

//Login route
router.post("/login", loginUser);

//Signup route
router.post("/signup", signupUser);

module.exports = router;
