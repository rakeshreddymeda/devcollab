const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const { createTask, updateTaskStatus } = require("../controllers/taskController");

router.post("/", auth, createTask);
router.put("/:id/status", auth, updateTaskStatus);

module.exports = router;