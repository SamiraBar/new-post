import {IParcel} from "../models/Parcel";
import {IContact} from "../models/Contact";

interface EKitConfig {
    extra: string;
    login: string;
    pass: string;
    apiUrl: string;
}

const config: EKitConfig = {
    extra: `${process.env.EKIT_EXTRA}`,
    login: process.env.EKIT_LOGIN || '',
    pass: process.env.EKIT_PASS || '',
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

export async function createOrderInEKit(parcel: IParcel) {
    const sender = parcel.sender as IContact;
    const recipient = parcel.recipient as IContact;

    let recipientAddress = '';
    let recipientCity = '';
}