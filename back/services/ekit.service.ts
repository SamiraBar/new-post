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
    extra: `${process.env.EKIT_EXTRA}`,
    login: `${process.env.EKIT_LOGIN}`,
    pass: `${process.env.EKIT_PASS}`,
    apiUrl: `${process.env.EKIT_API_URL}`,
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

export async function createOrderInEKit(parcel: IParcel): Promise<EKitOrderResult> {
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
    const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<neworder newfolder="YES">
  <auth extra="${config.extra}" login="${config.login}" pass="${config.pass}"></auth>
  <order orderno="${parcel.trackingNumber}">
    <barcode>${parcel.trackingNumber}</barcode>
    
    <sender>
      <company>${escapeXml(sender.fullName)}</company>
      <person>${escapeXml(sender.fullName)}</person>
      <phone>${sender.phoneNumber}</phone>
      <town>${escapeXml(parcel.originCity)}</town>
      <address>${escapeXml(sender.address || 'Не указан')}</address>
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
    <service>1</service>
    <type>3</type>
    <paytype>NO</paytype>
    <return>NO</return>
    <pickup>NO</pickup>
    <acceptpartially>NO</acceptpartially>
  </order>
</neworder>`;

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

        console.log('🔍 Raw response status:', response.status);
        console.log('🔍 Raw response data:', response.data);

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
    const xmlRequest = `<?xml version="1.0" encoding="UTF-8" ?>
<statusreq>
  <auth extra="${config.extra}" login="${config.login}" pass="${config.pass}"></auth>
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