import './firebase-config';
import './images/images'
import "http";
import express from "express";
import {Request, Response} from "express";
import cors from "cors";
import http from "http";
import { imageRouter } from './images/images';
require("dotenv").config();

const app = express();
/*
const PORT = 8080;
const HOST = "localhost";
*/

const router = express.Router();
app.use(cors({
    credentials: true,
}));
/*
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`server running on http://${HOST}:${PORT}/`);
});
*/

app.listen(process.env.BACKEND_PORT, () => {
    console.log(`Server running on http://${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}`)
});
   
   

router.use('/images', imageRouter);


app.use(router);