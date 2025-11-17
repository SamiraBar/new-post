import express from "express";
import auth from "../middleware/auth";
import {
    createParcel,
    getParcelByTrackingNumber,
    getParcels,
    updateParcelStatus
} from "../controllers/parcels";

const parcelsRouter = express.Router();

parcelsRouter.post("/", createParcel);

parcelsRouter.get("/",auth, getParcels);

parcelsRouter.get("/tracking/:trackingNumber", getParcelByTrackingNumber);

parcelsRouter.patch("/tracking/:trackingNumber/status", auth, updateParcelStatus);

export default parcelsRouter;