const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true 
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        req: "User"
    },

    status: {
        type: String,
        enum: ["pending", "in-progress", "Completed"],
        default: "pending"
    },

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);