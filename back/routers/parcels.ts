import express from "express";
import auth from "../middleware/auth";
import {
    createParcel, getEKitStatus, getParcelById,
    getParcelByTrackingNumber,
    getParcels, sendToEKIT, syncAllParcels, syncParcelWithEKit, syncSingleParcel,
    updateParcelStatus, updatePartnerTrackingNumber,
} from "../controllers/parcels";

const parcelsRouter = express.Router();

parcelsRouter.post("/", createParcel);

parcelsRouter.post("/send-to-ekit", sendToEKIT);

parcelsRouter.post("/sync-all", auth, syncAllParcels);

parcelsRouter.post("/tracking/:trackingNumber/sync", auth, syncSingleParcel);

parcelsRouter.post("/parcels/:id/sync-ekit", syncParcelWithEKit);

parcelsRouter.get("/track/:trackingNumber", getParcelByTrackingNumber);

parcelsRouter.get("/", auth, getParcels);

parcelsRouter.get("/:id", auth, getParcelById);

parcelsRouter.get('/parcels/:id/ekit-status', getEKitStatus);

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
