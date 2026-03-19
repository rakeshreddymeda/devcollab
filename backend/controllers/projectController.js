const Project = require("../models/Project");
const User = require("../models/User");

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

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Project deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error"});
    }
};

exports.addMember = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const project = await Project.findById(req.params.id);
        if (!project.members.includes(user._id)) {
            project.members.push(user._id);
            await project.save();
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.displayProjectMembers = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate("members", "_id name email");
        // const members = await User.find({ _id: { $in: project.members } }).select("_id name email");
        res.json(project.members);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

exports.deleteMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        const user = await User.findById(req.params.memberId);
        project.members = project.members.filter(member => member.toString() !== user._id.toString());
        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
