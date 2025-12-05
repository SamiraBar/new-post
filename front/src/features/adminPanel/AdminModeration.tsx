import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useAdminStore from '@/stores/adminStore/adminStore.ts';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, ChevronLeft } from 'lucide-react';
import type { AdminEditing, AdminMutation } from '@/types';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert.tsx';
import { toast } from 'sonner';

const AdminModeration = () => {
  const admin = useAdminStore((s) => s.admin);
  const { allAdmins, getAllAdmins, deleteAdmin, createAdmin, editAdmin } = useAdminStore();
  const createAdminError = useAdminStore((s) => s.createAdminError);
  const editAdminError = useAdminStore((s) => s.editAdminError);
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);

  const [newAdmin, setNewAdmin] = useState<AdminMutation>({
    displayName: '',
    email: '',
    password: '',
  });

  const [editAdminState, setEditAdminState] = useState<AdminEditing>({
    _id: '',
    displayName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (!admin || admin.role !== 'superAdmin') {
      navigate('/admin');
    }
    void getAllAdmins();
  }, [navigate, admin, getAllAdmins]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id: string) => {
    await deleteAdmin(id);
    await getAllAdmins();
  };

  const handleEditAdmin = async (e: FormEvent) => {
    e.preventDefault();
    if (!editAdminState.email.includes('@') || !editAdminState.email.includes('.')) {
      return toast.error('Email должен содержать символы "@" и "."');
    }
    const success = await editAdmin(editAdminState);
    if (success) {
      await getAllAdmins();
      if (success) setEditingAdminId(null);
      return toast.success('Даннные обновлены');
    }
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

  const onlineAdmins = allAdmins?.filter((a) => a.isActive) || [];

  return (
    <div className="container mx-auto pt-20 flex flex-col gap-6">
      <div className="flex mt-5 items-center justify-between mb-8">
        <Link to="/admin">
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronLeft />
          </Button>
        </Link>

        <h1 className="text-2xl font-bold text-center flex-1 mx-4">
          Управление администраторами
        </h1>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button className="bg-brand hover:bg-amber-600 transition duration-300">
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

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 flex flex-col gap-4">
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">
              Администраторы онлайн ({onlineAdmins.length})
            </h2>
            <ul className="space-y-3">
              {onlineAdmins.map((a) => (
                <li key={a._id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {a.displayName[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{a.displayName}</p>
                    <p className="text-xs text-gray-500">{a.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allAdmins?.map((a) => (
            <Card key={a._id} className="hover:shadow-lg transition-shadow rounded-lg">
              <CardHeader>
                <CardTitle>{a.displayName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{a.email}</p>
                <p className="text-xs text-gray-500 uppercase">{a.role}</p>

                {a.role !== 'superAdmin' && (
                  <div className="flex gap-2 pt-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Удалить</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Вы уверены что хотите удалить администратора - {a.displayName}?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Это действие необратимо. Вы моментально удалите профиль из базы данных системы.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Нет</AlertDialogCancel>
                          <Button
                            onClick={() => handleDelete(a._id)}
                            className="bg-destructive text-white"
                          >
                            Да
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog
                      open={editingAdminId === a._id}
                      onOpenChange={(open) => setEditingAdminId(open ? a._id : null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            setEditAdminState({
                              _id: a._id,
                              displayName: a.displayName,
                              email: a.email,
                              password: '',
                            })
                          }
                        >
                          Редактировать
                        </Button>
                      </AlertDialogTrigger>
                        <AlertDialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50">
                          <form onSubmit={handleEditAdmin}>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-center">Редактировать</AlertDialogTitle>
                            <AlertDialogDescription>
                              Внесите изменения в данные администратора и сохраните их.
                            </AlertDialogDescription>

                            <div className="space-y-4 mt-4">
                              <div className="flex flex-col space-y-1">
                                <Label>Имя</Label>
                                <Input
                                  value={editAdminState.displayName}
                                  onChange={(e) =>
                                    setEditAdminState(prev => ({ ...prev, displayName: e.target.value }))
                                  }
                                />
                              </div>

                              <div className="flex flex-col space-y-1">
                                <Label>Почта</Label>
                                <Input
                                  type="email"
                                  value={editAdminState.email}
                                  onChange={(e) =>
                                    setEditAdminState(prev => ({ ...prev, email: e.target.value }))
                                  }
                                />
                              </div>

                              <div className="flex flex-col space-y-1">
                                <Label>Пароль</Label>
                                <Input
                                  placeholder="Оставьте пустым для сохранения текущего пароля"
                                  value={editAdminState.password}
                                  onChange={(e) =>
                                    setEditAdminState(prev => ({ ...prev, password: e.target.value }))
                                  }
                                />
                              </div>
                            </div>

                            {editAdminError && (
                              <Alert variant="destructive" className="w-full mt-2">
                                <AlertCircleIcon />
                                <AlertDescription>{editAdminError}</AlertDescription>
                              </Alert>
                            )}
                          </AlertDialogHeader>

                          <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel>Отменить изменения</AlertDialogCancel>
                            <Button type="submit" className="bg-brand text-white">
                              Сохранить
                            </Button>
                          </AlertDialogFooter>
                          </form>
                        </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminModeration;
