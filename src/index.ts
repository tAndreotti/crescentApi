import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";

import router from "./router/index";

// configs
const app = express();
dotenv.config();

app.use(cors({
    origin: "*",
    credentials: true,
}));

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const mongoUrl = process.env.MONGO_URL;
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log("Server running on http://localhost:3000/");
});

mongoose.Promise = Promise;
mongoose.connect(mongoUrl);
mongoose.connection.on("error", (error: Error) => console.log(error));

// routes
app.use("/", router());