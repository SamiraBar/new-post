import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import useOfficesStore from '@/stores/officesStore/officesStore.ts';
import { type OfficeFormData, officeSchema } from '@/lib/office.schema.ts';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import PhoneInput from '@/features/deliveryCostCalculator/components/phoneInput.tsx';

interface EditOfficeDialogProps {
  officeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditOfficeDialog = ({ officeId, open, onOpenChange }: EditOfficeDialogProps) => {
  const {
    office,
    getOfficeById,
    updateOffice,
    updateOfficeLoading,
    getOfficeLoading
  } = useOfficesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
    trigger
  } = useForm<OfficeFormData>({
    resolver: zodResolver(officeSchema),
    defaultValues: {
      name: '',
      address: '',
      mapUrl: '',
      city: '',
      phone: '',
      worktime: '',
      isActive: false,
    },
  });

  useEffect(() => {
    if (open && officeId) {
      getOfficeById(officeId);
    }
  }, [open, officeId, getOfficeById]);

  useEffect(() => {
    if (office && office._id === officeId) {
      reset({
        name: office.name,
        address: office.address,
        mapUrl: office.mapUrl,
        city: office.city,
        phone: office.phone,
        worktime: office.worktime,
        isActive: office.isActive
      });
    }
  }, [office, officeId, reset]);

  const onSubmit = async (data: OfficeFormData) => {
    const success = await updateOffice(officeId, data);
    if (success) {
      onOpenChange(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Редактировать филиал</DialogTitle>
        </DialogHeader>

        {getOfficeLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Название</Label>
              <Input
                id="edit-name"
                type="text"
                placeholder="Название офиса"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Адрес</Label>
              <Input
                id="edit-address"
                type="text"
                placeholder="Адрес офиса"
                {...register('address')}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-mapUrl">Ссылка на карту</Label>
              <Input
                id="edit-mapUrl"
                type="url"
                placeholder="https://maps.google.com/..."
                {...register('mapUrl')}
                className={errors.mapUrl ? 'border-red-500' : ''}
              />
              {errors.mapUrl && (
                <p className="text-sm text-red-500">{errors.mapUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-city">Город</Label>
              <Input
                id="edit-city"
                type="text"
                placeholder="Город"
                {...register('city')}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-worktime">График работы</Label>
              <Input
                id="edit-worktime"
                type="text"
                placeholder="Пн-Пт: 8:00 - 18:00"
                {...register('worktime')}
                className={errors.worktime ? 'border-red-500' : ''}
              />
              {errors.worktime && (
                <p className="text-sm text-red-500">{errors.worktime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Номер телефона</Label>
              <PhoneInput
                value={getValues('phone') ?? ''}
                onChange={async (phone) => {
                  setValue('phone', phone);
                  await trigger('phone');
                }}
                error={errors.phone?.message}
                defaultCountry="KG"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-isActive"
                checked={watch('isActive')}
                onCheckedChange={(checked) => setValue('isActive', !!checked)}
              />
              <Label
                htmlFor="edit-isActive"
                className={`text-sm font-medium leading-none cursor-pointer transition-colors ${
                  watch('isActive')
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                {watch('isActive') ? 'Активен' : 'Не активен'}
              </Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="flex-1"
                disabled={updateOfficeLoading}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={updateOfficeLoading}
                className="flex-1 bg-brand hover:bg-amber-600"
              >
                {updateOfficeLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  'Сохранить'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditOfficeDialog;