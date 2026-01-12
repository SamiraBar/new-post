import express from "express";
import {
  getAllSocialNetworks,
  createSocialNetwork,
  updateSocialNetwork,
  deleteSocialNetwork,
  reorderSocialNetworks,
} from "../controllers/socialMedia";
import { uploadSocialIcon } from "../middleware/uploadSocialIcon";
import permit from "../middleware/permit";

const router = express.Router();

router.get("/social-networks", getAllSocialNetworks);

router.post(
  "/social-networks",
  permit("superAdmin"),
  uploadSocialIcon,
  createSocialNetwork,
);
router.patch(
  "/social-networks/reorder",
  permit("superAdmin"),
  reorderSocialNetworks,
);
router.patch(
  "/social-networks/:id",
  permit("superAdmin"),
  uploadSocialIcon,
  updateSocialNetwork,
);
router.delete(
  "/social-networks/:id",
  permit("superAdmin"),
  deleteSocialNetwork,
);

export default router;
