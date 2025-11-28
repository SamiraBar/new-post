import type { Order } from '@/types';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
    if (!phone) return false;
    try {
        return isValidPhoneNumber(phone);
    } catch {
        return false;
    }
};

export const validateStep1 = (order: Order): string | null => {
    if (!order.originCity) return 'Выберите город отправителя';
    if (!order.destinationCity) return 'Выберите город получателя';
    if (!order.parcelValue || order.parcelValue <= 0) return 'Укажите ценность посылки';
    if (!order.parcelWeight || order.parcelWeight <= 0) return 'Укажите вес посылки';
    if (order.parcelWeight > 15) return 'Максимальный вес 15 кг';
    if (order.parcelValue > 50000) return 'Максимальная ценность 50000 сом';
    return null;
};

export const validateStep2 = (order: Order): string | null => {
    if (!order.originOffice) return 'Выберите офис отправки';
    return null;
};

export const validateStep3 = (order: Order, isDoorDelivery: boolean): string | null => {
    if (isDoorDelivery) {
        const city = order.receiver.city || order.destinationCity;
        if (!city) return 'Укажите город';
        if (!order.receiver.street) return 'Укажите улицу';
        if (!order.receiver.house) return 'Укажите дом';
    } else {
        if (!order.destinationOffice) return 'Выберите офис получения';
    }
    return null;
};

export const validateStep4 = (order: Order, isDoorDelivery: boolean): string | null => {
    if (!order.sender.name || order.sender.name.trim().length < 2) {
        return 'Имя отправителя должно быть минимум 2 символа';
    }
    if (!validateEmail(order.sender.email)) {
        return 'Некорректный email отправителя';
    }
    if (!validatePhone(order.sender.phone)) {
        return 'Некорректный номер телефона отправителя';
    }

    if (!order.receiver.name || order.receiver.name.trim().length < 2) {
        return 'Имя получателя должно быть минимум 2 символа';
    }
    if (!validateEmail(order.receiver.email)) {
        return 'Некорректный email получателя';
    }
    if (!validatePhone(order.receiver.phone)) {
        return 'Некорректный номер телефона получателя';
    }

    if (!order.inParcel || order.inParcel.trim().length < 3) {
        return 'Опишите содержимое посылки (минимум 3 символа)';
    }

    if (isDoorDelivery && (!order.receiver.address || order.receiver.address.trim().length < 5)) {
        return 'Укажите полный адрес получателя (минимум 5 символов)';
    }

    return null;
};