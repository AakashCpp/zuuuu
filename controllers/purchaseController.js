import Purchase from '../models/purchase.js';
import Book from '../models/books.js';
import User from '../models/User.js';

// Helper function for standardizing responses
function response(ok, message, data = null) {
  return { ok, message, data };
}

// Create a new purchase (when a buyer buys a book)
export const createPurchase = async (req, res) => {
  try {
    const { bookId } = req.body;
    const buyerId = req.user.userId;

    const book = await Book.findById(bookId);
    if (!book || book.isSold) return res.status(400).json(response(false, 'Book not available'));

    const purchase = new Purchase({
      buyer: buyerId,
      seller: book.seller,
      book: bookId
    });

    await purchase.save();

    // Update the user and book data
    await User.findByIdAndUpdate(buyerId, { $push: { purchasedBooks: bookId } });
    await Book.findByIdAndUpdate(bookId, { isSold: true });

    res.status(201).json(response(true, 'Purchase successful', purchase));
  } catch (err) {
    res.status(500).json(response(false, 'Error purchasing book', err.message));
  }
};

// Get all purchases made by a user
export const getPurchases = async (req, res) => {
  try {
    const userId = req.user.userId;
    const purchases = await Purchase.find({ buyer: userId }).populate('book').populate('seller');
    res.status(200).json(response(true, 'Purchases retrieved successfully', purchases));
  } catch (err) {
    res.status(500).json(response(false, 'Error retrieving purchases', err.message));
  }
};


export const cancelPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.purchaseId);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

    if (purchase.buyer.toString() !== req.user.userId && purchase.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    purchase.status = 'cancelled';
    await purchase.save();

    await Book.findByIdAndUpdate(purchase.book, { isSold: false });

    res.status(200).json({ message: 'Purchase cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling purchase', error: err.message });
  }
}

export const completePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.purchaseId);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

    if (purchase.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    purchase.status = 'completed';
    await purchase.save();

    res.status(200).json({ message: 'Purchase completed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error completing purchase', error: err.message });
  }
}
