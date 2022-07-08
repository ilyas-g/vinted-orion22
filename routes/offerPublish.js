const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload"); // A utiliser quand je veux envoyer des datas via Body/form-data dans POSTMAN
// const SHA256 = require("crypto-js/sha256");
// const encBase64 = require("crypto-js/enc-base64");
// const uid2 = require("uid2");

const cloudinary = require("cloudinary").v2; // On n'oublie pas le `.v2` à la fin

// Données à remplacer avec les vôtres :
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const convertToBase64 = (file) => {
    return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

const mongoose = require("mongoose");

const Offer = require("../models/Offer");
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
    //   console.log(req.headers);
    // Cette condition sert à vérifier si j'envoie un token
    if (req.headers.authorization) {
        const user = await User.findOne({
            token: req.headers.authorization.replace("Bearer ", ""),
        });
        // Cette condition sert à vérifier si j'envoie un token valide !

        if (user) {
            //Mon token est valide et je peux continuer
            //J'envoie les infos sur mon user à la route /offer/publish
            req.user = user;
            next();
        } else {
            res.status(401).json({ error: "Token présent mais non valide !" });
        }
    } else {
        res.status(401).json({ error: "Token non envoyé !" });
    }
};

router.post("/offer/publish", isAuthenticated, fileUpload(), async (req, res) => {
    try {
        // console.log("title " + req.data.title);
        const user = await User.findOne({ token: req.body.token });

        // Je viens convertir mon fichier en base64
        myPictureInBase64 = convertToBase64(req.files.picture);

        //Je viens envoyer ce base64 à cloudinary
        const resultURL = await cloudinary.uploader.upload(myPictureInBase64);

        console.log(resultURL.url);
        // Etape 2 : créer le nouvel utilisateur
        const newOffer = new Offer({
            product_name: req.body.title,
            product_description: req.body.description,
            product_price: req.body.price,
            product_details: [
                { MARQUE: req.body.brand },
                { TAILLE: req.body.size },
                { ETAT: req.body.condition },
                { COULEUR: req.body.color },
                { EMPLACEMENT: req.body.city }
            ],
            product_image: {
                secure_url: resultURL.url
            },
            owner: req.user
        });

        //J'envoie mon image sur cloudinary, juste après avoir crée en DB mon offre
        // Comme ça j'ai accès à mon ID
        const result = await cloudinary.uploader.upload(
            convertToBase64(req.files.picture),
            {
                folder: "vinted/offers",
                public_id: `${req.body.title} - ${newOffer._id}`,
                //Old WAY JS
                // public_id: req.body.title + " " + newOffer._id,
            }
        );

        // console.log(result);
        //je viens rajouter l'image à mon offre
        newOffer.product_image = result;

        // console.log("newOffer : " + newOffer.owner);
        await newOffer.save();
        console.log(newOffer.owner);
        res.json(newOffer);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports = router;
