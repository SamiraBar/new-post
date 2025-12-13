import express from "express";
import auth from "../middleware/auth";
import {
    createParcel, getParcelById,
    getParcelByTrackingNumber,
    getParcels, syncParcelWithEKit,
    updateParcelStatus, updatePartnerTrackingNumber,
} from "../controllers/parcels";

const parcelsRouter = express.Router();

parcelsRouter.post("/", createParcel);

parcelsRouter.post("/parcels/:id/sync-ekit", syncParcelWithEKit);

parcelsRouter.get("/track/:trackingNumber", getParcelByTrackingNumber);

parcelsRouter.get("/", auth, getParcels);

parcelsRouter.get("/:id", auth, getParcelById);

parcelsRouter.patch(
  "/tracking/:trackingNumber/status",
  auth,
  updateParcelStatus,
);

parcelsRouter.patch(
    "/:id/partner-tracking-number",
    auth,
    updatePartnerTrackingNumber,
);

export default parcelsRouter;
