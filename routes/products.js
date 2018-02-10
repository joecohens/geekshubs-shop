const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

router.get("/", async (req, res, next) => {
  const products = await Product.find();

  res.json({ data: products });
});

router.post("/", async (req, res, next) => {
  const product = new Product(req.body);

  await product.save();

  res.json({ data: product });
});

router.get("/:id", async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id });

  if (!product) {
    return res.status(404).json({ error: "El producto no existe." });
  }

  res.json({ data: product });
});

router.put("/:id", async (req, res, next) => {
  let product;

  product = await Product.findOne({ _id: req.params.id });

  if (!product) {
    return res.status(404).json({ error: "El producto no existe." });
  }

  product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true, runValidators: true, context: 'query' }
  );

  res.json({ data: product });
});

router.delete("/:id", async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id });

  if (!product) {
    return res.status(404).json({ error: "El producto no existe." });
  }

  await product.remove();

  res.json({ data: { id: product.id } });
});

module.exports = router;
