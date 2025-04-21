import User from '../models/User.js';
import Book from '../models/books.js';

function response(ok, message, data = null) {
    return { ok, message, data };
}

// GET: All listed books
export const getAllBooks = async (req, res) => {
    try {
      const books = await Book.find({}).populate('seller', 'name email');
      res.status(200).json(response(true, "All books fetched", books));
    } catch (err) {
      res.status(500).json(response(false, "Server error", err.message));
    }
  };

// GET: Book by ID
export const getBookById = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id).populate('seller', 'name email');
      if (!book) {
        return res.status(404).json(response(false, "Book not found"));
      }
      res.status(200).json(response(true, "Book fetched", book));
    } catch (err) {
      res.status(500).json(response(false, "Server error", err.message));
    }
  };

// GET: Books listed by a specific user
export const getBooksByUser = async (req, res) => {
    try {
      const books = await Book.find({ seller: req.params.id });
      res.status(200).json(response(true, "Books by user fetched", books));
    } catch (err) {
      res.status(500).json(response(false, "Server error", err.message));
    }
  };

// GET: Books by category
export const getBooksByCategory = async (req, res) => {
    try {
      const books = await Book.find({ category: req.params.category });
      res.status(200).json(response(true, "Books by category fetched", books));
    } catch (err) {
      res.status(500).json(response(false, "Server error", err.message));
    }
  };

// GET: Books by author
export const getBooksByAuthor = async (req, res) => {
    try {
      const books = await Book.find({ author: req.params.author });
      res.status(200).json(response(true, "Books by author fetched", books));
    } catch (err) {
      res.status(500).json(response(false, "Server error", err.message));
    }
  };



  export const createBook = async (req, res) => {
    const { subject, author, price } = req.body;
    console.log("Request Body:", req.body);
    console.log("User Info:", req.user.userId);
  
    try {
      const newBook = new Book({ 
        subject, 
        author, 
        price,
        seller: req.user.userId,
      });
  
      const savedBook = await newBook.save();
  
      await User.findByIdAndUpdate(req.user.userId, {
        $push: { listedBooks: savedBook._id }
      });
  
      res.status(201).json(response(true, "Book created", savedBook));
    } catch (err) {
      console.error("Error creating book:", err);
      res.status(500).json(response(false, "Failed to create book", err.message));
    }
  };

// PUT: Update a book
export const updateBook = async (req, res) => {
    const {} = req.body; // Destructure the fields you want to update
    try {
      const book = await Book.findById(req.params.id);
  
      if (!book) return res.status(404).json(response(false, "Book not found"));
  
      // Optional: Check if current user is the seller
      if (book.seller.toString() !== req.user.userId) {
        return res.status(403).json(response(false, "Unauthorized"));
      }
  
      const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
  
      res.status(200).json(response(true, "Book updated", updatedBook));
    } catch (err) {
      res.status(500).json(response(false, "Failed to update book", err.message));
    }
  };

// DELETE: Delete a book
export const deleteBook = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
  
      if (!book) return res.status(404).json(response(false, "Book not found"));
  
      if (book.seller.toString() !== req.user.userId) {
        return res.status(403).json(response(false, "Unauthorized"));
      }
  
      await book.deleteOne();
  
      // Remove from user's listedBooks
      await User.findByIdAndUpdate(req.user.userId, {
        $pull: { listedBooks: req.params.id }
      });
  
      res.status(200).json(response(true, "Book deleted successfully"));
    } catch (err) {
      res.status(500).json(response(false, "Failed to delete book", err.message));
    }
  };

//mark book as sold
export const markBookAsSold = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).json({ ok: false, message: 'Book not found' });
  
      if (book.seller.toString() !== req.user.userId) {
        return res.status(403).json({ ok: false, message: 'Unauthorized' });
      }
  
      book.isSold = true;
      await book.save();
  
      res.status(200).json({ ok: true, message: 'Book marked as sold', data: book });
    } catch (err) {
      res.status(500).json({ ok: false, message: 'Something went wrong', error: err.message });
    }
  };