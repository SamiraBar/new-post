import path from "path";
import fs from "fs/promises";
import auth from "../middleware/auth";
import permit from "../middleware/permit";
import express from "express";

const router = express.Router();

const LIMITS_FILE =
  process.env.NODE_ENV === "production"
    ? path.resolve(process.cwd(), "dist/data/calculator-limits.json")
    : path.resolve(process.cwd(), "data/calculator-limits.json");

interface CalcLimits {
  maxWeightCourier: number;
  maxWeightPVZ: number;
  maxParcelValue: number;
}

const DEFAULT_LIMITS: CalcLimits = {
  maxWeightCourier: 15,
  maxWeightPVZ: 12,
  maxParcelValue: 50000,
};

const ensureDataDir = async () => {
  const dir = path.dirname(LIMITS_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
};

const readLimits = async (): Promise<CalcLimits> => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(LIMITS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return DEFAULT_LIMITS;
  }
};

const writeLimits = async (limits: CalcLimits) => {
  await ensureDataDir();

  try {
    await fs.access(LIMITS_FILE);
    const backup = `${LIMITS_FILE}.backup`;
    await fs.copyFile(LIMITS_FILE, backup);
  } catch {}

  const tempFile = `${LIMITS_FILE}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(limits, null, 2) + "\n", "utf-8");

  await fs.rename(tempFile, LIMITS_FILE);
};

router.get("/", async (req, res, next) => {
  try {
    const limits = await readLimits();
    res.send(limits);
  } catch (e) {
    next(e);
  }
});

router.patch("/", auth, permit("superAdmin"), async (req, res, next) => {
  try {
    const { maxWeightCourier, maxWeightPVZ, maxParcelValue } = req.body;

    if (
      typeof maxWeightCourier !== "number" ||
      typeof maxWeightPVZ !== "number" ||
      typeof maxParcelValue !== "number"
    ) {
      return res.status(400).send({ error: "All limits must be numbers" });
    }

    if (maxWeightCourier <= 0 || maxWeightPVZ <= 0 || maxParcelValue <= 0) {
      return res.status(400).send({ error: "All limits must be positive" });
    }

    const limits: CalcLimits = {
      maxWeightCourier,
      maxWeightPVZ,
      maxParcelValue,
    };

    await writeLimits(limits);
    res.send({ ok: true, limits });
  } catch (e) {
    next(e);
  }
});

export default router;
