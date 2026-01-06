import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useAdminStore from '@/stores/adminStore/adminStore.ts';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, ChevronLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert.tsx';
import { toast } from 'sonner';
import type { AdminSelfEdit } from '@/types';

const AdminProfileEdit = () => {
  const admin = useAdminStore((s) => s.admin);
  const { editSelf, editSelfError } = useAdminStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AdminSelfEdit & { confirmPassword: string }>({
    email: admin?.email || '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!admin || admin.role !== 'superAdmin') {
      navigate('/admin');
    }
  }, [navigate, admin]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      return toast.error('Email должен содержать символы "@" и "."');
    }

    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        return toast.error('Пароли не совпадают');
      }

      if (formData.password.length < 8) {
        return toast.error('Пароль должен содержать минимум 8 символов');
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        return toast.error('Пароль должен содержать заглавные и строчные буквы, и цифры');
      }
    }

    const dataToSend: AdminSelfEdit = {
      email: formData.email,
    };

    if (formData.password) {
      dataToSend.password = formData.password;
    }

    const success = await editSelf(dataToSend);

    if (success) {
      toast.success('Профиль успешно обновлен');
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    }
  };

  if (!admin || admin.role !== 'superAdmin') {
    return null;
  }

  return (
    <div className="container mx-auto pt-20 flex flex-col gap-6">
      <div className="flex mt-5 items-center justify-between mb-8">
        <Link to="/admin">
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronLeft />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-center flex-1 mx-4">Редактировать профиль</h1>
        <div className="w-10" />
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle>Настройки профиля</CardTitle>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
              <h3 className="font-semibold text-sm text-blue-900 mb-2">Текущие данные:</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>
                  <strong>Имя:</strong> {admin.displayName}
                </p>
                <p>
                  <strong>Email:</strong> {admin.email}
                </p>
                <p>
                  <strong>Роль:</strong> {admin.role}
                </p>
                <p>
                  <strong>ID:</strong> {admin._id}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Имя</Label>
                <Input
                  id="displayName"
                  value={admin.displayName}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">Имя нельзя изменить</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your-email@example.com"
                  required
                  className="focus-visible:border-amber-600 focus-visible:ring-amber-600 focus-visible:ring-1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Новый пароль</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Оставьте пустым, чтобы не менять"
                  className="focus-visible:border-amber-600 focus-visible:ring-amber-600 focus-visible:ring-1"
                />
                <p className="text-xs text-gray-500">
                  Минимум 8 символов, должен содержать заглавные и строчные буквы, цифры
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Повторите новый пароль"
                  disabled={!formData.password}
                  className="focus-visible:border-amber-600 focus-visible:ring-amber-600 focus-visible:ring-1"
                />
              </div>

              {editSelfError && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertDescription>{editSelfError}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-brand hover:bg-amber-600 transition duration-300"
              >
                Сохранить изменения
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfileEdit;
