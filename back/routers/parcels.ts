import express from "express";
import auth from "../middleware/auth";
import {
  createParcel,
  getParcelByTrackingNumber,
  getParcels,
  updateParcelStatus,
} from "../controllers/parcels";

const parcelsRouter = express.Router();

parcelsRouter.post("/", createParcel);

parcelsRouter.get("/track/:trackingNumber", getParcelByTrackingNumber);

parcelsRouter.get("/", auth, getParcels);


parcelsRouter.patch(
  "/tracking/:trackingNumber/status",
  auth,
  updateParcelStatus,
);

export default parcelsRouter;
