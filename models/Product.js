const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: "Tu producto debe tener sku!"
    },
    name: {
      type: String,
      required: "Tu producto debe tener nombre!"
    },
    description: {
      type: String
    },
    price: {
      type: Number
    },
    inventory: {
      type: Number
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    category: {
      type: String
    },
    image_url: {
      type: String
    },
    updated_at: {
      type: Date,
      default: Date.now
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

productSchema.pre("save", function(next) {
  this.updated_at = new Date();
  next();
});

productSchema.pre("findOneAndUpdate", function(next) {
  this.update({}, { $set: { updated_at: new Date() } });
  next();
});

module.exports = mongoose.model("Product", productSchema);
