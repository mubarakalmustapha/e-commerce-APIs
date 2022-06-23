const mongoose = require("mongoose");
const Joi = require("joi");

const Cart = mongoose.model("Cart", new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [
        {
            productId: { type: String },
            quantity: { type: Number, default: 1 }
        }
    ],

     date:{
        type:Date,
        default:Date.now
    },

}))

function validateCart(cart) {
    const schema = {
        userId: Joi.objectId().required(),
        products: Joi.array().required()
    }
    return Joi.validate(cart, schema)
}

exports.Cart = Cart;
exports.validate = validateCart;