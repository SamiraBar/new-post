import express from "express";
import { printPartnerSticker, printSticker } from "../controllers/printer";
import auth from "../middleware/auth";

const printerRouter = express.Router();

printerRouter.post("/printSticker", auth, printSticker);
printerRouter.post("/printPartnerSticker", auth, printPartnerSticker);

export default printerRouter;
