import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

import dbConnect from "./config/dbConnect.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

import authRouter from "./routes/authRoute.js";
import productRouter from "./routes/productRoute.js";
import blogRouter from "./routes/blogRoute.js";
import categoryRouter from "./routes/prodcategoryRoute.js";
import blogcategoryRouter from "./routes/blogCatRoute.js";
import brandRouter from "./routes/brandRoute.js";
import colorRouter from "./routes/colorRoute.js";
import enqRouter from "./routes/enqRoute.js";
import couponRouter from "./routes/couponRoute.js";
import uploadRouter from "./routes/uploadRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database
dbConnect();

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/color", colorRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/upload", uploadRouter);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Server start
app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
});
