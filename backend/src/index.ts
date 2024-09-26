import "./firebase-config";
import "./images/images";
import "http";
import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import http from "http";
import { imageRouter } from "./images/images";
require("dotenv").config();

const app = express();
const router = express.Router();

app.use(
  cors({
    credentials: true,
  }),
);

app.listen(process.env.BACKEND_PORT, () => {
  console.log(
    `Server running on http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}`,
  );
});

router.use("/images", imageRouter);

app.use(router);
