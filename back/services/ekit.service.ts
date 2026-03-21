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
    serviceCode: '49' | '50';
    respstore: '8' | '168';
    senderTown: string;
    senderAddress: string;
} {
    let serviceCode: '49' | '50' = '50';
    let respstore: '8' | '168' = '8';
    let senderTown = 'Москва';
    let senderAddress = 'МКАД 43км';

    if (parcel.pvzData?.parentcode === '2495') {
        serviceCode = '49';
        respstore = '168';
        senderTown = 'Екатеринбург';
        senderAddress = '8 Марта 269';
    }

    return { serviceCode, respstore, senderTown, senderAddress };
}

export async function getChangedStatusesOnlyLast(params: {
    limit?: number;
}): Promise<Array<{
    orderno: string;
    ordercode?: string;
    status: string;
    statusTitle: string;
    deliveredDate: string | null;
    deliveredTime: string | null;
}>> {
    const authExtra = config.extra;
    const authLogin = config.login;
    const authPass = config.pass;

    const { limit } = params;

    const xmlRequest = `<?xml version="1.0" encoding="UTF-8" ?>
<statusreq>
  <auth extra="${authExtra}" login="${authLogin}" pass="${authPass}"></auth>
  <changes>ONLY_LAST</changes>
  ${typeof limit === "number" ? `<limit>${limit}</limit>` : ""}
</statusreq>`;

    const response = await axios.post(config.apiUrl, xmlRequest, {
        headers: { "Content-Type": "application/xml" },
        timeout: 30000,
    });

    const result = await xml2js.parseStringPromise(response.data);

    const orders = result?.statusreq?.order ?? [];
    if (!Array.isArray(orders) || orders.length === 0) return [];

    return orders.map((order: any) => {
        const orderno = order?.$?.orderno ? String(order.$.orderno) : "";
        const ordercode = order?.$?.ordercode ? String(order.$.ordercode) : undefined;

        const status = order?.status?.[0]?._ ?? "UNKNOWN";
        const statusTitle = order?.status?.[0]?.$?.title ?? "";

        const deliveredDate = order?.delivereddate?.[0] ?? null;
        const deliveredTime = order?.deliveredtime?.[0] ?? null;

        return {
            orderno,
            ordercode,
            status: String(status),
            statusTitle: String(statusTitle),
            deliveredDate,
            deliveredTime,
        };
    }).filter((x) => x.orderno);
}

export async function commitLastStatus(params: {
    orderCodes?: string[];
}): Promise<void> {
    const authExtra = config.extra;
    const authLogin = config.login;
    const authPass = config.pass;

    const { orderCodes } = params;

    const acsBlock =
      orderCodes && orderCodes.length
        ? `<acs>${orderCodes.map((c) => `<ac>${escapeXml(c)}</ac>`).join("")}</acs>`
        : "";

    const xmlRequest = `<?xml version="1.0" encoding="UTF-8" ?>
<commitlaststatus>
  <auth extra="${authExtra}" login="${authLogin}" pass="${authPass}"></auth>
  ${acsBlock}
</commitlaststatus>`;

    const response = await axios.post(config.apiUrl, xmlRequest, {
        headers: { "Content-Type": "application/xml" },
        timeout: 30000,
    });

    const result = await xml2js.parseStringPromise(response.data);
    const node = result?.commitlaststatus;

    const err = node?.$?.error;
    if (String(err) !== "0") {
        throw new Error(`commitlaststatus failed: ${response.data}`);
    }
}

