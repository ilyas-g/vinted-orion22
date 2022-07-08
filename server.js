const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI_PROD);

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
