import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const secret = process.env.JWT_SECRET || "admin_potato_secret"

const DEFAULT_DB = 'mongodb://localhost:27017/new-post';
const dbUri = process.env.MONGO_URI || DEFAULT_DB;

const config = {
    publicPath: path.join(__dirname, 'public'),
    db: dbUri,
};

export default config;