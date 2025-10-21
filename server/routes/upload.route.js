import express from 'express';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { uploadImage, upload } from '../controllers/upload.controller.js';

const router = express.Router();


router.post('/image',authenticateAdmin,upload.single('image'),uploadImage);


export default router;