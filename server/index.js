import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDb from "./libs/db.js";
import authRoutes from "./routes/user.route.js";
import blogRoutes from "./routes/blog.route.js";
import cookieParser from "cookie-parser";
import uploadRoutes from "./routes/upload.route.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5001

// CORS configuration - should be applied early
const corsoptions = {
  origin: [
    "http://localhost:5173",
    "https://apsblog.onrender.com",
    "https://apsblog.vercel.app",
    "https://www.apscodes.tech",
    "https://apscodes.tech"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  preflightContinue: false,
  optionsSuccessStatus: 200
}

// Apply CORS middleware first
app.use(cors(corsoptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug middleware for CORS
app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log(`${req.method} ${req.path} - Origin: ${origin}`);
    console.log("Headers:", req.headers);
    
    // Add custom CORS headers as fallback
    if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});


app.get("/", (req,res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/upload", uploadRoutes);

connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