export async function createOrderInEKit(parcel: IParcel): Promise<EKitOrderResult> {
    console.log('=== НАЧАЛО СОЗДАНИЯ ЗАКАЗА В EKIT ===');
    console.log('Входящий объект parcel:', JSON.stringify(parcel, null, 2));
    console.log('Трек номер:', parcel.trackingNumber);

    const { serviceCode, respstore, senderTown, senderAddress } = resolveDistributionCenter(parcel);
    console.log('Результат resolveDistributionCenter:', { serviceCode, respstore, senderTown, senderAddress });

    const authExtra = config.extra;
    const authLogin = config.login;
    const authPass = config.pass;
    console.log('Авторизационные данные:', {
        authExtra,
        authLogin,
        authPass: authPass ? '***скрыто***' : 'отсутствует'
    });

    const sender = parcel.sender as IContact;
    const recipient = parcel.recipient as IContact;
    console.log('Отправитель (sender):', JSON.stringify(sender, null, 2));
    console.log('Получатель (recipient):', JSON.stringify(recipient, null, 2));

    let recipientAddress = '';
    let recipientCity = '';

    console.log('Тип доставки (deliveryType):', parcel.deliveryType);

    if(parcel.deliveryType === 'courier') {
        recipientCity = recipient.city || parcel.destinationCity;
        console.log('Курьерская доставка - recipientCity:', recipientCity);
        console.log('  - recipient.city:', recipient.city);
        console.log('  - parcel.destinationCity:', parcel.destinationCity);

        const parts = [
            recipient.street,
            recipient.house ? `д. ${recipient.house}` : '',
            recipient.apartment ? `кв. ${recipient.apartment}` : '',
        ].filter(Boolean);
        console.log('Части адреса (parts):', parts);

        recipientAddress = parts.length > 0 ? parts.join(', ') : recipient.address || 'Not selected';
        console.log('Итоговый recipientAddress:', recipientAddress);
    } else {
        console.log('Доставка в ПВЗ - pvzData:', JSON.stringify(parcel.pvzData, null, 2));

        recipientCity = parcel.pvzData?.town || parcel.destinationCity;
        console.log('ПВЗ доставка - recipientCity:', recipientCity);
        console.log('  - parcel.pvzData?.town:', parcel.pvzData?.town);
        console.log('  - parcel.destinationCity:', parcel.destinationCity);

        recipientAddress = parcel.pvzData?.address || recipient.address || 'Not selected';
        console.log('ПВЗ доставка - recipientAddress:', recipientAddress);
        console.log('  - parcel.pvzData?.address:', parcel.pvzData?.address);
        console.log('  - recipient.address:', recipient.address);
    }

    console.log('ВЕС:');
    console.log('  - parcel.weight (исходное значение):', parcel.weight);
    console.log('  - typeof parcel.weight:', typeof parcel.weight);
    const formattedWeight = Number(parcel.weight).toFixed(1);
    console.log('  - formattedWeight (после форматирования):', formattedWeight);
    console.log('  - Number(parcel.weight):', Number(parcel.weight));

    console.log('СТРАХОВКА (inshprice):');
    console.log('  - parcel.inshprice (исходное):', parcel.inshprice);
    console.log('  - typeof parcel.inshprice:', typeof parcel.inshprice);
    console.log('  - Number(parcel.inshprice).toFixed(2):', Number(parcel.inshprice).toFixed(2));

    console.log('ТРЕКИНГ НОМЕР:');
    console.log('  - parcel.trackingNumber:', parcel.trackingNumber);

    let packagesSection = '';
    if (formattedWeight && Number(formattedWeight) > 0) {
        const packageAttrs = [
            `strbarcode="${parcel.trackingNumber}"`,
            `mass="${formattedWeight}"`,
            `quantity="1"`
        ];

        packagesSection = `
    <packages>
      <package ${packageAttrs.join(' ')}></package>
    </packages>`;

        console.log('PACKAGES СЕКЦИЯ:');
        console.log(packagesSection);
    } else {
        console.warn('ВНИМАНИЕ: Вес равен 0 или отсутствует! Секция packages не будет создана!');
    }

    const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<neworder newfolder="YES">
  <auth extra="${authExtra}" login="${authLogin}" pass="${authPass}"></auth>
  <order orderno="${parcel.trackingNumber}">
    <respstore>${respstore}</respstore>
    <barcode>${parcel.trackingNumber}</barcode>

    <sender>
      <company>ОСОО "Новая Почта"</company>
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
    
    <inshprice>${Number(parcel.inshprice).toFixed(2)}</inshprice>
    <weight>${formattedWeight}</weight>
    <quantity>1</quantity>
    <service>${serviceCode}</service>
    <type>3</type>
    <paytype>NO</paytype>
    <return>NO</return>
    <pickup>NO</pickup>
    <acceptpartially>NO</acceptpartially>${packagesSection}
  </order>
</neworder>`;

    console.log('=== ПОЛНЫЙ XML ЗАПРОС ===');
    console.log(xmlRequest);
    console.log('=== КОНЕЦ XML ЗАПРОСА ===');

    try {
        console.log('Отправка запроса на URL:', config.apiUrl);
        console.log('Таймаут:', 50000);

        const response = await axios.post(config.apiUrl, xmlRequest, {
            headers: { 'Content-Type': 'application/xml' },
            responseType: 'text',
            timeout: 50000,
        });

        console.log('Ответ получен. Status:', response.status);
        console.log('Ответ получен. Status:', response.status);
        console.log('Response data type:', typeof response.data);
        console.log('Response data (first 500 chars):', String(response.data).substring(0, 500));

        const result = await xml2js.parseStringPromise(response.data);
        console.log('Распарсенный результат:', JSON.stringify(result, null, 2));

        if (!result.neworder?.createorder?.[0]) {
            console.error('ОШИБКА: Неверная структура ответа');
            throw new Error('Неверная структура ответа от E-Kit');
        }

        const createOrder = result.neworder.createorder[0].$;
        console.log('createOrder объект:', createOrder);

        if (createOrder.error === '0') {
            console.log('=== УСПЕШНОЕ СОЗДАНИЕ ЗАКАЗА ===');
            const successResult = {
                success: true,
                ekitOrderNo: createOrder.orderno,
                ekitBarcode: createOrder.barcode,
                ekitOrderPrice: createOrder.orderprice,
            };
            console.log('Результат:', successResult);
            return successResult;
        } else {
            const errorMsg = createOrder.errormsgru || createOrder.errormsg || 'Неизвестная ошибка';
            console.error('=== ОШИБКА API E-KIT ===');
            console.error('Код ошибки:', createOrder.error);
            console.error('Сообщение:', errorMsg);
            console.error('Полный createOrder:', createOrder);
            throw new Error(`Ошибка API E-Kit (${createOrder.error}): ${errorMsg}`);
        }
    } catch (error) {
        console.error('=== ИСКЛЮЧЕНИЕ ПРИ СОЗДАНИИ ЗАКАЗА ===');
        console.error('Тип ошибки:', error instanceof Error ? 'Error' : typeof error);
        console.error('Сообщение:', error instanceof Error ? error.message : String(error));
        console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');

        if (axios.isAxiosError(error)) {
            console.error('Axios error details:');
            console.error('  - response status:', error.response?.status);
            console.error('  - response data:', error.response?.data);
            console.error('  - request config:', error.config);
        }

        console.error('XML который был отправлен:', xmlRequest);
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