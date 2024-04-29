//express server med api hostad hos azure som lagrar och hämtar data från en mongoDB databas.
//Variable .env
require('dotenv').config({ path: './.env' });
//lägger till express och cors för att kunna ansluta från vilken adress som helst
const express = require('express');
const cors = require('cors');
//Inställningar för express
const app = express();
const port = process.env.PORT;
const authRoutes = require("./routes/authroutes");
const protected = require("./routes/protected");
const jwt = require("jsonwebtoken");

//stöd för ta json-format och 
app.use(express.json());
app.use(cors());



//Välkomst meddelande om webbadress/api anropas
app.use('/api', authRoutes);

app.use("/api/protected", protected);


//Startar servern
app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});

router.get("/check", (req, res) => {
    res.status(200).json({ message: "Api-server is up and running."});
});