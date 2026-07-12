import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ----------------------------- Middleware ----------------------------- */

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

/* -------------------------------- Routes ------------------------------ */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to AssetFlow API 🚀",
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "Healthy",
    timestamp: new Date().toISOString(),
  });
});

/* --------------------------- 404 Middleware --------------------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ------------------------- Global Error Handler ------------------------ */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ---------------------------- Start Server ---------------------------- */

app.listen(PORT, () => {
  console.log(`
==========================================
🚀 AssetFlow Backend Started
==========================================
🌍 Environment : ${process.env.NODE_ENV || "development"}
📡 Port        : ${PORT}
==========================================
`);
});
