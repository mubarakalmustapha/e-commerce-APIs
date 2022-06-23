const mongoose = require("mongoose");
const Joi = require("joi");
const { min } = require("lodash");

const Product = mongoose.model("Product", new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
        trim: true
    },
    desc: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 1024
    },
    img: {
        type: String,
        required: true,
    },
    categories: {
        type: Array,
        required: true,
    },
    size: {
        type: Array,
        required: true,
        minlength: 2,
        maxlength: 5
    },
    color: {
        type: Array,
        required: true,
        minlength: 2,
        maxlength: 5
    },
    price: {
        type: Number,
        required: true,
        min: 10,
        max: 500
    },
    inStock: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    },

}));

function validateProduct(product) {
    const schema = {
        title: Joi.string().required().min(4).max(50),
        desc: Joi.string().required().min(4).max(1024),
        img: Joi.string().required(),
        categories: Joi.array().max(5),
        size: Joi.array().min(2).max(5).required(),
        color: Joi.array().min(2).max(5).required(),
        price: Joi.string().required()
    }
    return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;