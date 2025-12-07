import { z } from 'zod';

const phoneRegex = /^\+?[0-9]{10,15}$/;


export const orderSchema = z.object({
  originCity: z.string().min(2, 'Город отправления обязателен'),
  destinationCity: z.string().min(2, 'Город получения обязателен'),
  parcelValue: z.coerce.number().positive('deliveryCostCalculator.validateError.parcelValue').max(50000, 'deliveryCostCalculator.validateError.maxValue').default(0),
  parcelWeight: z.coerce.number().positive('deliveryCostCalculator.validateError.parcelWeight').max(15, 'deliveryCostCalculator.validateError.maxWeight').default(0),
  inParcel: z.string().optional(),

  deliveryType: z.enum(['pickup', 'courier']),
  originOffice: z.number().default(0),
  destinationOffice: z.number().default(0),

  sender: z.object({
    name: z.string().min(2, 'Имя отправителя обязательно'),
    email: z.string().email('Некорректный email'),
    phone: z.string().regex(phoneRegex, 'Некорректный номер'),
    inn_passport: z.string().min(6, 'ИНН/Паспорт обязателен'),
    city: z.string().optional(),
    street: z.string().optional(),
    house: z.string().optional(),
    apartment: z.string().optional(),
  }),
  receiver: z.object({
    name: z.string().min(2, 'Имя получателя обязательно'),
    email: z.string().email('Некорректный email'),
    phone: z.string().regex(phoneRegex, 'Некорректный номер'),
    address: z.string().optional(),
    city: z.string().optional(),
    street: z.string().optional(),
    house: z.string().optional(),
    apartment: z.string().optional(),
  }),

  deliveryCost: z.number().default(0),
  insuranceCost: z.number().default(0),
  totalCost: z.number().default(0),
  deliveryDate: z.string().optional(),
  partnerType: z.enum(['E-Kit', 'KCE']),
  pvzData: z.object({}).optional(),
}).refine(
  (data) => {
    if (data.deliveryType === 'pickup') {
      return !!data.originOffice && !!data.destinationOffice;
    }
    return !!data.sender.city && !!data.receiver.city;
  },
  {
    message: 'Заполните все необходимые поля',
    path: ['deliveryType'],
  }
);

export type OrderFormData = z.infer<typeof orderSchema>;