import type { Order } from '@/types';
import { isValidPhoneNumber } from 'libphonenumber-js';
import type { TFunction } from 'i18next';

const PVZ_SENDER_CITY = 'Bishkek';

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

export const validateInnPassport = (inn_passport: string): boolean => {
  const innPassportRegex = /^[A-Za-z0-9]{1,14}$/;
  return innPassportRegex.test(inn_passport);
};

export const validateStep1 = (order: Order, t: TFunction): string | null => {
  if (!order.originCity) return t('deliveryCostCalculator.validateError.cityOfSender');
  if (order.deliveryType === 'pickup' && order.originCity !== PVZ_SENDER_CITY) {
    return t('deliveryCostCalculator.validateError.pvzOriginMustBeBishkek');
  }
  if (!order.destinationCity) return t('deliveryCostCalculator.validateError.cityOfReceiver');
  if (!order.parcelValue || order.parcelValue <= 0)
    return t('deliveryCostCalculator.validateError.value');
  if (!order.parcelWeight || order.parcelWeight <= 0)
    return t('deliveryCostCalculator.validateError.weight');
  if (order.parcelWeight > 15) return t('deliveryCostCalculator.validateError.maxWeight');
  if (order.parcelValue > 50000) return t('deliveryCostCalculator.validateError.maxValue');
  return null;
};

export const validateStep2 = (order: Order, t: TFunction): string | null => {
  if (!order.originOffice) return t('deliveryCostCalculator.validateError.chooseOffice');
  return null;
};

export const validateStep3 = (
  order: Order,
  isDoorDelivery: boolean,
  t: TFunction,
): string | null => {
  if (isDoorDelivery) {
    const city = order.receiver.city || order.destinationCity;
    if (!city) return t('deliveryCostCalculator.validateError.indicateCity');
    if (!order.receiver.street) return t('deliveryCostCalculator.validateError.indicateStreet');
    if (!order.receiver.house) return t('deliveryCostCalculator.validateError.indicateHouse');
  } else {
    if (!order.destinationOffice)
      return t('deliveryCostCalculator.validateError.selectReceivingOffice');
  }
  return null;
};

export const validateStep4 = (
  order: Order,
  isDoorDelivery: boolean,
  t: TFunction,
): string | null => {
  if (!order.sender.name || order.sender.name.trim().length < 2) {
    return t('deliveryCostCalculator.validateError.senderNameRestrictions');
  }
  if (!validateEmail(order.sender.email)) {
    return t('deliveryCostCalculator.validateError.validateSenderEmail');
  }
  if (!validatePhone(order.sender.phone)) {
    return t('deliveryCostCalculator.validateError.validateSenderPhone');
  }
  if (!validateInnPassport(order.sender.inn_passport)) {
    return t('deliveryCostCalculator.validateError.validateSenderInnPassport');
  }

  if (!order.receiver.name || order.receiver.name.trim().length < 2) {
    return t('deliveryCostCalculator.validateError.receiverNameRestrictions');
  }
  if (!validateEmail(order.receiver.email)) {
    return t('deliveryCostCalculator.validateError.validateReceiverEmail');
  }
  if (!validatePhone(order.receiver.phone)) {
    return t('deliveryCostCalculator.validateError.validateReceiverPhone');
  }

  if (!order.inParcel || order.inParcel.trim().length < 3) {
    return t('deliveryCostCalculator.validateError.inParcel');
  }

  if (isDoorDelivery && (!order.receiver.address || order.receiver.address.trim().length < 5)) {
    return t('deliveryCostCalculator.validateError.validateReceiverAddress');
  }

  return null;
};
