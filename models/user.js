// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: {
    lat: { type: Number },
    lon: { type: Number }
  },
  purchasedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  listedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    try {
      const user = this;
  
      if (user.isModified('password')) {
        console.log("Hashing password for:", user.email);
        user.password = await bcrypt.hash(user.password, 10);
      }
  
      next();
    } catch (error) {
      console.error("Error in pre-save hook:", error);
      next(error); // Important to pass it to Mongoose
    }
  });

  const User = mongoose.model('User', userSchema);
  export default User;
