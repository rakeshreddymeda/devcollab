const Task = require("../models/Task");

exports.createTask = async (req, res) => {
    try {
        const task = await Task.create({
            title: req.body.title,
            project: req.body.project,
            assignedTo: req.body.assignedTo,
            createdBy: req.user.id
        });

        req.app.get("io").emit("taskCreated", task);

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.status = req.body.status;
        await task.save();
        req.app.get("io").emit("taskUpdated", task);
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            project: req.params.projectId
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        req.app.get("io").emit("taskDeleted", req.params.id);
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error"});
    }
};

exports.addComment = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        task.comments.push({
            text: req.body.text,
            user: req.user.id
        });
        await task.save();
        req.app.get("io").emit("commentAdded", task);
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
