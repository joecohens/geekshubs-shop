const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        product_id: mongoose.Schema.ObjectId,
        name: String,
        quantity: Number,
        price: Number,
        total: Number
      }
    ],
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

cartSchema.virtual("total").get(function() {
  return (this.total = this.items.reduce(
    (carry, item) => item.total + carry,
    0
  ));
});

cartSchema.pre("save", function(next) {
  this.updated_at = new Date();
  next();
});

cartSchema.pre("findOneAndUpdate", function(next) {
  this.update({}, { $set: { updated_at: new Date() } });
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
