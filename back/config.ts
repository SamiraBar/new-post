import { CorsOptions } from "cors";
import { configDotenv } from "dotenv";
import path from "path";

export const secret = "admin_potato_secret";

const envFile = process.env["NODE_ENV"]
  ? `.${process.env["NODE_ENV"]}.env`
  : ".env";
configDotenv({ path: envFile });

const rootPath = __dirname;

const corsWhiteList = ["http://localhost:5173", "http://localhost:5183"];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || corsWhiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const config = {
  port: process.env["PORT"] || 8000,
  rootPath,
  corsOptions,
  publicPath: path.join(rootPath, "public"),
  db: process.env["MONGO_DB_URL"] || "mongodb://localhost/new-post",
};

export default config;
