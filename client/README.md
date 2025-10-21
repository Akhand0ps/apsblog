# APS Blog Client

Frontend for the APS personal blog. Built with React 19, Vite, and a service layer that talks to the Express backend at `/api/v1/*`. The goal is a long-form writing surface for admins plus a simple reading experience for everyone else.

## Stack

- React 19 + React Router for the UI and routing
- Framer Motion for subtle transitions
- Axios client configured with credentials for auth-protected APIs
- Headless UI disclosures for the mobile navbar
- Tailwind-style utility classes defined in project CSS

## Features

- Auth-aware navigation and dashboard using `/api/v1/auth/me`
- Home page renders full post content with pagination and expand/collapse controls
- Editor supports Cloudinary uploads via `/api/v1/upload/image`
- Post management dashboard handles create, edit, delete
- Contact page highlights GitHub and LinkedIn profiles with avatars

## Getting Started

```bash
npm install
npm run dev
```

The app assumes the backend is running locally on `http://localhost:5000`. Adjust `VITE_API_URL` in `.env` if the API lives elsewhere.
x
## Linting

```bash
npm run lint
```

Lint must pass before commits. The config expects modern React lint rules.

## Environment

Create a `.env` file if you need to target a different API URL:

```
VITE_API_URL=http://localhost:5000
```

## Deployment Notes

- Build with `npm run build`
- Preview locally with `npm run preview`
- Ensure the backend serves the `/api/v1` routes with the same origin or configure CORS appropriately
- For Vercel deployment, the `vercel.json` file ensures all routes fallback to `index.html` for client-side routing
- Direct URL access (like `/blog/some-slug`) requires server-side rewrite rules to serve the SPA entry point

## Vercel Configuration

The `vercel.json` file configures the deployment to handle client-side routing properly. Without it, direct navigation to routes like `/blog/post-slug` would return 404 errors because Vercel tries to find physical files at those paths.

The rewrite rule `"source": "/(.*)", "destination": "/index.html"` ensures all requests are served by the React app, which then handles routing internally via React Router.

## Contributing

Changes should focus on clarity and maintainability. Keep UI copy grounded in the personal blog voice. Use `npm run lint` before opening a pull request.
