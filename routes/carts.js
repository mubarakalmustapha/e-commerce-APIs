const { Cart, validate } = require("../models/cart");
const isAdmin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = require("express").Router();

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const cart = new Cart(req.body);
    await cart.save();

    res.send(cart);
});

router.put("/:id", [auth, isAdmin, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const cart = await Cart.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, { new: true });
    if (!cart) return res.status(404).send("Cart with the giving ID was not found")

    res.send(cart);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) return res.status(404).send("Cart with the giving ID was not found");

    res.send("Cart has ben deleted");
});

// Get user cart
router.get("/:userId", validateObjectId, async (req, res) => {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.send(cart);
});

// Get all carts
router.get("/", [auth, isAdmin], async (req, res) => {
    const carts = await Cart.find();
    res.send(carts);
});

module.exports = router;