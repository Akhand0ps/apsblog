# Blog API Server

A RESTful API server for a blog application with admin authentication, image upload, and content management capabilities.

## Features

- Admin-only authentication system
- Blog post CRUD operations
- Image upload with Cloudinary integration
- SEO-friendly URL slugs
- Rate limiting for public endpoints
- Blog search functionality
- Request validation with Zod
- MongoDB integration with Mongoose

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with HTTP-only cookies
- **Image Storage**: Cloudinary
- **Validation**: Zod
- **File Upload**: Multer
- **Security**: Rate limiting with express-rate-limit

## Environment Variables

Create a `.env` file in the server root directory:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your_jwt_secret_key

# Admin Credentials
email=admin@yourdomain.com
password=secure_admin_password
name=Admin Name

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
NODE_ENV=development
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file with required environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication Endpoints

#### POST `/api/v1/auth/login`
Admin login with credentials from environment variables.

**Request Body:**
```json
{
  "email": "admin@yourdomain.com",
  "password": "secure_admin_password"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "data": {
    "email": "admin@yourdomain.com",
    "role": "admin"
  }
}
```

#### GET `/api/v1/auth/me`
Get current admin user information.

**Auth**: Required (Admin only)

**Response (200):**
```json
{
  "data": {
    "name": "Admin Name",
    "email": "admin@yourdomain.com",
    "image": "https://your-admin-profile-image-url"
  }
}
```

### Blog Endpoints

#### GET `/api/v1/blog/blogs`
Get all published blogs with pagination.

**Query Parameters:**
- `limit` (optional): Number of blogs per page (default: 10)
- `offset` (optional): Number of blogs to skip (default: 0)

**Rate Limited**: 50 requests per 15 minutes per IP

**Response (200):**
```json
{
  "data": [
    {
      "_id": "blog_id",
      "title": "Blog Title",
      "content": "Blog content...",
      "slug": "blog-title",
      "imageUrl": ["https://cloudinary-url/image.jpg"],
      "createdAt": "2025-10-18T10:00:00.000Z",
      "updatedAt": "2025-10-18T10:00:00.000Z"
    }
  ]
}
```

#### GET `/api/v1/blog/:slug`
Get a single blog post by slug.

**Rate Limited**: 50 requests per 15 minutes per IP

**Response (200):**
```json
{
  "data": {
    "_id": "blog_id",
    "title": "Blog Title",
    "content": "Full blog content...",
    "slug": "blog-title",
    "imageUrl": ["https://cloudinary-url/image.jpg"],
    "createdAt": "2025-10-18T10:00:00.000Z",
    "updatedAt": "2025-10-18T10:00:00.000Z"
  }
}
```

#### GET `/api/v1/blog/search`
Search blogs by title or content.

**Query Parameters:**
- `q` (required): Search query string

**Rate Limited**: 50 requests per 15 minutes per IP

**Response (200):**
```json
{
  "data": [
    {
      "_id": "blog_id",
      "title": "Matching Blog Title",
      "content": "Content with matching terms...",
      "slug": "matching-blog-title",
      "imageUrl": ["https://cloudinary-url/image.jpg"],
      "createdAt": "2025-10-18T10:00:00.000Z",
      "updatedAt": "2025-10-18T10:00:00.000Z"
    }
  ]
}
```

#### POST `/api/v1/blog/create`
Create a new blog post.

**Auth**: Required (Admin only)

**Request Body:**
```json
{
  "title": "New Blog Post",
  "content": "Blog post content with <img> tags...",
  "imageUrl": ["https://cloudinary-url/image1.jpg", "https://cloudinary-url/image2.jpg"]
}
```

**Response (201):**
```json
{
  "message": "Blog created successfully",
  "data": {
    "_id": "new_blog_id",
    "title": "New Blog Post",
    "content": "Blog post content...",
    "slug": "new-blog-post",
    "imageUrl": ["https://cloudinary-url/image1.jpg"],
    "createdAt": "2025-10-18T10:00:00.000Z",
    "updatedAt": "2025-10-18T10:00:00.000Z"
  }
}
```

