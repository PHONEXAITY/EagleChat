import User from "../models/User.js";
import bcrypt from 'bcryptjs'
 import generateTokenAndSetCookie from '../utils/generateToken.js';

 export const register = async (req, res) => {
  try {
    const { username, email, phoneNumber, password, confirmPassword, gender } = req.body;

    if (!username || !email || !phoneNumber || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingPhone = await User.findOne({ phoneNumber });

    if (existingPhone) {
      return res.status(400).json({ error: "Phone number already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const profilePic = gender === 'male'
      ? `https://avatar.iran.liara.run/public/boy?username=${username}`
      : `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      gender,
      profilePic,
    });

    await newUser.save();

    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
      const { email, password } = req.body; 
      const user = await User.findOne({ email }); 
      if (!user) {
          return res.status(400).json({ error: "Invalid email or password" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
          return res.status(400).json({ error: "Invalid email or password" });
      }

      
      const token = generateTokenAndSetCookie(user._id, res);

      res.status(200).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          profilePic: user.profilePic,
          jwt: token // Include the token in the response
      });
  } catch (error) {
      console.log("Error in login controller", error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

    export const logout = (req, res) => {
      try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
      } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    };

       
