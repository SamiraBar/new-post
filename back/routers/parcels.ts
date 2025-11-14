import express from "express";
import auth from "../middleware/auth";
import {
    createParcel,
    getParcelById,
    getParcelByTrackingNumber,
    getParcels,
    updateParcelStatus
} from "../controllers/parcels";

const parcelsRouter = express.Router();

parcelsRouter.post("/", auth, createParcel);

parcelsRouter.get("/",auth, getParcels);

parcelsRouter.get("/:id",auth, getParcelById);

parcelsRouter.get("/tracking/:trackingNumber",auth, getParcelByTrackingNumber);

parcelsRouter.put("/tracking/:trackingNumber/status", auth, updateParcelStatus);

export default parcelsRouter;