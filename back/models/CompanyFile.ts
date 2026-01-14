import mongoose from "mongoose";

export interface ICompanyFile extends mongoose.Document {
    type: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: Date;
}

const CompanyFileSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        fileUrl: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        },
    },
    { timestamps: true }
);

const CompanyFile = mongoose.model<ICompanyFile>("CompanyFile", CompanyFileSchema);

export default CompanyFile;
