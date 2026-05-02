console.log("RUNNING FILE:", __filename);
console.log("SERVER FILE RUNNING");
require("dotenv").config();
const User = require("./User");
const Project = require("./Project");
const Task = require("./Task");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || "secretkey123"; // later move to env
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://achhita_pal:6633066330@cluster0.chazgtt.mongodb.net/task-manager-app";
const PORT = process.env.PORT || 8000;

//SIGNUP
app.post("/signup",async(req, res) => {
    try{
        const {name, email, password, role} = req.body;

        if (!name || !email || !password){
            return res.status(400).json({message: "All fields required"});
        }

        //check user exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }
        
        // HASH password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "member" 
        });

        await user.save();
        res.json({message: "User created successfully"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// LOGIN 
app.post("/login", async(req,res) => {
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({message: "Email and password required"});
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

        // COMPARE password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: "Invalid password"});
        }

        // GENERATE JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({message: "Login successful", token});
    } catch (err){
        res.status(500).json({error: err.message});
    }
});

// verify token middleware
const verifyToken = (req, res, next) => {
    console.log("MIDDLEWARE HIT");
    console.log("AUTH HEADER:", req.headers.authorization);
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({message: "No token provided"});
    }

    // barear token
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    }catch (err) {
        return res.status(401).json({message: "Invalid Token"});
    }
};

//DATABASE CONNECTIVITY
mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// TEST ROUTE

app.get("/",(req, res) => {
    res.send("Task Manager API is running");
});

app.get("/test", (req, res) => {
    res.send("Test ok");
});

app.get("/dashboard", verifyToken, (req, res) => {
    res.json({
        message: "Welcome to dashboard (protected route)",
        userId: req.user.userId
    });
});

app.post("/tasks", verifyToken, async (req, res) => {

    if (!title) {
        return res.status(400).json({message: "Title required"});
    }

    if (req.role !== "admin"){
        return res.status(403).json({message: "Only admin can create tasks"});
    }
    try {
        const { title, assignedTo } = req.body;

        const task = new Task({
            title,
            assignedTo,
            createdBy: req.userId   // login user id
        });

        await task.save();

        res.json({
            message: "Task created successfully",
            task
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get("/tasks", verifyToken, async (req, res) => {
    try {
        let tasks;
        
        if (req.role === "admin") {
            tasks = await Task.find(); // admin sees all
        } else {
            tasks = await Task.find({
                assignedTo: req.userId
            }); 
        }

        res.json(tasks);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch("/tasks/assign/:taskId", verifyToken, async (req, res) => {
    if (req.role !== "admin") {
        return res.status(403).json({message: "Only admin can assign tasks"});
    }
    try {
        const { assignedTo } = req.body;

        const task = await Task.findByIdAndUpdate(
            req.params.taskId,
            { assignedTo },
            { new: true }
        );

        res.json({
            message: "Task assigned successfully",
            task
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.patch("/tasks/status/:taskId", verifyToken, async (req, res) => {
    try {
        const { status } = req.body;

        // optional validation
        if (!["pending", "in-progress", "completed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.taskId,
            { status },
            { new: true }
        );

        res.json({
            message: "Status updated",
            task
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




app.get("/admin", verifyToken, (req, res) => {

    if (req.role !== "admin") {
        return res.status(403).send("Not allowed");
    }

    res.send("Welcome Admin!");
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

