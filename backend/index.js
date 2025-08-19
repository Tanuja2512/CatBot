import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// CORS — allow specific frontend in production
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // restrict in prod
    credentials: true,
  })
);

// Morgan logging (different format for dev vs prod)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // concise colored logs
} else {
  app.use(morgan("combined")); // detailed Apache-style logs
}

// Routers
import userRouter from "./router/userRouter.js";
import chatRouter from "./router/chatRouter.js";
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

// Start server only after DB connects
const PORT = process.env.PORT || 5000;
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });
