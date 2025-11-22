import express from "express";
import {pricesUpload} from "../multer";
import auth from "../middleware/auth";
import {calculatePrice, getPrices, uploadPrices} from "../controllers/prices";

const pricesRouter = express.Router();

pricesRouter.post("/upload", auth, pricesUpload.single("data"), uploadPrices);
pricesRouter.get("/", getPrices);
pricesRouter.get("/calculate", calculatePrice);

export default pricesRouter;
