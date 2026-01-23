import express from "express";
import {partnerStickerPdf, stickerPdf} from "../controllers/printer";
import auth from "../middleware/auth";

const printerRouter = express.Router();

printerRouter.post("/sticker-pdf", auth, stickerPdf);
printerRouter.post("/:trackingNumber/partner-sticker-pdf", auth, partnerStickerPdf);

export default printerRouter;
