const express = require("express");
const router = express.Router();

const Offer = require("../models/Offer");

router.get("/offers", async (req, res) => {
    try {
        const filtersObject = {};

        if (req.query.title) {
            filtersObject.product_name = new RegExp(req.query.title, "i");
        }

        if (req.query.priceMin) {
            filtersObject.product_price = { $gte: req.query.priceMin };
        }

        //Si j'ai une déjà une clé product_price dans min object objectFilter
        if (req.query.priceMax) {
            if (filtersObject.product_price) {
                filtersObject.product_price.$lte = req.query.priceMax;
            } else {
                filtersObject.product_price = { $lte: req.query.priceMax };
            }
        }

        // console.log(filtersObject);

        //gestion du tri avec l'objet sortObject
        const sortObject = {};

        if (req.query.sort === "price-desc") {
            sortObject.product_price = "desc";
        } else if (req.query.sort === "price-asc") {
            sortObject.product_price = "asc";
        }

        // console.log(sortObject);

        //gestion de la pagination
        //On a par défaut 3 annonces par page
        //Si je suis sur la page 1 => je devrais skip 0 annonces
        //Si je suis sur la page 2 => je devrais skip 3 annonces
        //Si je suis sur la page 3 => je devrais skip 6 annonces
        //Si je suis sur la page 4 => je devrais skip 9 annonces

        // (1-1) * 3 = skip 0 ==> Page 1
        // (2-1) * 3 = skip 3 ==> Page 2
        // (3-1) * 3 = skip 6 ==> Page 3
        // (4-1) * 3 = skip 9 ==> Page 4

        let limit = 3;
        if (req.query.limit) {
            limit = req.query.limit;
        }

        let page = 1;
        if (req.query.page) {
            page = req.query.page;
        }

        const offers = await Offer.find(filtersObject)
            .sort(sortObject)
            .select("product_name product_price")
            .limit(limit)
            .skip((page - 1) * limit);

        const count = await Offer.countDocuments(filtersObject);

        res.json({ count: count, offers: offers });
    } catch (error) {
        res.status(400).json(error.message);
    }
});

router.get("/offer/:id", async (req, res) => {
    console.log(req.params);
    try {
        const offer = await Offer.findById(req.params.id).populate({
            path: "owner",
            select: "account.username email",
        });
        res.json(offer);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports = router;
