require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

//import des routes
const signUpRoutes = require("./routes/signUp");
const loginRoutes = require("./routes/login");
const offerPublishRoutes = require("./routes/offerPublish");
const offerRoutes = require("./routes/offers");

app.use(signUpRoutes);
app.use(loginRoutes);
app.use(offerPublishRoutes);
app.use(offerRoutes);

app.all("*", (req, res) => {
    res.status(400).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
    console.log("Server has started !!");
});