#### PUT `/api/v1/blog/update/:slug`
Update an existing blog post.

**Auth**: Required (Admin only)

**Request Body:**
```json
{
  "title": "Updated Blog Title",
  "content": "Updated blog content...",
  "imageUrl": ["https://cloudinary-url/updated-image.jpg"]
}
```

**Response (200):**
```json
{
  "message": "Blog updated successfully",
  "data": {
    "_id": "blog_id",
    "title": "Updated Blog Title",
    "content": "Updated blog content...",
    "slug": "original-slug",
    "imageUrl": ["https://cloudinary-url/updated-image.jpg"],
    "createdAt": "2025-10-18T10:00:00.000Z",
    "updatedAt": "2025-10-18T12:00:00.000Z"
  }
}
```

#### DELETE `/api/v1/blog/delete/:slug`
Delete a blog post.

**Auth**: Required (Admin only)

**Response (200):**
```json
{
  "message": "Blog deleted successfully"
}
```

### Upload Endpoints

#### POST `/api/v1/upload/image`
Upload an image to Cloudinary.

**Auth**: Required (Admin only)

**Request**: Multipart form data with `image` field

**Response (200):**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v123/blog_images/abc123.jpg",
    "public_id": "blog_images/abc123",
    "width": 1200,
    "height": 800
  }
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message",
  "details": "Additional error details (if applicable)"
}
```

Common HTTP status codes:
- `400`: Bad Request (validation errors, missing fields)
- `401`: Unauthorized (invalid or missing authentication)
- `403`: Forbidden (rate limit exceeded)
- `404`: Not Found (blog post not found)
- `500`: Internal Server Error

## Data Models

### Blog Model
```javascript
{
  title: String (required, 2-100 characters),
  content: String (required, 10-10000 characters),
  slug: String (required, unique, auto-generated),
  imageUrl: [String] (optional, array of Cloudinary URLs),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, bcrypt hashed),
  image: String (optional),
  phone: String (required),
  role: String (enum: ["customer", "collector", "admin"]),
  address: String (optional),
  location: {
    type: String (default: "Point"),
    coordinates: [Number] (default: [0, 0])
  },
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Authentication

The API uses JWT tokens stored in HTTP-only cookies for authentication. Admin credentials are configured via environment variables for security.

## Rate Limiting

Public blog endpoints (`/blogs`, `/:slug`, `/search`) are rate limited to 50 requests per 15 minutes per IP address to prevent abuse.

## Image Upload

Images are automatically optimized when uploaded to Cloudinary:
- Maximum dimensions: 1200x800 pixels
- Automatic quality optimization
- Automatic format selection (WebP when supported)
- Organized in `blog_images` folder

## Development

The server uses nodemon for automatic restart during development:

```bash
npm run dev
```

## Project Structure

```
server/
├── config/
│   └── cloudinary.js          # Cloudinary configuration
├── controllers/
│   ├── blog.controller.js     # Blog CRUD operations
│   ├── upload.controller.js   # Image upload handling
│   └── user.controller.js     # Authentication logic
├── libs/
│   └── db.js                  # MongoDB connection
├── middlewares/
│   └── auth.middleware.js     # Authentication middleware
├── models/
│   ├── blog.model.js          # Blog schema
│   └── user.model.js          # User schema
├── routes/
│   ├── blog.route.js          # Blog API routes
│   ├── upload.route.js        # Upload API routes
│   └── user.route.js          # Auth API routes
├── utils/
│   ├── slug.js                # Slug generation utility
│   └── validation.js          # Zod validation schemas
├── .env                       # Environment variables
├── .gitignore                 # Git ignore rules
├── index.js                   # Server entry point
└── package.json               # Dependencies and scripts
```
