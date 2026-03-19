const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const { createProject, getProjects, deleteProject, addMember, displayProjectMembers, deleteMember } = require("../controllers/projectController");

router.post("/", auth, createProject);
router.get("/", auth, getProjects);
router.delete("/:id", auth, deleteProject);
router.put("/:id/add-member", auth, addMember);
router.get("/:id/members", auth, displayProjectMembers);
router.delete("/:id/delete-member/:memberId", auth, deleteMember);

module.exports = router;
