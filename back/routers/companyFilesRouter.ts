import express from "express";
import CompanyFile from "../models/CompanyFile";
import auth from "../middleware/auth";
import permit from "../middleware/permit";
import { companyFileUpload } from "../multer";
import path from "path";
import fs from "fs";

const router = express.Router();

router.get("/", auth, permit("superAdmin"), async (req, res, next) => {
    try {
        const files = await CompanyFile.find();
        res.json(files);
    } catch (e) {
        next(e);
    }
});

router.post("/", auth, permit("superAdmin"), companyFileUpload.single("file"), async (req, res, next) => {
    try {
        const type = req.body.type;
        if (!type) return res.status(400).json({ error: "File type is required" });
        if (!req.file) return res.status(400).json({ error: "File is required" });

        const newFile = await CompanyFile.create({
            type,
            fileName: req.file.originalname,
            fileUrl: `/uploads/company-files/${req.file.filename}`,
            uploadedAt: new Date(),
        });

        res.json(newFile);
    } catch (e) {
        next(e);
    }
});

router.patch("/:id", auth, permit("superAdmin"), companyFileUpload.single("file"), async (req, res, next) => {
    try {
        const file = await CompanyFile.findById(req.params.id);
        if (!file) return res.status(404).json({ error: "File not found" });

        if (req.file) {
            const oldPath = path.join(process.cwd(), file.fileUrl);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

            file.fileName = req.file.originalname;
            file.fileUrl = `/uploads/company-files/${req.file.filename}`;
            file.uploadedAt = new Date();
        }

        await file.save();
        res.json(file);
    } catch (e) {
        next(e);
    }
});

router.delete("/:id", auth, permit("superAdmin"), async (req, res, next) => {
    try {
        const file = await CompanyFile.findById(req.params.id);
        if (!file) return res.status(404).json({ error: "File not found" });

        const filePath = path.join(process.cwd(), file.fileUrl);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await file.deleteOne();
        res.json({ ok: true });
    } catch (e) {
        next(e);
    }
});

export default router;
