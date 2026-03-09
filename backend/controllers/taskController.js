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
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
