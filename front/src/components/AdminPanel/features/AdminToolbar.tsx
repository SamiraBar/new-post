import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { type ChangeEvent, useState } from 'react';
import logoImage from '@/assets/logo/newPostLogo.jpeg';
import useAdminStore from '@/stores/adminStore/adminStore.ts';
import ModalFile from "@/components/AdminPanel/features/ModalFile.tsx";

export const AdminToolbar = () => {
  const { logout } = useAdminStore()
  const [search, setSearch] = useState({
    trackNumber: "",
    sender: "",
    receiver: "",
  })

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setSearch((prevState) => ({...prevState, [name]: value}));
  };

  return (
    <NavigationMenu className="mx-auto py-3">
      <NavigationMenuList className="flex-col sm:flex-row flex-wrap items-center  md:justify-between w-full gap-2.5">
        <NavigationMenuItem className="flex gap-5">
          <Link to={"/admin"}>
            <img src={logoImage} alt="logo" style={{width: "60px", minWidth: "60px"}}/>
          </Link>

          <Button className="inline-block sm:hidden bg-brand hover:bg-amber-600 transition duration-300 active:bg-amber-700">
            Выйти
          </Button>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Input
            type="search"
            name="trackNumber"
            id="trackNumber"
            placeholder="Трек номер посылки"
            value={search.trackNumber}
            onChange={inputChangeHandler}
            className="focus-visible:border-amber-600 focus-visible:ring-amber-600 focus-visible:ring-1"
          />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Input
            type="search"
            name="sender"
            id="sender"
            placeholder="ФИО отправителя"
            value={search.sender}
            onChange={inputChangeHandler}
            className="focus-visible:border-amber-600 focus-visible:ring-amber-600 focus-visible:ring-1"
          />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Input
            type="search"
            name="receiver"
            id="receiver"
            placeholder="ФИО получателя"
            value={search.receiver}
            onChange={inputChangeHandler}
            className="focus-visible:border-amber-600 focus-visible:ring-amber-600 focus-visible:ring-1"
          />
        </NavigationMenuItem>

        <ModalFile/>

        <NavigationMenuItem className="hidden sm:inline-flex">
          <Button
            className="bg-brand hover:bg-amber-600 transition duration-300 active:bg-amber-700"
            onClick={async () => await logout()}
          >
            Выйти
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
};

export default AdminToolbar;