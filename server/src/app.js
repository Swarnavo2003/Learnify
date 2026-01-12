import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./config/logger.js";
import { errorHandler } from "./utils/error-handler.js";
import userRouter from "./routes/user.router.js";
import courseRouter from "./routes/course.router.js";
import moduleRouter from "./routes/module.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json("Welcome to the Learnify API");
});

app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/modules", moduleRouter);

app.use(errorHandler);

export default app;
