import Parcel from "../models/Parcel";
import { getOrderStatus } from "./ekit.service";

const EKIT_STATUS_MAPPING: Record<string, string | null> = {
    "Новая": null,
    "Принято": "accepted",
    "Отправлен в город назначения": null,
    "В пути": null,
    "В городе": "in_city",
    "Посылка в ПВЗ": "at_pickup_point",
    "Выдано": "delivered",
    "Вручено": "delivered",
};

interface SyncResult {
    totalChecked: number;
    updated: number;
    failed: number;
    skipped: number;
    details: Array<{
        trackingNumber: string;
        oldStatus: string;
        newStatus: string;
        ekitStatus: string;
    }>;
    errors: Array<{
        trackingNumber: string;
        error: string;
    }>;
}

export async function syncAllEKitStatuses(): Promise<SyncResult> {
    const result: SyncResult = {
        totalChecked: 0,
        updated: 0,
        failed: 0,
        skipped: 0,
        details: [],
        errors: [],
    };

    try {
        const parcels = await Parcel.find({
            partnerType: "E-Kit",
            status: { $nin: ["draft", "delivered"] },
            partnerTrackingNumber: { $ne: null },
        })
            .populate("sender")
            .populate("recipient");

        console.log(`Starting E-Kit status sync for ${parcels.length} parcels`);
        result.totalChecked = parcels.length;

        for (const parcel of parcels) {
            try {
                const statusData = await getOrderStatus(parcel.trackingNumber);

                if (!statusData || !statusData.statusTitle) {
                    console.warn(`No status data from E-Kit for ${parcel.trackingNumber}`);
                    result.skipped++;
                    continue;
                }

                const ekitStatusTitle = statusData.statusTitle;
                console.log(` ${parcel.trackingNumber}: E-Kit status = "${ekitStatusTitle}"`);

                const newStatus = EKIT_STATUS_MAPPING[ekitStatusTitle];

                if (newStatus === null) {
                    console.log(`Status "${ekitStatusTitle}" doesn't require update`);
                    result.skipped++;
                    continue;
                }

                if (newStatus === undefined) {
                    console.warn(`Unknown E-Kit status: "${ekitStatusTitle}"`);
                    result.skipped++;
                    result.errors.push({
                        trackingNumber: parcel.trackingNumber,
                        error: `Unknown E-Kit status: ${ekitStatusTitle}`,
                    });
                    continue;
                }

                if (parcel.status === newStatus) {
                    console.log(`Status already up to date: ${newStatus}`);
                    result.skipped++;
                    continue;
                }

                const oldStatus = parcel.status;
                parcel.status = newStatus as any;
                await parcel.save();

                console.log(`Updated: ${oldStatus} → ${newStatus}`);
                result.updated++;
                result.details.push({
                    trackingNumber: parcel.trackingNumber,
                    oldStatus,
                    newStatus,
                    ekitStatus: ekitStatusTitle,
                });

            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : String(error);
                console.error(`Failed to sync ${parcel.trackingNumber}:`, errorMsg);
                result.failed++;
                result.errors.push({
                    trackingNumber: parcel.trackingNumber,
                    error: errorMsg,
                });
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log(`\n Sync completed:`, {
            total: result.totalChecked,
            updated: result.updated,
            skipped: result.skipped,
            failed: result.failed,
        });

        return result;

    } catch (error) {
        console.error("Fatal error during E-Kit sync:", error);
        throw error;
    }
}

export async function syncSingleParcelStatus(
    trackingNumber: string
): Promise<{
    success: boolean;
    oldStatus?: string;
    newStatus?: string;
    ekitStatus?: string;
    message: string;
}> {
    try {
        const parcel = await Parcel.findOne({ trackingNumber })
            .populate("sender")
            .populate("recipient");

        if (!parcel) {
            return {
                success: false,
                message: "Parcel not found",
            };
        }

        if (parcel.partnerType !== "E-Kit") {
            return {
                success: false,
                message: "Parcel is not for E-Kit delivery",
            };
        }

        if (!parcel.partnerTrackingNumber) {
            return {
                success: false,
                message: "Parcel not synced with E-Kit yet",
            };
        }

        const statusData = await getOrderStatus(parcel.trackingNumber);

        if (!statusData || !statusData.statusTitle) {
            return {
                success: false,
                message: "Could not get status from E-Kit",
            };
        }

        const ekitStatusTitle = statusData.statusTitle;
        const newStatus = EKIT_STATUS_MAPPING[ekitStatusTitle];

        if (newStatus === null) {
            return {
                success: true,
                ekitStatus: ekitStatusTitle,
                message: `E-Kit status "${ekitStatusTitle}" doesn't require update`,
            };
        }

        if (newStatus === undefined) {
            return {
                success: false,
                ekitStatus: ekitStatusTitle,
                message: `Unknown E-Kit status: ${ekitStatusTitle}`,
            };
        }

        if (parcel.status === newStatus) {
            return {
                success: true,
                oldStatus: parcel.status,
                newStatus: parcel.status,
                ekitStatus: ekitStatusTitle,
                message: "Status already up to date",
            };
        }

        const oldStatus = parcel.status;
        parcel.status = newStatus as any;
        await parcel.save();

        return {
            success: true,
            oldStatus,
            newStatus,
            ekitStatus: ekitStatusTitle,
            message: `Status updated from ${oldStatus} to ${newStatus}`,
        };

    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return {
            success: false,
            message: `Sync failed: ${errorMsg}`,
        };
    }
}