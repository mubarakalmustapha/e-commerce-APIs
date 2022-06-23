const users = require("../routes/users");
const auth = require("../routes/auth");
const orders = require("../routes/orders");
const products = require("../routes/products");
const carts = require("../routes/carts");
const stripe = require("../routes/stripe");
const error = require("../middleware/error");

module.exports = function (app) {
    app.use("/api/users", users);
    app.use("/api/auth", auth);
    app.use("/api/orders", orders);
    app.use("/api/products", products);
    app.use("/api/carts", carts);
    app.use("/api/checkout", stripe);
    app.use(error);
}