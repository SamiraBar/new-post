import cron from "node-cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {syncAllEKitStatuses} from "./ekit.synchonization";

dayjs.extend(utc);
dayjs.extend(timezone);

export function setupStatusSyncCron() {
    const cronExpression = "*/30 * * * *";

  return cron.schedule(
      cronExpression,
      async () => {
        await syncAllEKitStatuses();
      },
      {
        timezone: "Asia/Bishkek",
      }
    );
}

export function setupTestSyncCron() {
    const cronExpression = "*/1 * * * *";

  return cron.schedule(
      cronExpression,
      async () => {
        await syncAllEKitStatuses();
      },
      {
        timezone: "Asia/Bishkek",
      }
    );
}