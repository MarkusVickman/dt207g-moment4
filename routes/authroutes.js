
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { type } = require('express/lib/response');

//Ansluter till mongoDB.
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Error connecting to database: " + error);
})

const User = require("../models/user");

router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Invalid input, send username and password" });
        }
        else if (password.length < 6) {
            return res.status(400).json({ error: "Invalid input, password must be atleast 6 characters long." });
        }
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ messege: "User created" });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Missing username, password or both." });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({error : "Incorrect username, password or both."})
        }

        const isPasswordAMatch = await user.comparePassword(password);
        if(!isPasswordAMatch) {
            return res.status(401).json({error : "Incorrect username, password or both."})
        } else {
            //Create JWT
            const payload = { username: username };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: `1h`});
            res.status(201).json({ messege: "Login successful" });
        }



    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;