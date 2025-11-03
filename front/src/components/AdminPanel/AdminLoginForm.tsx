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

const AdminLoginForm = () => {
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
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className={"text-brand-secondary"}>Почта:</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className={"text-brand-secondary"}>Пароль:</FieldLabel>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit" className={"bg-brand hover:bg-amber-600 transition duration-300 active:bg-amber-700"}>Login</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginForm;