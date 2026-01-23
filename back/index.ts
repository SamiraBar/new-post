import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import adminsRouter from "./routers/admins";
import pricesRouter from "./routers/prices";
import parcelsRouter from "./routers/parcels";
import printerRouter from "./routers/printer";
import i18nContentRouter from "./routers/i18nContent";
import {setupTestSyncCron} from "./services/ekit.cron";
import officeRouter from './routers/offices';
import socialMediaRouter from "./routers/socialMedia";
import path from "path";
import { seedSocialNetworks } from "./utils/seedSocialNetworks";
import fs from "fs";
import companyFilesRouter from "./routers/companyFiles";

const app = express();

app.use(express.json());
app.use(cors(config.corsOptions));

const publicPath = fs.existsSync(path.join(__dirname, "public"))
  ? path.join(__dirname, "public")
  : path.join(__dirname, "../public");
app.use(express.static(publicPath));

app.use("/admins", adminsRouter);
app.use("/prices", pricesRouter);
app.use("/parcels", parcelsRouter);
app.use("/printer", printerRouter);
app.use("/i18n-content", i18nContentRouter);
app.use("/admin/company-files", companyFilesRouter);
app.use("/offices", officeRouter);
app.use("/", socialMediaRouter);

const run = async () => {
  try {
    await mongoose.connect(config.db);

    // setupTestSyncCron(); <-- крон для всех посылок, не расскомичивать, если не знаете что это
    await seedSocialNetworks();

    app.listen(config.port as number, "0.0.0.0", () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

run().catch(console.error);
