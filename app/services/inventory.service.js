const Inventory = require('../models/inventory');
const Book = require('../models/book');

class InventoryService {
  async addInventory(inventory, staffId) {
    const inventoryItems = [];
    let totalPrice = 0;
    for (let i = 0; i < inventory.length; i++) {
      const bookId = inventory[i]._id;
      const quantity = inventory[i].quantity;
      const price = inventory[i].price;

      const book = await Book.findById(bookId);

      book.quantity += quantity;

      totalPrice += inventory[i].price * inventory[i].quantity;

      inventoryItems.push({ book: bookId, quantity, price });

      await book.save();
    }
    const newInventory = new Inventory({
      books: inventoryItems,
      staffID: staffId,
      totalPrice: totalPrice,
    });

    await newInventory.save();
  }
}

module.exports = new InventoryService();
