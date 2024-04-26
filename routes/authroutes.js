

const express = require("express");
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Invalid input, send username and password"});
        }
        else if (password.length < 6 ) {
            return res.status(400).json({ error: "Invalid input, password must be atleast 6 characters long."});
        }
        res.status(201).json({ messege: "User created"});

    } catch (error) {
        res.status(500).json({ error: "Server error"});
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Invalid input, send username and password"});
        }

        if (username === "Markus" && password === "testtest") {
            res.status(201).json({ messege: "Login successful"});
        }
        else {
            res.status(401).json({ error: "Invalid username, password or both."});
        }



    } catch (error) {
        res.status(500).json({ error: "Server error"});
    }
});

module.exports = router;