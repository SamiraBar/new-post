import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { type ChangeEvent, type FormEvent, useState } from 'react';
import type { LoginMutation } from '@/types';
import useAdminStore from '@/stores/adminStore/adminStore.ts';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle } from '@/components/ui/alert.tsx';
import { AlertCircleIcon } from 'lucide-react';

const AdminLoginForm = () => {
  const { login, loginError, loginLoading } = useAdminStore();
  const navigate = useNavigate();
  const [state, setState] = useState<LoginMutation>({
    email: '',
    password: '',
  });

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = async (e: FormEvent) => {
    e.preventDefault();

    const success = await login(state);

    if (success) {
      navigate('/admin');
    }
  };

  return (
    <div className="pt-10">
      <Card className={'max-w-8/12 sm:max-w-6/12 mx-auto'}>
        <CardHeader>
          <CardTitle className={'text-brand-secondary'}>Вход в админ панель</CardTitle>
          <CardDescription>Введите свою почту и пароль</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitFormHandler}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className={'text-brand-secondary'}>
                  Почта:
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={state.email}
                  placeholder="m@example.com"
                  onChange={inputChangeHandler}
                  className="focus-visible:border-amber-600 focus-visible:ring-amber-600 focus-visible:ring-1"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className={'text-brand-secondary'}>
                    Пароль:
                  </FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={state.password}
                  onChange={inputChangeHandler}
                  className="focus-visible:border-amber-600 focus-visible:ring-amber-600 focus-visible:ring-1"
                  required
                />
              </Field>

              {loginError && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle>{loginError.error}</AlertTitle>
                </Alert>
              )}

              <Field>
                <Button
                  type="submit"
                  className={
                    'bg-brand hover:bg-amber-600 transition duration-300 active:bg-amber-700'
                  }
                  disabled={loginLoading}
                >
                  Login
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginForm;
