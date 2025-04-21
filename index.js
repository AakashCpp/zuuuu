import express from 'express';
import AuthRouter from './routes/auth.js';
import BooksRouter from './routes/books.js';
import PurchaseRoute from './routes/purchase.js'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import DB from './config/db.js';

const app = express();

const PORT = process.env.PORT || 5000;
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:3000'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    } 
  },
  credentials: true
    
}));

app.use(express.json());

app.use('/api/auth', AuthRouter); 
app.use('/api/books', BooksRouter); 
app.use('/api/purchase', PurchaseRoute); 


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  DB();
});