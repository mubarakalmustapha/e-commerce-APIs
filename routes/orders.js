const { Order, validate } = require("../models/order");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const { Cart } = require("../models/cart");
const router = express.Router();

// Get all orders
router.get("/", async (req, res) => {
    const orders = await Order.find();
    res.send(orders);
});

router.get("find/:userId", async (req, res) => {
    const order = Order.find({ userId: req.params.userId });
    res.send(order);
});

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const order = new Order(req.body);
    await order.save();

    res.send(order);
});

router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const order = await Order.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, { new: true });
    if (!order) return res.status(404).send("Cart with the giving ID was not found");

    res.send(order);
});

router.delete("/:id",  async (req, res) => {
    const order = await Cart.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).send("Cart with the giving ID was not found");

    res.send(order);
});

// get mothly income
router.get("/income", async (req, res) => {
    const productId = req.query.productId;

    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    const income = await Order.aggregate([
        { $match: { date: { $gte: previousMonth }, ...(productId && {
            products:{$elemMatch:productId}
        }) } },
        {
            $project: {
                month: { $month: "$date" },
                sales: "$amount"
            }
        },
        {
            $group: {
                _id: "$month",
                total: { $sum: "$sales" }
            }
        }
    ]);
    res.send(income);
});

module.exports = router;