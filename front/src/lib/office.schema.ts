import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const officeSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа').max(30, 'Максимум 30 символов'),
  address: z.string().min(2, 'Минимум 2 символа').max(60, 'Максимум 60 символов'),
  mapUrl: z.string().url('Некорректная ссылка'),
  isActive: z.boolean().optional(),
  city: z.string().min(2, 'Минимум 2 символа').max(30, 'Максимум 30 символов'),
  phone:  z.string().refine(v => isValidPhoneNumber(v, 'KG'), 'Не корректный номер телефона'),
  worktime: z.string().min(2, 'Минимум 2 символа').max(30, 'Максимум 30 символов'),
});

export type OfficeFormData = z.infer<typeof officeSchema>;