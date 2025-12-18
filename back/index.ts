import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import adminsRouter from "./routers/admins";
import pricesRouter from "./routers/prices";
import parcelsRouter from "./routers/parcels";
import printerRouter from "./routers/printer";

const app = express();

app.use(express.json());
app.use(cors(config.corsOptions));

app.use("/admins", adminsRouter);
app.use("/prices", pricesRouter);
app.use("/parcels", parcelsRouter);
app.use("/printer", printerRouter);

const run = async () => {
  await mongoose.connect(config.db);
  app.listen(config.port, () => {
    console.log(`Server on port ${config.port}`);
  });
};

run().catch(console.error);
