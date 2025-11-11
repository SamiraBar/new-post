import express from "express";
import {pricesUpload} from "../multer";
import auth from "../middleware/auth";
import {getPrices, uploadPrices} from "../controllers/prices";

const pricesRouter = express.Router();

pricesRouter.post("/upload", auth, pricesUpload.single("data"), uploadPrices);
pricesRouter.get("/", getPrices)

export default pricesRouter;
