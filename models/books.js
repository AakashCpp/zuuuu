import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String },
  standard: { type: String },
  publication: { type: String },
  description: { type: String },
  condition: {
    type: String,
    enum: ['new', 'used', 'like new'],
    default: 'used'
  },
  price: { type: Number, required: true },
  images: [{ type: String }],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isSold: { type: Boolean, default: false }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;
