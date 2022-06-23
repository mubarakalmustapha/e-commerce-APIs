const mongoose = require("mongoose");
const Joi = require("joi");

const Order = mongoose.model("Order", new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [
        {
            productId: { type: String, required: true },
            quantity: { type: Number, default: 1 }
        }
    ],
    amount: {
        type: Number,
        required: true,
    },
    address: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    },
     date:{
        type:Date,
        default:Date.now
    },
    
}))


function validateOrder(order) {
    const schema = {
        userId: Joi.objectId().required().required(),
        products: Joi.array().required(),
        amount: Joi.number().required().required().min(1),
        address: Joi.required().required(),
        status: Joi.string()
    }
    return Joi.validate(order, schema)
}

exports.Order = Order;
exports.validate = validateOrder;