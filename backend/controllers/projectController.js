const Project = require("../models/Project");

exports.createProject = async (req, res) => {
    try {
        const project = await Project.create({
            title: req.body.title,
            description: req.body.description,
            owner: req.user.id,
            members: [req.user.id]
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ members: req.user.id });
        res.json(projects);
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
};
