    import Parcel from "../models/Parcel";
    import { getOrderStatus } from "./ekit.service";

    type ParcelStatus =
        | "draft"
        | "created"
        | "accepted"
        | "shipped"
        | "in_country"
        | "in_city"
        | "at_pickup_point"
        | "delivered";

    const EKIT_STATUS_MAPPING: Record<string, string | null> = {
        "Новый": null,
        "Планируется отправка": null,
        "Инвентаризация": null,
        "Отправлен в город назначения": null,
        "В пути": null,

        "Отправлено со склада": "in_country",
        "Получен складом": "in_city",
        "Готов к выдаче": "at_pickup_point",
        "Доставлен": "delivered",
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

            result.totalChecked = parcels.length;
    
            for (const parcel of parcels) {
                try {
    
                    const statusData = await getOrderStatus(parcel.trackingNumber);
    
                    if (!statusData || !statusData.statusTitle) {
                        console.warn(` Не удалось получить статус из E-Kit`);
                        result.skipped++;
                        continue;
                    }
    
                    const ekitStatusTitle = statusData.statusTitle;
    
                    const newStatus = EKIT_STATUS_MAPPING[ekitStatusTitle];
    
                    if (newStatus === undefined) {
                        console.warn(` Неизвестный статус E-Kit: "${ekitStatusTitle}"`);
                        console.warn(` Добавьте этот статус в EKIT_STATUS_MAPPING!`);
                        result.skipped++;
                        result.errors.push({
                            trackingNumber: parcel.trackingNumber,
                            error: `Unknown E-Kit status: ${ekitStatusTitle}`,
                        });
                        continue;
                    }
    
                    if (newStatus === null) {
                        result.skipped++;
                        continue;
                    }
    
                    if (parcel.status === newStatus) {
                        result.skipped++;
                        continue;
                    }

                    const oldStatus = parcel.status;
                    parcel.status = newStatus as ParcelStatus;
                    await parcel.save();

                    result.updated++;
                    result.details.push({
                        trackingNumber: parcel.trackingNumber,
                        oldStatus,
                        newStatus,
                        ekitStatus: ekitStatusTitle,
                    });
    
                } catch (error) {
                    const errorMsg = error instanceof Error ? error.message : String(error);
                    console.error(`Ошибка синхронизации ${parcel.trackingNumber}:`, errorMsg);
                    result.failed++;
                    result.errors.push({
                        trackingNumber: parcel.trackingNumber,
                        error: errorMsg,
                    });
                }
    
                await new Promise(resolve => setTimeout(resolve, 500));
            }
    
            return result;
    
        } catch (error) {
            console.error("Критическая ошибка при синхронизации E-Kit:", error);
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
                    message: "Посылка не найдена",
                };
            }
    
            if (parcel.partnerType !== "E-Kit") {
                return {
                    success: false,
                    message: "Посылка не для E-Kit доставки",
                };
            }
    
            if (!parcel.partnerTrackingNumber) {
                return {
                    success: false,
                    message: "Посылка еще не синхронизирована с E-Kit",
                };
            }
    
            const statusData = await getOrderStatus(parcel.trackingNumber);
    
            if (!statusData || !statusData.statusTitle) {
                return {
                    success: false,
                    message: "Не удалось получить статус из E-Kit",
                };
            }
    
            const ekitStatusTitle = statusData.statusTitle;
    
            const newStatus = EKIT_STATUS_MAPPING[ekitStatusTitle];
    
            if (newStatus === undefined) {
                return {
                    success: false,
                    ekitStatus: ekitStatusTitle,
                    message: `Неизвестный статус E-Kit: ${ekitStatusTitle}`,
                };
            }
    
            if (newStatus === null) {
                return {
                    success: true,
                    ekitStatus: ekitStatusTitle,
                    message: `Статус E-Kit "${ekitStatusTitle}" не требует обновления`,
                };
            }
    
            if (parcel.status === newStatus) {
                return {
                    success: true,
                    oldStatus: parcel.status,
                    newStatus: parcel.status,
                    ekitStatus: ekitStatusTitle,
                    message: "Статус уже актуален",
                };
            }

            const oldStatus = parcel.status;
            parcel.status = newStatus as ParcelStatus;
            await parcel.save();
    
            return {
                success: true,
                oldStatus,
                newStatus,
                ekitStatus: ekitStatusTitle,
                message: `Статус обновлен с ${oldStatus} на ${newStatus}`,
            };
    
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            return {
                success: false,
                message: `Ошибка синхронизации: ${errorMsg}`,
            };
        }
    }