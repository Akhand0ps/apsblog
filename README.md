# APSBlog

A full-stack personal blog application built with React and Node.js, featuring role based authentication, blog management, and image upload capabilities.

## Architecture

This is a monorepo containing two main applications:

- **client/**: Frontend React application built with Vite
- **server/**: Backend Node.js API server with Express.js

## Features

### Frontend Features
- Modern React 19 with functional components and hooks
- Responsive design with Tailwind CSS 4
- React Router v7 for client-side routing
- Protected routes with authentication
- Blog editor with image upload support
- User authentication and session management
- Interactive UI components with Framer Motion animations
- Mobile-responsive design with Headless UI components

### Backend Features
- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- JWT-based authentication with HTTP-only cookies
- Image upload integration with Cloudinary
- Rate limiting and security middleware
- Input validation with Zod
- Automatic slug generation for blog posts
- CORS configuration for cross-origin requests

## Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **UI Components**: Headless UI, Radix UI
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js 5
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt for password hashing
- **File Upload**: Multer with Cloudinary integration
- **Validation**: Zod
- **Security**: CORS, Rate limiting, Cookie parser
- **Development**: Nodemon for auto-restart

## Project Structure

```
apsblog/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── lib/            # Utility libraries
│   │   ├── pages/          # Route components
│   │   └── services/       # API service functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── server/                 # Backend Node.js API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route handlers
│   ├── libs/               # Database connection
│   ├── middlewares/        # Custom middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── utils/              # Helper functions
│   └── package.json        # Backend dependencies
└── README.md              # This file
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - for admin login
- `GET /api/v1/auth/me` - Get admin profile

### Blog Management
- `GET /api/v1/blog/blogs` - Get all blogs (with pagination)
- `GET /api/v1/blog/:slug` - Get blog by slug
- `GET /api/v1/blog/search` - Search blogs
- `POST /api/v1/blog/create` - Create new blog (protected)
- `PUT /api/v1/blog/update/:slug` - Update blog (protected)
- `DELETE /api/v1/blog/delete/:slug` - Delete blog (protected)

### File Upload
- `POST /api/v1/upload` - Upload images to Cloudinary

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account for image uploads

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apsblog
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Environment Configuration

#### Server Environment Variables
Create a `.env` file in the `server/` directory:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/apsblog
JWT_SECRET=your-jwt-secret-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

#### Client Environment Variables
Create a `.env` file in the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5001
```

### Running the Application

#### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:5001

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on http://localhost:5173

#### Production Build

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd server
   node index.js
   ```

## Database Schema

### User Model
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `phone`: String (required)
- `image`: String (optional)
- `role`: Enum ['customer', 'collector', 'admin']
- `address`: String (optional)
- `location`: GeoJSON Point with coordinates

### Blog Model
- `title`: String (required)
- `content`: String (required)
- `slug`: String (required, unique, auto-generated)
- `imageUrl`: Array of strings
- `timestamps`: createdAt, updatedAt

## Security Features

- Password hashing with bcrypt
- JWT authentication with HTTP-only cookies
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Protected routes on both client and server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.