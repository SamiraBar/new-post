import mongoose, { Model } from "mongoose";

export type SiteContentKey = "about.company" | "footer.contact";

export interface SiteContentDef {
    key: SiteContentKey;
    lang: "ru" | "kg";
    value: unknown;
    updatedAt?: Date;
    createdAt?: Date;
}

type SiteContentModel = Model<SiteContentDef>;

const Schema = mongoose.Schema;

const SiteContentSchema = new Schema<SiteContentDef, SiteContentModel>(
    {
        key: { type: String, required: true },
        lang: { type: String, required: true },
        value: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
);

SiteContentSchema.index({ key: 1, lang: 1 }, { unique: true });

const SiteContent = mongoose.model<SiteContentDef, SiteContentModel>(
    "SiteContent",
    SiteContentSchema
);

export default SiteContent;
