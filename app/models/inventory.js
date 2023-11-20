const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
  books: [
    {
      book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
      },
      quantity: Number,
      price: Number,
    },
  ],
  totalPrice: Number,
  staffID: String,
  entryDate: { type: Date, default: Date.now },
});



const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
