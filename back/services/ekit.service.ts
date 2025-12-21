import {IParcel} from "../models/Parcel";
import {IContact} from "../models/Contact";
import axios from 'axios';
import xml2js from 'xml2js';
import {EKitOrderResult} from "../types";
import Parcel from "../models/Parcel";

interface EKitConfig {
    extra: string;
    login: string;
    pass: string;
    apiUrl: string;
}

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

const config: EKitConfig = {
    extra: process.env.EKIT_EXTRA || '',
    login: process.env.EKIT_LOGIN || '',
    pass: process.env.EKIT_PASS || '',
    apiUrl: process.env.EKIT_API_URL || '',
}

if(!config.login || !config.pass){
    console.warn('EKit login or pass is wrong');
}

function escapeXml(text: string): string {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

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

export async function createOrderInEKit(parcel: IParcel): Promise<EKitOrderResult> {
    console.log('E-Kit auth check:', {
        extra: config.extra,
        login: config.login,
        pass: config.pass,
        apiUrl: config.apiUrl
    });

    const authExtra = config.extra;
    const authLogin = config.login;
    const authPass = config.pass;

    const sender = parcel.sender as IContact;
    const recipient = parcel.recipient as IContact;

    let recipientAddress = '';
    let recipientCity = '';

    if(parcel.deliveryType === 'courier') {
        recipientCity = recipient.city || parcel.destinationCity;
        const parts = [
            recipient.street,
            recipient.house ? `д. ${recipient.house}` : '',
            recipient.apartment ? `кв. ${recipient.apartment}` : '',
        ].filter(Boolean);
        recipientAddress = parts.length > 0 ? parts.join(', ') : recipient.address || 'Not selected';
    } else {
        recipientCity = parcel.pvzData?.town || parcel.destinationCity;
        recipientAddress = parcel.pvzData?.address || recipient.address || 'Not selected';
    }
    console.log('🔍 Проверка данных для XML:', {
        originCity: parcel.originCity,
        senderAddress: sender.address,
        senderFullName: sender.fullName,
        senderPhone: sender.phoneNumber
    });
    console.log('Проверяем код ПВЗ из parcel:', {
        pvzCodeFromParcel: parcel.pvzData?.code,
        pvzCodeWeWillSend: '261457'
    });
    let finalPvzCode = parcel.pvzData?.code;


    const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<neworder newfolder="YES">
  <auth extra="${authExtra}" login="${authLogin}" pass="${authPass}"></auth>
  <order orderno="${parcel.trackingNumber}">
    <respstore>8</respstore>
    <barcode>${parcel.trackingNumber}</barcode>

    <sender>
      <company>Ваша компания (NewPost)</company>
      <person>Ваша компания (NewPost)</person>
      <phone>+79991234000</phone>
      <town>Москва</town>
      <address>МКАД 43км</address>
    </sender>

    <receiver>
      <company>${escapeXml(recipient.fullName)}</company>
      <person>${escapeXml(recipient.fullName)}</person>
      <phone>${recipient.phoneNumber}</phone>
      <town>${escapeXml(recipientCity)}</town>
      <address>${escapeXml(recipientAddress)}</address>
      ${parcel.deliveryType === 'pickup' && parcel.pvzData ? `<pvz>${finalPvzCode}</pvz>` : ''}
    </receiver>

    <price>0</price>
    <inshprice>0</inshprice>
    <weight>${parcel.weight}</weight>
    <quantity>1</quantity>
    <service>14</service>
    <type>3</type>
    <paytype>NO</paytype>
    <return>NO</return>
    <pickup>NO</pickup>
    <acceptpartially>NO</acceptpartially>
  </order>
</neworder>`;

    console.log('Formed XML (first 200 chars):', xmlRequest.substring(0, 200));
    console.log('Полный XML с весом:', xmlRequest);
    try {
        console.log('📤 Sending order to E-Kit:', {
            trackingNumber: parcel.trackingNumber,
            deliveryType: parcel.deliveryType,
            pvzCode: parcel.pvzData?.code,
            recipientCity,
            recipientAddress,
        });

        const response = await axios.post(config.apiUrl, xmlRequest, {
            headers: { 'Content-Type': 'application/xml' },
            timeout: 30000,
        });

        console.log('Raw response status:', response.status);
        console.log('Raw response data:', response.data);

        const result = await xml2js.parseStringPromise(response.data);

        if (!result.neworder?.createorder?.[0]) {
            throw new Error('Invalid response structure from E-Kit');
        }

        const createOrder = result.neworder.createorder[0].$;

        if (createOrder.error === '0') {
            console.log('E-Kit order created successfully:', {
                orderno: createOrder.orderno,
                barcode: createOrder.barcode,
            });

            return {
                success: true,
                ekitOrderNo: createOrder.orderno,
                ekitBarcode: createOrder.barcode,
                ekitOrderPrice: createOrder.orderprice,
            };
        } else {
            const errorMsg = createOrder.errormsgru || createOrder.errormsg || 'Unknown error';
            console.error('E-Kit API error:', {
                code: createOrder.error,
                message: errorMsg,
            });

            throw new Error(`E-Kit API error (${createOrder.error}): ${errorMsg}`);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to create order in E-Kit:', error.message);
        } else {
            console.error('Failed to create order in E-Kit:', String(error));
        }

        if (process.env.NODE_ENV === 'development') {
            console.error('Request XML:', xmlRequest);
        }

        throw error;
    }
}

export async function getOrderStatus(trackingNumber: string) {
    const authExtra = config.extra;
    const authLogin = config.login;
    const authPass = config.pass;

    const xmlRequest = `<?xml version="1.0" encoding="UTF-8" ?>
<statusreq>
  <auth extra="${authExtra}" login="${authLogin}" pass="${authPass}"></auth>
  <orderno>${trackingNumber}</orderno>
</statusreq>`;

    try {
        const response = await axios.post(config.apiUrl, xmlRequest, {
            headers: { 'Content-Type': 'application/xml' },
            timeout: 10000,
        });

        const result = await xml2js.parseStringPromise(response.data);

        if (result.statusreq?.order?.[0]) {
            const order = result.statusreq.order[0];
            return {
                status: order.status?.[0]?._ || 'UNKNOWN',
                statusTitle: order.status?.[0]?.$?.title || '',
                deliveredDate: order.delivereddate?.[0] || null,
                deliveredTime: order.deliveredtime?.[0] || null,
            };
        }
        return null;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to get order status from E-Kit:', error.message);
        } else {
            console.error('Failed to get order status from E-Kit:', String(error));
        }
        return null;
    }
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
                console.log(`📦 ${parcel.trackingNumber}: E-Kit status = "${ekitStatusTitle}"`);

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