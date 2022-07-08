const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
    try {
        // On vérifie s'il y a un email déjà présent dans la BDD
        const isEmailExisting = await User.findOne({
            email: req.body.email,
        });

        const isUsernameExisting = await User.findOne({
            username: req.body.username,
        });

        // On vérifie si l'email renseigné est présent dans la BDD
        if (isEmailExisting) {
            res.status(400).json({ message: "This email is already used!" });
        }
        else if (!req.body.username) {
            res.status(400).json({ message: "Need an username" });
        }
        // else if (isUsernameExisting) {
        //     res.status(400).json({ message: "This username is already used" });
        // } 
        else {
            const salt = uid2(16);
            const hashPassword = SHA256(req.body.password + salt).toString(encBase64);
            console.log("LE HASH ==>", hashPassword);
            const token = uid2(32);

            // On crée un nouveau user
            const newUser = new User({
                email: req.body.email,
                account: {
                    username: req.body.username,
                    avatar: Object, // nous verrons plus tard comment uploader une image
                },
                newsletter: req.body.newsletter,
                token: token,
                hash: hashPassword,
                salt: salt,
            });

            await newUser.save();

            console.log(newUser);

            res.status(200).json(
                {
                    _id: newUser._id,
                    email: newUser.email,
                    token: newUser.token,
                    account: newUser.account,
                }
            );
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports = router;
