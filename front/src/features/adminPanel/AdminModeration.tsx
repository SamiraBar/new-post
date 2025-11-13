import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useAdminStore from '@/stores/adminStore/adminStore.ts';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, ChevronLeft } from 'lucide-react';
import type { AdminMutation } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog.tsx';
import { Alert, AlertDescription } from '@/components/ui/alert.tsx';

const AdminModeration = () => {
  const admin = useAdminStore((s) => s.admin);
  const { allAdmins, getAllAdmins, deleteAdmin, createAdmin } = useAdminStore();
  const createAdminError = useAdminStore((s) => s.createAdminError);
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!admin || admin.role !== 'superAdmin') {
      navigate('/admin');
    }

    void getAllAdmins();
  }, [navigate, admin, getAllAdmins]);

  const [newAdmin, setNewAdmin] = useState<AdminMutation>({
    displayName: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id: string) => {
    await deleteAdmin(id);
    await getAllAdmins();
  };

  const submitFormHandler = async (e: FormEvent) => {
    e.preventDefault();

    const success = await createAdmin(newAdmin);

    if (success) {
      await getAllAdmins();
      setNewAdmin({ displayName: '', email: '', password: '' });
      setOpenModal(false);
    }
  };

  return (
    <div className="container">
      <div
        className="
          grid
          grid-cols-[auto_1fr]
          sm:grid-cols-[auto_auto]
          grid-rows-[auto_auto]
          md:grid-cols-[auto_1fr_auto]
          md:grid-rows-1
          gap-3 py-8"
      >
        <Link to="/admin">
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronLeft />
          </Button>
        </Link>

        <h1
          className="
            text-2xl font-bold
            text-center
            col-span-2
            order-3
            md:order-none
            md:col-span-1
            md:justify-self-center
          "
        >
          Управление администраторами
        </h1>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button className="bg-brand hover:bg-amber-600 transition duration-300  md:row-end">
              Добавить администратора
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Новый администратор</DialogTitle>
            </DialogHeader>
            <form onSubmit={submitFormHandler} className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="displayName">Имя</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={newAdmin.displayName}
                  onChange={handleInputChange}
                  placeholder="Введите имя администратора"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={newAdmin.email}
                  onChange={handleInputChange}
                  placeholder="Введите email"
                  type="email"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  name="password"
                  value={newAdmin.password}
                  onChange={handleInputChange}
                  placeholder="Введите пароль"
                  type="password"
                  required
                />
              </div>

              {createAdminError && (
                <Alert variant="destructive" className="w-full">
                  <AlertCircleIcon />
                  <AlertDescription>{createAdminError}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-brand hover:bg-amber-600 transition duration-300"
              >
                Сохранить
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAdmins?.map((admin) => (
          <Card key={admin._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{admin.displayName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{admin.email}</p>
              <p className="text-xs text-gray-500 uppercase">{admin.role}</p>
              {admin.role === 'superAdmin' ? null : (
                <div className="flex gap-2 pt-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Удалить</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Вы уверены что хотите удалить администратора - {admin.displayName}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие необратимо. Вы моментально удалите профиль из базы данных
                          системы.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Нет</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(admin._id)}>
                          Да
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminModeration;
