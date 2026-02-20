import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import prisma from "./src/lib/prisma.js";
import errorHandlerMiddleware from "./src/middlewares/error-handler.js";
import notFound from "./src/middlewares/not-found.js";
import cookieParser from "cookie-parser";
import auth from "./src/routes/auth.js";
import supplier from "./src/routes/supplier.js";
import Medicine from "./src/routes/Medicine.js";
import purchas from "./src/routes/purchas.js";
import sale from "./src/routes/sale.js";
dotenv.config();
const app = express();
// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/suppliers", supplier);
app.use("/api/v1/medicine", Medicine);
app.use("/api/v1/purchas", purchas);
app.use("/api/v1/sale", sale);
app.get("/favicon.ico", (req, res) => res.status(204).end());
//errors
app.use(errorHandlerMiddleware);
// route not found
app.use(notFound);
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
