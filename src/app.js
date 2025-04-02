import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import feedRouter from "./routes/feed.routes.js";
const app = express();

app.use(
  cors({
    origin: [
        process.env.CORS_ORIGIN,               // E.g., http://localhost:5173
        "http://192.168.93.111:5179",          // Mobile device IP address
        "http://localhost:5179"                // For local testing on the desktop
    ],
    credentials: true,
  })
);
console.log(process.env.CORS_ORIGIN);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//router
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/feed",  feedRouter);

export { app };
