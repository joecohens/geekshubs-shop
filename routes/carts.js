const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Cart = require("../models/Cart");

router.get("/", async (req, res, next) => {
  const carts = await Cart.find();

  res.json(carts);
});

router.post("/", async (req, res, next) => {
  const productId = req.body.product_id;
  const quantity = parseInt(req.body.quantity, 10);

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    return res.status(404).json({ error: "El producto no existe." });
  }

  if (product.inventory <= 0 || product.inventory < req.body.quantity) {
    return res
      .status(400)
      .json({ error: "No hay inventario de este producto." });
  }

  const requestProduct = {
    product_id: productId,
    name: product.name,
    quantity: quantity,
    price: product.price,
    total: product.price * quantity
  };

  const currentCart = await Cart.findOne({ _id: req.body.id });

  if (!currentCart) {
    const cart = new Cart({ items: [requestProduct] });

    await cart.save();

    return res.json({ data: cart });
  }

  const productOnCart = currentCart.items.find(
    item => item.product_id.toString() === productId
  );

  if (!productOnCart) {
    const cart = await Cart.findOneAndUpdate(
      { _id: req.body.id },
      { $push: { items: requestProduct } },
      { new: true, runValidators: true, context: "query" }
    );

    return res.json({ data: cart });
  }

  const newQuantity = productOnCart.quantity + quantity;

  if (product.inventory < newQuantity) {
    return res
      .status(400)
      .json({ error: "No hay inventario de este producto." });
  }

  const cart = await Cart.findOneAndUpdate(
    { $and: [{ _id: req.body.id, "items.product_id": productId }] },
    {
      $set: {
        "items.$.quantity": newQuantity,
        "items.$.total": newQuantity * productOnCart.price
      }
    },
    { new: true, runValidators: true, context: "query" }
  );

  res.json({ data: cart });
});

router.put("/", async (req, res, next) => {
  const itemId = req.body.id;
  const quantity = parseInt(req.body.quantity, 10);

  const currentCart = await Cart.findOne({ "items._id": itemId });

  if (!currentCart) {
    return res
      .status(404)
      .json({ error: "El producto no está en el carrito." });
  }

  const productOnCart = currentCart.items.find(
    item => item._id.toString() === itemId
  );

  const product = await Product.findOne({ _id: productOnCart.product_id });

  if (!product) {
    return res.status(400).json({ error: "El producto no existe." });
  }

  const newQuantity = productOnCart.quantity + quantity;

  if (product.inventory < newQuantity) {
    return res.json({ error: "No hay inventario de este producto." });
  }

  const cart = await Cart.findOneAndUpdate(
    { $and: [{ _id: currentCart._id, "items._id": itemId }] },
    {
      $set: {
        "items.$.quantity": newQuantity,
        "items.$.total": newQuantity * productOnCart.price
      }
    },
    { new: true, runValidators: true, context: "query" }
  );

  res.json({ data: cart });
});

router.delete("/", async (req, res, next) => {
  const itemId = req.body.id;

  const currentCart = await Cart.findOne({ "items._id": itemId });

  if (!currentCart) {
    return res
      .status(404)
      .json({ error: "El producto no está en el carrito." });
  }

  const cart = await Cart.findOneAndUpdate(
    { _id: currentCart.id },
    {
      $pull: { items: { _id: itemId } }
    },
    { new: true, runValidators: true, context: "query" }
  );

  res.json({ data: cart });
});

router.get("/:id", async (req, res, next) => {
  const cart = await Cart.findOne({ _id: req.params.id });

  if (!cart) {
    return res.status(404).json({ error: "El carrito no existe." });
  }

  res.json({ data: cart });
});

module.exports = router;
