// Import exress and create a router
const express = require("express");
const router = express.Router();

// Importing Payment Controllers
const { enrollContract } = require("../controllers/Enrollment");
// Importing Middlewares
const { auth, isFarmer } = require("../middlewares/auth");

// Enroll the Contract(by farmers only) [POST /enrollContract]
router.post("/enrollContract", auth, isFarmer, enrollContract);

module.exports = router;
