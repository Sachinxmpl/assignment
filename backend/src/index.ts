import express from "express";
import prismaClient from "./config/db";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import { errorMiddleware } from "./middlewares/error";

dotenv.config();

const app = express();


app.use(express.json())
app.use(passport.initialize())


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
