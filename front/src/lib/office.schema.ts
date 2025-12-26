import { z } from 'zod';

export const officeSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа').max(255, 'Максимум 255 символов'),
  address: z.string().min(2, 'Минимум 2 символа').max(255, 'Максимум 255 символов'),
  mapUrl: z.string().url('Некорректная ссылка'),
  isActive: z.boolean().optional(),
});

export type OfficeFormData = z.infer<typeof officeSchema>;