const Joi = require("joi");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// login a user
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json("Invalid user or password");

    const isValidPassword = bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) return res.status(400).json("Invalid user or password");

    const token = user.generateAuthToken();
    res.send(token);
});

// validate a user
function validate(req) {
    const schema = {
        email: Joi.string().required().min(4).max(50).label("Email"),
        password: Joi.string().required().min(4).max(1024).label("Password")
    }
    return Joi.validate(req, schema);
}

module.exports = router;