const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title:   { type: String, required: true, trim: true },
    rarity:  { type: String, required: true, enum: ['common','uncommon','rare','epic','legendary'], default: 'common' },
    price:   { type: Number, required: true, min: 0 },     // keep price if you plan to display value
    details: { type: String, trim: true },
    image:   { type: String, required: true, trim: true }, // e.g. "Axe.png" under /public/images
    active:  { type: Boolean, default: true }
  },
  { timestamps: true }
);

itemSchema.index({ rarity: 1 });
itemSchema.index({ price: 1 });
itemSchema.index({ title: 1 });

module.exports = mongoose.model('Item', itemSchema);
