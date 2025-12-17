import express from "express";
import auth from "../middleware/auth";
import permit from "../middleware/permit";
import { getSiteContent, getSiteContentByKey, upsertSiteContent } from "../controllers/siteContent";

const siteContentRouter = express.Router();

siteContentRouter.get("/", auth, permit("superAdmin"), getSiteContent);
siteContentRouter.get("/:key", auth, permit("superAdmin"), getSiteContentByKey);
siteContentRouter.put("/:key", auth, permit("superAdmin"), upsertSiteContent);

export default siteContentRouter;
