import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from '@/components/ui/label.tsx';
import useOfficesStore from '@/stores/officesStore/officesStore.ts';
import { type OfficeFormData, officeSchema } from '@/lib/office.schema.ts';

const CreateOffice = () => {
  const [open, setOpen] = useState(false);
  const { createOffice, createOfficeLoading } = useOfficesStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OfficeFormData>({
    resolver: zodResolver(officeSchema),
    defaultValues: {
      name: '',
      address: '',
      mapUrl: '',
    },
  });

  const onSubmit = async (data: OfficeFormData) => {
    const office = await createOffice(data);
    if (office) {
      reset();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand hover:bg-amber-600">
          Добавить офис
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Добавить офис</DialogTitle>
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

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
              }}
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