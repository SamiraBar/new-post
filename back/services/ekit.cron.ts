import cron from "node-cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { syncAllEKitStatuses } from "./ekit.synchonization";

dayjs.extend(utc);
dayjs.extend(timezone);

export function setupStatusSyncCron() {
    const cronExpression = "0 6 * * *";

    const task = cron.schedule(
        cronExpression,
        async () => {
            const now = dayjs().tz("Asia/Bishkek").format("YYYY-MM-DD HH:mm:ss");
            console.log(`\n${"=".repeat(60)}`);
            console.log(`🕐 E-Kit Status Sync Started at ${now}`);
            console.log(`${"=".repeat(60)}\n`);

            try {
                const result = await syncAllEKitStatuses();

                console.log(`\n${"=".repeat(60)}`);
                console.log("Sync Summary:");
                console.log(`Total checked: ${result.totalChecked}`);
                console.log(`Updated: ${result.updated}`);
                console.log(`Skipped: ${result.skipped}`);
                console.log(`Failed: ${result.failed}`);

                if (result.details.length > 0) {
                    console.log("\nUpdated parcels:");
                    result.details.forEach((detail) => {
                        console.log(
                            `   ${detail.trackingNumber}: ${detail.oldStatus} → ${detail.newStatus} (E-Kit: ${detail.ekitStatus})`
                        );
                    });
                }

                if (result.errors.length > 0) {
                    console.log("\n  Errors:");
                    result.errors.forEach((error) => {
                        console.log(`   ${error.trackingNumber}: ${error.error}`);
                    });
                }

                console.log(`${"=".repeat(60)}\n`);
            } catch (error) {
                console.error("\n Fatal error during scheduled sync:", error);
                console.log(`${"=".repeat(60)}\n`);
            }
        },
        {
            timezone: "Asia/Bishkek",
        }
    );

    console.log("E-Kit status sync cron job configured:");
    console.log(`   Schedule: Every day at 06:00 (Asia/Bishkek)`);
    console.log(`   Cron expression: ${cronExpression}`);
    console.log(
        `   Next run: ${dayjs()
            .tz("Asia/Bishkek")
            .hour(6)
            .minute(0)
            .second(0)
            .format("YYYY-MM-DD HH:mm:ss")}\n`
    );

    return task;
}

export function setupTestSyncCron() {
    const cronExpression = "*/1 * * * *";

    const task = cron.schedule(
        cronExpression,
        async () => {
            const now = dayjs().tz("Asia/Bishkek").format("YYYY-MM-DD HH:mm:ss");
            console.log(`\n TEST E-Kit Status Sync at ${now}`);

            try {
                const result = await syncAllEKitStatuses();
                console.log(
                    `TEST Sync completed: ${result.updated} updated, ${result.failed} failed`
                );
            } catch (error) {
                console.error("TEST Sync failed:", error);
            }
        },
        {
            timezone: "Asia/Bishkek",
        }
    );

    console.log("TEST sync cron started (every minute)\n");

    return task;
}