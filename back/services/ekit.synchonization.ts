    import Parcel from "../models/Parcel";
    import { getOrderStatus } from "./ekit.service";
    
    const EKIT_STATUS_MAPPING: Record<string, string | null> = {
        "Новый": null,
        "Отправлено со склада": "in_country",
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
    
            console.log(`\nНачинаем синхронизацию статусов для ${parcels.length} посылок E-Kit`);
            console.log(`${"═".repeat(80)}`);
            result.totalChecked = parcels.length;
    
            for (const parcel of parcels) {
                try {
                    console.log(`\n Обработка посылки: ${parcel.trackingNumber}`);
                    console.log(`   Текущий статус NewPost: ${parcel.status}`);
                    console.log(`   E-Kit трек-номер: ${parcel.partnerTrackingNumber}`);
    
                    const statusData = await getOrderStatus(parcel.trackingNumber);
    
                    if (!statusData || !statusData.statusTitle) {
                        console.warn(` Не удалось получить статус из E-Kit`);
                        result.skipped++;
                        continue;
                    }
    
                    const ekitStatusTitle = statusData.statusTitle;
                    console.log(`   E-Kit статус: "${ekitStatusTitle}"`);
    
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
                        console.log(`Статус "${ekitStatusTitle}" не требует обновления (промежуточный)`);
                        result.skipped++;
                        continue;
                    }
    
                    if (parcel.status === newStatus) {
                        console.log(` Статус уже актуален: ${newStatus}`);
                        result.skipped++;
                        continue;
                    }
    
                    const oldStatus = parcel.status;
                    parcel.status = newStatus as any;
                    await parcel.save();
    
                    console.log(`ОБНОВЛЕНО: ${oldStatus} → ${newStatus}`);
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
    
            console.log(`\n${"═".repeat(80)}`);
            console.log(`Итоги синхронизации:`);
            console.log(`Всего проверено: ${result.totalChecked}`);
            console.log(`Обновлено: ${result.updated}`);
            console.log(`Пропущено: ${result.skipped}`);
            console.log(`Ошибок: ${result.failed}`);
            console.log(`${"═".repeat(80)}\n`);
    
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
            console.log(`\n Синхронизация одной посылки: ${trackingNumber}`);
            console.log(`${"─".repeat(60)}`);
    
            const parcel = await Parcel.findOne({ trackingNumber })
                .populate("sender")
                .populate("recipient");
    
            if (!parcel) {
                console.log(` Посылка не найдена`);
                return {
                    success: false,
                    message: "Посылка не найдена",
                };
            }
    
            console.log(`Посылка найдена`);
            console.log(`Текущий статус: ${parcel.status}`);
            console.log(`Тип партнера: ${parcel.partnerType}`);
    
            if (parcel.partnerType !== "E-Kit") {
                console.log(`Посылка не для E-Kit`);
                return {
                    success: false,
                    message: "Посылка не для E-Kit доставки",
                };
            }
    
            if (!parcel.partnerTrackingNumber) {
                console.log(`Посылка еще не синхронизирована с E-Kit`);
                return {
                    success: false,
                    message: "Посылка еще не синхронизирована с E-Kit",
                };
            }
    
            console.log(`E-Kit трек-номер: ${parcel.partnerTrackingNumber}`);
            console.log(`Запрашиваем статус из E-Kit...`);
    
            const statusData = await getOrderStatus(parcel.trackingNumber);
    
            if (!statusData || !statusData.statusTitle) {
                console.log(`Не удалось получить статус из E-Kit`);
                return {
                    success: false,
                    message: "Не удалось получить статус из E-Kit",
                };
            }
    
            const ekitStatusTitle = statusData.statusTitle;
            console.log(`   E-Kit статус: "${ekitStatusTitle}"`);
    
            const newStatus = EKIT_STATUS_MAPPING[ekitStatusTitle];
    
            if (newStatus === undefined) {
                console.log(`Неизвестный статус E-Kit: "${ekitStatusTitle}"`);
                return {
                    success: false,
                    ekitStatus: ekitStatusTitle,
                    message: `Неизвестный статус E-Kit: ${ekitStatusTitle}`,
                };
            }
    
            if (newStatus === null) {
                console.log(`Статус "${ekitStatusTitle}" не требует обновления (промежуточный)`);
                return {
                    success: true,
                    ekitStatus: ekitStatusTitle,
                    message: `Статус E-Kit "${ekitStatusTitle}" не требует обновления`,
                };
            }
    
            if (parcel.status === newStatus) {
                console.log(`Статус уже актуален: ${newStatus}`);
                return {
                    success: true,
                    oldStatus: parcel.status,
                    newStatus: parcel.status,
                    ekitStatus: ekitStatusTitle,
                    message: "Статус уже актуален",
                };
            }
    
            const oldStatus = parcel.status;
            parcel.status = newStatus as any;
            await parcel.save();
    
            console.log(`Статус обновлен: ${oldStatus} → ${newStatus}`);
            console.log(`${"─".repeat(60)}\n`);
    
            return {
                success: true,
                oldStatus,
                newStatus,
                ekitStatus: ekitStatusTitle,
                message: `Статус обновлен с ${oldStatus} на ${newStatus}`,
            };
    
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.error(`Ошибка синхронизации:`, errorMsg);
            return {
                success: false,
                message: `Ошибка синхронизации: ${errorMsg}`,
            };
        }
    }