import { v4 as uuidv4 } from 'uuid';

export const generateTrackingNumber = (): string => {
    const uuid = uuidv4().replace(/-/g, '').toUpperCase().substring(0, 10);
    const randomDigits = Math.floor(100 + Math.random() * 900);
    return `KGZ-${randomDigits}-${uuid}`;
};
