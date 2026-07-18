# Veloura

A full-stack luxury watch e-commerce platform built with the MERN stack, featuring a real payment flow, JWT authentication, and an admin dashboard.

## Features

- **Product catalog** — search, category/brand filtering, price range filtering, and sorting
- **Cart** — persisted server-side per user, with stock validation
- **Authentication** — JWT-based auth with bcrypt password hashing
- **Checkout & Payments** — Razorpay integration with cryptographic payment signature verification
- **Order management** — order history, order details, delivery status tracking
- **Admin dashboard** — manage products, view/update orders, manage users
- **Smart search** — live product search
- **Smooth scrolling UI** — built with Lenis and Framer Motion

## Tech Stack

**Frontend:** React 19, React Router, Tailwind CSS, Framer Motion, Three.js (`@react-three/fiber`), Vite

**Backend:** Node.js, Express, MongoDB with Mongoose, JWT, bcrypt, Razorpay

## Project Structure

```
Veloura-main/
├── frontend/          # React + Vite app
│   └── src/
│       ├── components/
│       ├── context/    # Auth & Cart global state
│       ├── pages/
│       │   └── admin/  # Admin dashboard pages
│       └── config/     # API base URL config
└── backend/           # Express API
    ├── routes/
    ├── controllers/
    ├── models/
    └── middleware/
```

## Running Locally

### Backend
```bash
cd backend
npm install
```
Create a `.env` file in `backend/` with:
```
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```
```bash
npm run dev
```

Optionally seed the database with sample products and an admin account:
```bash
npm run data:import
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

In local development, no extra config is needed — Vite's dev server proxies `/api` requests to the backend automatically (see `vite.config.js`).

## Deployment

Frontend and backend are deployed separately. When deployed, set the `VITE_API_URL` environment variable on your frontend hosting platform (e.g. Vercel) to your backend's deployed URL, so the frontend can reach the API directly instead of relying on the local dev proxy.

## Author

Kumar Tambe
