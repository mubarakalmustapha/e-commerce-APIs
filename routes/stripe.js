const router = require("express").Router();
const config = require("config");
const stripe = require("stripe")(config.get("stripeKey"));

router.post("/payment", (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd",
    },
        (stripeError, stripeResponse) => {
            if (stripeError) return res.status(500).send(stripeError);
            else res.send(stripeResponse)
        })
});

module.exports = router;