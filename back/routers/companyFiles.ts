import express from "express";
import auth from "../middleware/auth";
import permit from "../middleware/permit";
import { companyFileUpload } from "../multer";
import {
    deleteFile,
    downloadFile,
    getAgreementFile,
    getFiles,
    replaceFile,
    uploadFile
} from "../controllers/companyFile";
const router = express.Router();

router.get("/", auth, permit("superAdmin"), getFiles);
router.post("/", auth, permit("superAdmin"), companyFileUpload.single("file"), uploadFile);
router.patch("/:id", auth, permit("superAdmin"), companyFileUpload.single("file"), replaceFile);
router.delete("/:id", auth, permit("superAdmin"), deleteFile);
router.get("/download/:id", downloadFile);
router.get("/agreement", getAgreementFile);

export default router;
