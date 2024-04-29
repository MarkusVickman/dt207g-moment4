
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

const WorkExperience = require("../models/workcv");
const User = require("../models/user");

router.post("/add", authtenticateToken, async (req, res) => {

    
    //lägger till data till mongoDb servern med krav att schema workSchema ska följas från post-anropet om webbadress/api/add anropas. Skickar felmeddelande om fel uppstår hos databasen.
    
        let workExperience1 = {
            username: req.username.username,
            companyName: req.body.companyName,
            jobTitle: req.body.jobTitle,
            location: req.body.location,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            description: req.body.description
        };
    
        let error = {};
    
        //Felhantering om uppgifter saknas
        if (!workExperience1.username || !workExperience1.companyName || !workExperience1.jobTitle || !workExperience1.location || !workExperience1.startDate || !workExperience1.endDate || !workExperience1.description) {
            error = {
                message: "Parameters missing in the request.",
                detail: "Post request most include companyName, jobTitle, location, startDate, endDate and description",
                https_response: {
                    message: "Bad Request",
                    code: 400
                }
            }
            res.status(400).json(error);
        }
        //Om allt är korrekt körs frågan till mongoDg-databasen för att lagra det nya cv
        else {
            try {
                await WorkExperience.create(workExperience1);
                return res.json({ Success: "Post data stored in database." });
            } catch (error) {
                return res.status(500).json({ error: "Database error. " + error });
            }
        }
});

router.get("/", authtenticateToken, async (req, res) => {
    res.status(200).json({ message: "Access granted"});
});

router.get("/cv", authtenticateToken, async (req, res) => {
        try {
            let result = await WorkExperience.find({ username: req.username.username});
            return res.json(result);
    
        } catch (error) {
            return res.status(500).json({ error: "Could not reach database. " + error });
        }
});

router.delete("/delete/:id", authtenticateToken, async (req, res) => {
//tar bort data från mongoDb-servern när förfrågan till webbadress/api/cv görs. Skickar felmeddelande om fel uppstår hos databasen.
    let indexId = req.params.id;

    //Felhantering om uppgifter saknas.
    if (!indexId) {
        res.status(400).json(error);
    }
    //värdet skrivs in på rätt index i rätt kolomn i databasen.
    else {
        try {
            await WorkExperience.findByIdAndDelete(indexId);
            return res.json({ Success: "Delete data removed from database." });
        } catch (error) {
            return res.status(500).json({ error: "Database error. " + error });
        }
    }
});

router.delete("/user/delete", authtenticateToken, async (req, res) => {
    //tar bort data från mongoDb-servern när förfrågan till webbadress/api/cv görs. Skickar felmeddelande om fel uppstår hos databasen.
        let indexId = req.username.username;
    
        //Felhantering om uppgifter saknas.
        if (!indexId) {
            res.status(400).json(error);
        }
        //värdet skrivs in på rätt index i rätt kolomn i databasen.
        else {
            try {
                await User.deleteOne({ username: indexId });
                await WorkExperience.deleteMany({ username: indexId });
                return res.json({ Success: "Delete data removed from database." });
            } catch (error) {
                return res.status(500).json({ error: "Database error. " + error });
            }
        }
    });

    router.get("/user", authtenticateToken, async (req, res) => {
        try {
            let result = await User.find({ username: req.username.username});
            return res.json(result);
    
        } catch (error) {
            return res.status(500).json({ error: "Could not reach database. " + error });
        }
});



function authtenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null || token.lenght === 0) {
        return res.status(401).json({ message: "Not authorized: Token is missing."});
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if(err) {
            return res.status(403).json({ message: "Not authorized: Wrong token."})
        }

        req.username = username;
        next();
    })
}

module.exports = router;