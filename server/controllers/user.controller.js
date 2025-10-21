import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }


    if( (email !== process.env.email) && (password !== process.env.password)){
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({role:'admin' }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });


    res.cookie("token", token, {
      httpOnly: true, // JS in browser cannot access
      secure: process.env.NODE_ENV === "production", // only HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    return res.status(200).json({
      message: "Login successful",
      data: {
        email: process.env.email,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to login" });
  }
};

export const me = async (req, res) => {
  try {
    


    const token = req.cookies.token || "";
    
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    if(payload.role !== 'admin'){
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.status(200).json({
      data: {
        name: process.env.name,
        email: process.env.email,
        image: process.env.imgUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};






