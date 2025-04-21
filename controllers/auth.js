import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

function response(ok,message , data){
    return {ok,message,data};
}

export const Register = async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Received data:", req.body);
  
    try {
        if (!name || !email || !password) {
          return res.status(400).json({ message: "All fields are required" });
        }
      
        if (password.length < 6) {
          return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
      
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }
      
        const newUser = new User({ name, email, password });
        console.log("Before saving user:", newUser);
      
        await newUser.save();  // <-- if there's an error, it’ll show in the next log
        console.log("New user registered:", newUser._id);
      
        return res.status(201).json({ message: "User registered successfully" });
      } catch (error) {
        console.error("Error during registration:", error.message, error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
      }
};

export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({
            email,
        });
        if(!user) {
            return res.status(400).json(response(false,"User does not exists"));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json(response(false,"Invalid credentials"));
        }

        // generate token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const reffreshToken  = jwt.sign({ userId: user._id }, process.env.REFFRESH_JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, { httpOnly: true , secure: process.env.NODE_ENV !== "development" });
        res.cookie("reffreshToken", reffreshToken, { httpOnly: true , secure: process.env.NODE_ENV !== "development" });

        res.status(200).json(response(true,"Logged in successfully",{token,reffreshToken}));
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const Logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};