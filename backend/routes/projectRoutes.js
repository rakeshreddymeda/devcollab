const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const { createProject } = require("../controllers/projectController");

router.post("/", auth, createProject);

module.exports = router;
