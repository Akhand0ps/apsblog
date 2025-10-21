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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsoptions = {
  origin:["http://localhost:5173","https://apsblog.onrender.com","https://apsblog.vercel.app","https://www.apscodes.tech/"],
  methods:["GET","POST","PUT","DELETE"],
  credentials:true
}

app.use(cors(corsoptions));

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
