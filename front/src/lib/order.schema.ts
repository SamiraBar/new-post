import { z } from 'zod';
import type { TFunction } from 'i18next';
import { isValidPhoneNumber } from 'libphonenumber-js';
import type { PvzData } from '@/types';

const detectDestinationCountry = (
  destinationCity: string,
  pvzData?: PvzData,
  partnerType?: string
): 'RU' | 'KZ' | 'UNKNOWN' => {

  if (partnerType === 'E-Kit' && pvzData?.parentcode) {
    return 'RU';
  }

  if (partnerType === 'KCE' && destinationCity) {
    const cityLower = destinationCity.toLowerCase().trim();
    const kazakhCities = [
      'алматы', 'астана', 'нур-султан', 'шымкент', 'караганда',
      'актобе', 'тараз', 'павлодар', 'усть-каменогорск', 'семей',
      'атырау', 'костанай', 'кызылорда', 'уральск', 'петропавловск'
    ];

    if (kazakhCities.includes(cityLower)) {
      return 'KZ';
    }

    return 'RU';
  }

  return 'UNKNOWN';
};

export const orderSchema = (t: TFunction) =>
  z.object({
    originCity: z.string().min(1, 'deliveryCostCalculator.validateError.cityOfSender'),
    destinationCity: z.string().min(1, 'deliveryCostCalculator.validateError.cityOfReceiver'),
    originOffice: z.number().min(1, t('deliveryCostCalculator.validateError.chooseOffice')),
    destinationOffice: z
      .number()
      .min(1, t('deliveryCostCalculator.validateError.selectReceivingOffice')),
    parcelValue: z
      .string()
      .refine(
        (v) => v === '' || (!isNaN(Number(v)) && Number(v) >= 0),
        t('deliveryCostCalculator.validateError.value'),
      )
      .refine(
        (v) => v === '' || Number(v) <= 50000,
        t('deliveryCostCalculator.validateError.maxValue'),
      ),
    parcelWeight: z.string().min(1, t('deliveryCostCalculator.validateError.parcelWeight')),
    deliveryCost: z.number().min(0),
    insuranceCost: z.number().min(0),
    totalCost: z.number().min(0),
    deliveryDate: z.string().min(1, 'Дата доставки обязательна'),
    inParcel: z
      .string()
      .min(3, t('deliveryCostCalculator.validateError.inParcel'))
      .max(70, t('deliveryCostCalculator.stepForForm.errors.inParcelMaxError')),
    serviceCode: z.enum(['14', '15']).optional(),
    serviceCity: z.enum(['МСК', 'ЕКБ']).optional(),
    sender: z.object({
      name: z
        .string()
        .trim()
        .regex(
          /^(\S{3,})\s+(\S{3,})$/,
          t('deliveryCostCalculator.stepForForm.errors.senderNameError'),
        ),
      email: z.string().email(t('deliveryCostCalculator.stepForForm.errors.emailError')),
      phone: z
        .string()
        .refine(
          (v) => isValidPhoneNumber(v, 'KG'),
          t('deliveryCostCalculator.stepForForm.errors.phoneError'),
        ),
      inn_passport: z
        .string()
        .trim()
        .regex(
          /^[A-Za-z0-9]{1,14}$/,
          t('deliveryCostCalculator.validateError.validateSenderInnPassport'),
        ),
    }),
    receiver: z.object({
      name: z
        .string()
        .trim()
        .regex(
          /^(\S{3,})\s+(\S{3,})\s+(\S{3,})$/,
          t('deliveryCostCalculator.stepForForm.errors.receiverNameError'),
        ),
      email: z.string().email(t('deliveryCostCalculator.stepForForm.errors.emailError')),
      phone: z.string().refine((v) => {
        if (v.startsWith('+7')) {
          return isValidPhoneNumber(v, 'RU') || isValidPhoneNumber(v, 'KZ');
        } else if (v.startsWith('+375')) {
          return isValidPhoneNumber(v, 'BY');
        }
        return isValidPhoneNumber(v);
      }, t('deliveryCostCalculator.stepForForm.errors.phoneError')),
      address: z
        .string()
        .min(5, t('deliveryCostCalculator.validateError.validateReceiverAddress'))
        .optional(),
      city: z.string().min(3, t('deliveryCostCalculator.validateError.indicateCity')).optional(),
      street: z
        .string()
        .min(3, t('deliveryCostCalculator.validateError.indicateStreet'))
        .optional(),
      house: z.string().min(1, t('deliveryCostCalculator.validateError.indicateHouse')).optional(),
      apartment: z.string().optional(),
    }),
    deliveryType: z.enum(['courier', 'pickup']),
    partnerType: z.enum(['E-Kit', 'KCE']),
    pvzData: z
      .object({
        code: z.string(),
        name: z.string(),
        address: z.string(),
        phone: z.string().optional(),
        worktime: z.string().optional(),
        maxweight: z.string().optional(),
        parentcode: z.string().optional(),
        parentname: z.string().optional(),
        town: z.string().optional(),
        towncode: z.string().optional(),
        region: z.string().optional(),
        acceptcash: z.number().optional(),
        acceptcard: z.number().optional(),
      })
      .optional(),
    parcelDescription: z
      .string()
      .min(3, t('deliveryCostCalculator.validateError.inParcel'))
      .max(70, t('deliveryCostCalculator.stepForForm.errors.inParcelMaxError'))
      .optional(),
  })
    .refine(
      (data) => {
        const { destinationCity, receiver, pvzData, partnerType } = data;
        const phone = receiver.phone;

        if (!phone) return false;

        const country = detectDestinationCountry(destinationCity, pvzData, partnerType);

        console.log('Валидация телефона получателя:');
        console.log('  - Телефон:', phone);
        console.log('  - Город назначения:', destinationCity);
        console.log('  - Тип партнёра:', partnerType);
        console.log('  - Определённая страна:', country);

        if (country === 'UNKNOWN') {
          const isValid = isValidPhoneNumber(phone, 'RU') ||
            isValidPhoneNumber(phone, 'KZ') ||
            isValidPhoneNumber(phone, 'BY');
          console.log('  - Страна не определена, базовая валидация:', isValid);
          return isValid;
        }

        if (country === 'RU') {
          const isValid = isValidPhoneNumber(phone, 'RU');
          console.log('  - Россия, проверка RU номера:', isValid);
          return isValid;
        }

        if (country === 'KZ') {
          const isValid = isValidPhoneNumber(phone, 'KZ');
          console.log('  - Казахстан, проверка KZ номера:', isValid);
          return isValid;
        }

        return false;
      },
      {
        message: t('deliveryCostCalculator.validateError.phoneCountryMismatch'),
        path: ['receiver', 'phone'],
      }
    );

export type OrderSchema = ReturnType<typeof orderSchema>;
export type OrderFormData = z.infer<OrderSchema>;
