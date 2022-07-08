const express = require("express");
const router = express.Router();

const Offer = require("../models/Offer");

router.get("/offers", async (req, res) => {
    try {
        // const filtersObject = {};
        // filtersObject.product_name = req.query.title;
        // filtersObject.product_name = "AreaBone";
        // filtersObject.product_priceMin = { $gte: req.query.priceMin };
        // filtersObject.product_priceMax = { $lte: req.query.priceMax };
        // console.log(filtersObject);

        const offers = await Offer.find({ product_priceMin: { $gt: req.query.priceMin } })
            // const offers = await Offer.find({
            // filtersObject
            // product_name: new RegExp(req.query.title, "i")
            // product_name: "AreaBone"
            // product_price: { $gte: req.query.priceMin, $lte: req.query.priceMax }
            // })
            .sort({ product_price: "ascending" })
            .select("product_name product_price -_id");
        // .sort({ product_price: { $gte: req.query.priceMin, $lte: req.query.priceMax } })
        console.log(offers);
        res.json(offers);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

// router.get("/offers", async (req, res) => {
//     //   const offers = await Offer.find({
//     //     product_name: new RegExp("chemise", "i"),
//     //   })
//     //     .sort({ product_price: "ascending" })
//     //     .select("product_name product_price -_id");
//     //   res.json(offers);

//     //   const offers = await Offer.find({
//     //     // gte => greater or equal
//     //     // lte => lower or equal
//     //     product_price: { $gte: 100, $lte: 1000 },
//     //   })
//     //     .select("product_name product_price -_id")
//     //     .sort({ product_price: "descending" });
//     //   res.json(offers);

//     const offers = await Offer.find()
//         .limit(3)
//         .skip(6)
//         .select("product_name product_price -_id");

//     res.json(offers);
// });

module.exports = router;
