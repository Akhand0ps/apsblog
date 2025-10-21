import express from "express";
import { authenticateAdmin } from "../middlewares/auth.middleware.js";
import { createblog , getAllBlogs,getBlogBySlug,deleteBlogBySlug,updateBlogBySlug, searchBlogs} from "../controllers/blog.controller.js";
import ratelimit from "express-rate-limit";

const router = express.Router();

const BlogLimiter = ratelimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs
    message: {
        error: "Too many requests, please try again later."
    }
});

router.post("/create",authenticateAdmin,createblog);
router.put("/update/:slug",authenticateAdmin,updateBlogBySlug);
router.delete("/delete/:slug",authenticateAdmin,deleteBlogBySlug);




router.get("/blogs",BlogLimiter,getAllBlogs);
router.get("/:slug",BlogLimiter,getBlogBySlug);
router.get("/search",BlogLimiter,searchBlogs)



export default router;