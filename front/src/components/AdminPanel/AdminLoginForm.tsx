import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {type ChangeEvent, type FormEvent, useState} from "react";
import type {LoginMutation} from "@/types";
import useUserStore from "@/stores/userStore/userStore.ts";
import {useNavigate} from "react-router-dom";

const AdminLoginForm = () => {
  const { login, loginError, loginLoading } = useUserStore();
  const navigate = useNavigate();
  const [state, setState] = useState<LoginMutation>({
    email: "",
    password: "",
  })

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setState((prevState) => ({...prevState, [name]: value}));
  };

  const submitFormHandler = async (e: FormEvent) => {
    e.preventDefault();

    const success = await login(state);

    if (success) {
      navigate("/admin");
    }
  };

  return (
    <div className="pt-10">
      <Card className={"max-w-8/12 sm:max-w-6/12 mx-auto"}>
        <CardHeader>
          <CardTitle className={"text-brand-secondary"}>Вход в админ панель</CardTitle>
          <CardDescription>
            Введите свою почту и пароль
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitFormHandler}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className={"text-brand-secondary"}>Почта:</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={state.email}
                  placeholder="m@example.com"
                  onChange={inputChangeHandler}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className={"text-brand-secondary"}>Пароль:</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={state.password}
                  onChange={inputChangeHandler}
                  required />
              </Field>
              <Field>
                <Button
                  type="submit"
                  className={"bg-brand hover:bg-amber-600 transition duration-300 active:bg-amber-700"}
                  disabled={loginLoading}
                >Login</Button>
              </Field>
            </FieldGroup>

            {loginError && (
              <p className="text-red-500">{loginError.error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginForm;