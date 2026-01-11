import express, { Application } from "express";
import { postRouter } from "./modules/posts/post.router";
import { toNodeHandler } from "better-auth/node";

import cors from "cors";
import { auth } from "./lib/auth";

const app: Application = express();
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:4000", // client side url
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/posts", postRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

export default app;
