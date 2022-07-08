const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

router.post("/user/login", async (req, res) => {
    try {
        // On vérifie s'il y a un email déjà présent dans la BDD
        const isEmailExisting = await User.findOne({
            email: req.body.email,
        });

        const isHashRight = await User.findOne({
            hash: req.body.hash,
        });

        const salt = uid2(16);
        const hashPassword = SHA256(req.body.password + salt).toString(encBase64);

        // On vérifie si l'email renseigné est présent dans la BDD
        if (isEmailExisting.email !== req.body.email) {
            console.log("isEmail : " + isEmailExisting.email);
            console.log("req.body : " + req.body.email);
            res.status(400).json({ message: "Incorrect email!" });
        } else if (isHashRight !== hashPassword) {
            console.log("isHashRight : " + isEmailExisting.hash);
            console.log("hashPassword : " + hashPassword);
            res.status(400).json({ message: "Password is wrong" });
        } else {
            res.status(200).json({ message: "You logged!" });
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports = router;
