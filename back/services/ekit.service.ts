import {IParcel} from "../models/Parcel";
import {IContact} from "../models/Contact";
import axios from 'axios';
import xml2js from 'xml2js';
import {EKitOrderResult} from "../types";

interface EKitConfig {
    extra: string;
    login: string;
    pass: string;
    apiUrl: string;
}

interface SenderInfo {
    town: string;
    address: string;
    phone?: string;
    service?: string;
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

export function getSenderInfo(parcel: IParcel): SenderInfo {
    const origin = parcel.originCity?.toLowerCase() || '';
    const distributionCenter = parcel.distributionCenter?.toLowerCase() || '';

    console.log('Определение РЦ:', {
        originCity: parcel.originCity,
        distributionCenter: parcel.distributionCenter,
        origin
    });

    if (distributionCenter.includes('екб') ||
        distributionCenter.includes('екатеринбург') ||
        origin.includes('екатеринбург') ||
        origin.includes('екб')) {
        console.log('Выбран РЦ: Екатеринбург');
        return {
            town: 'Екатеринбург',
            address: '8 Марта 269',
            phone: '+79991234000',
            service: '14'
        };
    }

    console.log('Выбран РЦ: Москва (по умолчанию)');
    return {
        town: 'Москва',
        address: 'МКАД 43км',
        phone: '+79991234000',
        service: '14'
    };
}

export async function createOrderInEKit(parcel: IParcel): Promise<EKitOrderResult> {
    console.log('🔍 Начало создания заказа в E-Kit:', {
        trackingNumber: parcel.trackingNumber,
        originCity: parcel.originCity,
        distributionCenter: parcel.distributionCenter,
        deliveryType: parcel.deliveryType,
        weight: parcel.weight
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


    const senderInfo = getSenderInfo(parcel);

    console.log('📄 Данные отправителя для E-Kit:', senderInfo);
    console.log('📦 Код ПВЗ:', parcel.pvzData?.code);
    console.log('🏙️ Город получателя:', recipientCity);
    console.log('📍 Адрес получателя:', recipientAddress);

    const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<neworder newfolder="YES">
  <auth extra="${authExtra}" login="${authLogin}" pass="${authPass}"></auth>
  <order orderno="${parcel.trackingNumber}">
    <respstore>8</respstore>
    <barcode>${parcel.trackingNumber}</barcode>

    <sender>
      <company>Ваша компания (NewPost)</company>
      <person>Ваша компания (NewPost)</person>
      <phone>${senderInfo.phone}</phone>
      <town>Екатеринбург</town>
      <address>8 Марта 269</address>
    </sender>

    <receiver>
      <company>${escapeXml(recipient.fullName)}</company>
      <person>${escapeXml(recipient.fullName)}</person>
      <phone>${recipient.phoneNumber}</phone>
      <town>${escapeXml(recipientCity)}</town>
      <address>${escapeXml(recipientAddress)}</address>
      ${parcel.deliveryType === 'pickup' && parcel.pvzData ? `<pvz>${parcel.pvzData.code}</pvz>` : ''}
    </receiver>

    <price>0</price>
    <inshprice>0</inshprice>
    <weight>${parcel.weight}</weight>
    <quantity>1</quantity>
    <service>${senderInfo.service || '14'}</service>
    <type>3</type>
    <paytype>NO</paytype>
    <return>NO</return>
    <pickup>NO</pickup>
    <acceptpartially>NO</acceptpartially>
  </order>
</neworder>`;

    console.log('📤 Отправляемый XML (первые 500 символов):', xmlRequest.substring(0, 500));

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