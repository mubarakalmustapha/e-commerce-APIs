const { Product, validate } = require("../models/product");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const router = require("express").Router();

router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    let products;
    if (qNew) products = await Product.find().sort("-date").limit(1);
    else if (qCategory)
        products = await Product.find({ categories: { $in: [qCategory] } })

    else products = await Product.find();

    res.send(products);
});

router.get("/:id", validateObjectId, async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product with the giving ID was not found");

    res.send(product);
});

router.post("/", auth, async function (req, res) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const product = new Product(req.body);
    await product.save();
    res.send(product);
});

router.put("/:id", [auth, isAdmin, validateObjectId], async function (req, res) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const Product = await Product.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, { new: true });
    if (!product) return res.status(404).send("Product with the giving ID was not found");

    res.send(Product);
});

// [auth, isAdmin, validateObjectId],
router.delete("/:id", async (req, res) => {
    const Product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).send("Product with the giving ID was not found");

    res.send("product has been deleted");
});


module.exports = router;