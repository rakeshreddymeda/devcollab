const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const { createTask, updateTaskStatus, getTasks } = require("../controllers/taskController");

router.post("/", auth, createTask);
router.put("/:id/status", auth, updateTaskStatus);
router.get("/:projectId", auth, getTasks);

module.exports = router;