import express from 'express';
import {checkAuthToken} from '../middleware/checkAuthToken.js';
import { getAllBooks, getBookById, getBooksByUser, createBook, updateBook, deleteBook , getBooksByCategory , getBooksByAuthor } from '../controllers/books.js';


const router = express.Router();

// get all the listed books
router.get('/',checkAuthToken , getAllBooks);

// get a single book by name catagory author etc
router.get('/:id',checkAuthToken , getBookById); 

// get all the books listed by a user
router.get('/user/:id',checkAuthToken , getBooksByUser);

// get all the books listed by a specific category
router.get('/category/:category',checkAuthToken , getBooksByCategory);

// get all the books listed by a specific author
router.get('/author/:author',checkAuthToken , getBooksByAuthor);

// create a new book listing
router.post('/',checkAuthToken  , createBook);

// update a book listing
router.put('/:id',checkAuthToken , updateBook);

// delete a book listing
router.delete('/:id',checkAuthToken , deleteBook);

export default router;