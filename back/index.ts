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

const app = express();

app.use(express.json());
app.use(cors(config.corsOptions));

const publicPath = fs.existsSync(path.join(__dirname, "public"))
  ? path.join(__dirname, "public")
  : path.join(__dirname, "../public");
console.log("📁 Public directory:", publicPath);
app.use(express.static(publicPath));

app.use("/admins", adminsRouter);
app.use("/prices", pricesRouter);
app.use("/parcels", parcelsRouter);
app.use("/printer", printerRouter);
app.use("/i18n-content", i18nContentRouter);
app.use("/offices", officeRouter);
app.use("/", socialMediaRouter);

const run = async () => {
  try {
    await mongoose.connect(config.db);
    console.log("✅ Connected to MongoDB");

    // setupTestSyncCron();  🔴 НЕ РАСКОММЕНТИРОВАТЬ!
    await seedSocialNetworks();

    console.log("Автоматический Cron: ОТКЛЮЧЕН (для безопасности)");
    console.log("Ручная синхронизация доступна через API:");
    console.log("   - POST /parcels/sync-all (синхронизировать все посылки)");
    console.log(
      "   - POST /parcels/tracking/:trackingNumber/sync (синхронизировать одну)",
    );
    console.log("⚡ Оба роута требуют авторизации (заголовок Authorization)");

    app.listen(config.port as number, "0.0.0.0", () => {
      console.log(`Server running on port ${config.port}`);
      console.log(
        `🔒 Режим: БЕЗОПАСНЫЙ (ручная синхронизация через /parcels/sync-all)`,
      );
      console.log("=".repeat(50));
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

run().catch(console.error);
