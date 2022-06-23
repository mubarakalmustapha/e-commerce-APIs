const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },

});
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            isAdmin: this.isAdmin,
            name: this.name,
            email: this.email,
            date: this.date


        }, config.get("jwtPrivateKey"));
}
const User = mongoose.model("User", userSchema);

function validetUser(user) {
    const schema = {
        name: Joi.string().required().min(4).max(50).label("Name"),
        email: Joi.string().required().min(4).max(50).label("Email"),
        password: Joi.string().required().min(4).max(1024).label("Password"),
        isAdmin: Joi.boolean()
    }
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validetUser;