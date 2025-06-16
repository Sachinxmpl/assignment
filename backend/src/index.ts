import express from "express";
import prismaClient from "./config/db";
import cors from "cors";
import dotenv from "dotenv";

import session from "express-session"
import { errorMiddleware } from "./middlewares/error";

import authRoutes from './routes/authRoutes'
import bookRoutes from './routes/bookRoutes'
import borrowRoutes from './routes/borrowRoutes'
import categoryRoutes from './routes/categoryRoutes'
import reviewRoutes from './routes/reviewRoutes'
import userRoutes from './routes/userRoutes'
import './config/passport'
import passport from "passport";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json())
app.use(session({ secret: process.env.SESSION_SECRET!, resave: false, saveUninitialized: false }));
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRoutes)
app.use('/books', bookRoutes)
app.use('/borrows', borrowRoutes);
app.use('/categories', categoryRoutes);
app.use('/reviews', reviewRoutes);
app.use('/users', userRoutes);

app.use(errorMiddleware);

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await prismaClient.$connect();
    console.log("Connected to dataabse");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.log("Failed database connection");
    process.exit(1);
  }
}

startServer();
