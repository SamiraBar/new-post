import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from '@/components/ui/label.tsx';
import useOfficesStore from '@/stores/officesStore/officesStore.ts';
import { type OfficeFormData, officeSchema } from '@/lib/office.schema.ts';
import PhoneInput from '@/features/deliveryCostCalculator/components/phoneInput.tsx';
import { Alert, AlertTitle } from '@/components/ui/alert.tsx';
import { Terminal } from 'lucide-react';

const CreateOffice = () => {
  const [open, setOpen] = useState(false);
  const { createOffice, createOfficeLoading, createOfficeError } = useOfficesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    trigger,
    setValue
  } = useForm<OfficeFormData>({
    resolver: zodResolver(officeSchema),
    defaultValues: {
      name: '',
      address: '',
      mapUrl: '',
      city: '',
      phone: '',
      worktime: ''
    },
  });

  console.log(createOfficeError);

  const onSubmit = async (data: OfficeFormData) => {
    const office = await createOffice(data);
    if (office) {
      reset();
      setOpen(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-brand hover:bg-amber-600">
          Добавить филиал
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Добавить филиал</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
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
            <Label htmlFor="address">Адрес</Label>
            <Input
              id="address"
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
            <Label htmlFor="mapUrl">Ссылка на карту</Label>
            <Input
              id="mapUrl"
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
            <Label htmlFor="city">Город</Label>
            <Input
              id="city"
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
            <Label htmlFor="worktime">График работы</Label>
            <Input
              id="worktime"
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
            <Label htmlFor="phone">Номер телефона</Label>
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
          {
            createOfficeError && (
              <Alert variant="destructive">
                <Terminal />
                <AlertTitle>Филиал в этом городе с таким адресом уже существует</AlertTitle>
              </Alert>
            )
          }

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={createOfficeLoading}
              className="flex-1 bg-brand hover:bg-amber-600"
            >
              {createOfficeLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOffice;