const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const { createTask, updateTaskStatus, getTasks, deleteTask } = require("../controllers/taskController");

router.post("/", auth, createTask);
router.put("/:id/status", auth, updateTaskStatus);
router.get("/:projectId", auth, getTasks);
router.delete("/:id", auth, deleteTask);

module.exports = router;
