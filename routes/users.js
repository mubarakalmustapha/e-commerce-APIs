const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");
const bcrypt = require("bcrypt");
const express = require("express");
const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const router = express.Router();

// Get all users isAdmin
router.get("/", [auth, isAdmin], async function (req, res) {
    const query = req.query.new
    const users = query ? await User.find().limit(5).select("-password").sort("-_id") :
        await User.find().select("-password");

    res.send(users);
});

// Register a user
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already register");

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10));
    await user.save();

    const token = user.generateAuthToken();
    res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(_.pick(user, ["name", "email", "_id"]));
});

//Update a user
router.put("/:id", [auth, isAdmin, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const update = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }, { new: true });
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10));
    await update.save();

    res.send(update);
});

// get user statistic isAdmin
router.get("/stats", [auth, isAdmin], async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
            $project: {
                month: { $month: "$date" },
            },
        },
        {
            $group: {
                _id: "$month",
                total: { $sum: 1 }
            }
        }
    ])

    res.send(data);
});

module.exports = router;