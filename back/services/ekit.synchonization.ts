    import Parcel from "../models/Parcel";
    import { getChangedStatusesOnlyLast, commitLastStatus, getOrderStatus } from "./ekit.service";

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

        const LIMIT = Number(process.env.EKIT_STATUS_LIMIT ?? 300);  // чтобы не улететь в огромные ответы

        try {
            while (true) {
                const changed = await getChangedStatusesOnlyLast({
                    limit: LIMIT
                });

                if (changed.length === 0) break;

                result.totalChecked += changed.length;

                const missingOrderCode = changed.some((x) => !x.ordercode);
                if (LIMIT && missingOrderCode) {
                    throw new Error("E-Kit returned changes without ordercode while using limit; can't safely commit");
                }

                const orderNos = changed.map((x) => x.orderno);

                const parcels = await Parcel.find({
                    partnerType: "E-Kit",
                    partnerTrackingNumber: { $in: orderNos },
                }).populate("sender").populate("recipient");

                const byPartnerTrack = new Map<string, any>();
                for (const p of parcels) {
                    if (p.partnerTrackingNumber) byPartnerTrack.set(String(p.partnerTrackingNumber), p);
                }

                const commitCodes: string[] = [];

                for (const ch of changed) {
                    const ekitStatusTitle = ch.statusTitle || ch.status || "UNKNOWN";
                    const parcel = byPartnerTrack.get(ch.orderno);

                    if (!parcel) {
                        result.skipped++;
                        result.errors.push({
                            trackingNumber: ch.orderno,
                            error: "Parcel not found in DB for this partnerTrackingNumber",
                        });
                        continue;
                    }

                    const mapped = EKIT_STATUS_MAPPING[ekitStatusTitle];

                    if (mapped === undefined) {
                        result.skipped++;
                        result.errors.push({
                            trackingNumber: ch.orderno,
                            error: `Unknown E-Kit status: ${ekitStatusTitle}`,
                        });
                        continue;
                    }

                    if (mapped === null) {
                        result.skipped++;
                        if (ch.ordercode) commitCodes.push(ch.ordercode);
                        continue;
                    }

                    if (parcel.status === mapped) {
                        result.skipped++;
                        if (ch.ordercode) commitCodes.push(ch.ordercode);
                        continue;
                    }

                    try {
                        const oldStatus = parcel.status;
                        parcel.status = mapped as ParcelStatus;
                        await parcel.save();

                        result.updated++;
                        result.details.push({
                            trackingNumber: String(parcel.trackingNumber),
                            oldStatus,
                            newStatus: mapped,
                            ekitStatus: ekitStatusTitle,
                        });

                        if (ch.ordercode) commitCodes.push(ch.ordercode);
                    } catch (e) {
                        const msg = e instanceof Error ? e.message : String(e);
                        result.failed++;
                        result.errors.push({ trackingNumber: ch.orderno, error: msg });
                    }
                }

                if (commitCodes.length) {
                    await commitLastStatus({
                        orderCodes: commitCodes,
                    });
                }

                if (changed.length < LIMIT) break;

                if (!commitCodes.length) {
                    console.warn(
                      `[E-Kit ONLY_LAST] Got ${changed.length} changes but produced 0 commit codes. Breaking to avoid infinite loop.`
                    );
                    break;
                }
            }

            return result;
        } catch (error) {
            console.error("Критическая ошибка при sync ONLY_LAST:", error);
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

            const statusData = await getOrderStatus(String(parcel.partnerTrackingNumber));

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