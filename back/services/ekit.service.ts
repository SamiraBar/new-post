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

function resolveDistributionCenter(parcel: IParcel): {
    serviceCode: '14' | '15';
    senderTown: string;
    senderAddress: string;
} {
    let serviceCode: '14' | '15' = '14';
    let senderTown = 'Москва';
    let senderAddress = 'МКАД 43км';

    if (parcel.pvzData?.parentcode === '2495') {
        serviceCode = '15';
        senderTown = 'Екатеринбург';
        senderAddress = '8 Марта 269';
    }

    return { serviceCode, senderTown, senderAddress };
}


export async function createOrderInEKit(parcel: IParcel): Promise<EKitOrderResult> {

    const { serviceCode, senderTown, senderAddress } = resolveDistributionCenter(parcel);

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

    const formattedWeight = Number(parcel.weight).toFixed(1);

    const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<neworder newfolder="YES">
  <auth extra="${authExtra}" login="${authLogin}" pass="${authPass}"></auth>
  <order orderno="${parcel.trackingNumber}">
    <respstore>8</respstore>
    <barcode>${parcel.trackingNumber}</barcode>

    <sender>
      <company>ОСОО “Новая Почта”</company>
      <person>${sender.fullName}</person>
      <phone>${sender.phoneNumber}</phone>
      <town>${senderTown}</town>
      <address>${senderAddress}</address>
    </sender>

    <receiver>
      <company>${escapeXml(recipient.fullName)}</company>
      <person>${escapeXml(recipient.fullName)}</person>
      <phone>${recipient.phoneNumber}</phone>
      <town>${escapeXml(recipientCity)}</town>
      <address>${escapeXml(recipientAddress)}</address>
      ${parcel.deliveryType === 'pickup' && parcel.pvzData ? `<pvz>${parcel.pvzData.code}</pvz>` : ''}
    </receiver>

    <price>${Number(parcel.price).toFixed(2)}</price>
    <inshprice>${Number(parcel.inshprice).toFixed(2)}</inshprice>
    <weight>${formattedWeight}</weight>
    <quantity>1</quantity>
    <service>${serviceCode}</service> 
    <type>3</type>
    <paytype>NO</paytype>
    <return>NO</return>
    <pickup>NO</pickup>
    <acceptpartially>NO</acceptpartially>
  </order>
</neworder>`;

    try {
        const response = await axios.post(config.apiUrl, xmlRequest, {
            headers: { 'Content-Type': 'application/xml' },
            timeout: 50000,
        });

        const result = await xml2js.parseStringPromise(response.data);

        if (!result.neworder?.createorder?.[0]) {
            throw new Error('Неверная структура ответа от E-Kit');
        }

        const createOrder = result.neworder.createorder[0].$;

        if (createOrder.error === '0') {
            return {
                success: true,
                ekitOrderNo: createOrder.orderno,
                ekitBarcode: createOrder.barcode,
                ekitOrderPrice: createOrder.orderprice,
            };
        } else {
            const errorMsg = createOrder.errormsgru || createOrder.errormsg || 'Неизвестная ошибка';
            console.error('Ошибка API E-Kit:', { code: createOrder.error, message: errorMsg });
            throw new Error(`Ошибка API E-Kit (${createOrder.error}): ${errorMsg}`);
        }
    } catch (error) {
        console.error('Не удалось создать заказ в E-Kit:', error instanceof Error ? error.message : String(error));
        if (process.env.NODE_ENV === 'development') {
            console.error('Отправленный XML:', xmlRequest);
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

function normalizeBase64(input: string): string {
    return input.replace(/\s+/g, '');
}

function safeFirst<T>(v: T | T[] | undefined | null): T | undefined {
    if (!v) return undefined;
    return Array.isArray(v) ? v[0] : v;
}

export async function getWaybillPdfBuffer(params: {
    trackingNumber: string;
    ordercode?: string;
    form?: number;
}): Promise<{
    pdfBuffer: Buffer;
    orderCode?: string;
}> {
    const authExtra = config.extra;
    const authLogin = config.login;
    const authPass = config.pass;

    const { trackingNumber, ordercode, form = 2 } = params;

    const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<waybill>
  <auth extra="${authExtra}" login="${authLogin}" pass="${authPass}" />
  <client>CLIENT</client>
  <orders>
    <order orderno="${escapeXml(trackingNumber)}"${ordercode ? ` ordercode="${escapeXml(ordercode)}"` : ''} />
  </orders>
  <form>${form}</form>
</waybill>`;

    try {
        const response = await axios.post(config.apiUrl, xmlRequest, {
            headers: { 'Content-Type': 'application/xml' },
            timeout: 50000,
        });

        const result = await xml2js.parseStringPromise(response.data);

        if (!result?.waybill) {
            throw new Error('Неверная структура ответа от E-Kit: нет waybill');
        }

        if (result.waybill.error?.[0]) {
            const msg = result.waybill.error[0];
            throw new Error(`Ошибка E-Kit: ${msg}`);
        }

        const integration = safeFirst(result.waybill.integration);
        const order = integration?.order ? safeFirst(integration.order) : undefined;

        const orderCode = order?.$?.code;

        const contentRaw =
          (order?.content ? safeFirst(order.content) : undefined) ??
          (result.waybill.content ? safeFirst(result.waybill.content) : undefined);

        if (!contentRaw || typeof contentRaw !== 'string') {
            throw new Error('Не найден <content> с base64 в ответе E-Kit');
        }

        const b64 = normalizeBase64(contentRaw);
        const pdfBuffer = Buffer.from(b64, 'base64');

        return { pdfBuffer, orderCode };
    } catch (error) {
        console.error('Не удалось получить waybill PDF из E-Kit:', error instanceof Error ? error.message : String(error));
        if (process.env.NODE_ENV === 'development') {
            console.error('Отправленный XML (waybill):', xmlRequest);
        }
        throw error;
    }
}