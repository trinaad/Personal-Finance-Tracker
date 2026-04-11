# Personal Finance Tracker

A personal expense tracker built with React, Node.js, Express, and MongoDB.

## Live Demo

Try the app live on Render:

- https://personal-finance-tracker-gnno.onrender.com

## Features

- User registration and login
- Add, edit, and delete transactions
- Date range filtering and transaction type filtering
- Transaction analytics and category summaries
- MongoDB persistence with Mongoose
- Frontend proxy to backend API

## Improvements added

- Password hashing with `bcryptjs`
- JWT token support for authentication
- Transaction schema indexed by user and date
- Fixed server port configuration
- Added RESTful transaction route support alongside legacy endpoints
- Project documentation and environment example

## How to run

From the repository root:

```bash
npm install
cd client && npm install
cd ..
npm run dev
```

Backend: `http://localhost:5000`
Frontend: `http://localhost:3000`

## Environment variables

Create a `.env` file at the project root with:

```env
PORT=5000
MONGO_URL=your_mongo_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
```
