import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu.tsx';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { type ChangeEvent, useState } from 'react';
import logoImage from '@/assets/logo/newPostLogo.jpeg';
import useAdminStore from '@/stores/adminStore/adminStore.ts';
import ParcelModal from '@/features/parcels/ParcelModal';
import ModalFile from '@/features/adminPanel/components/ModalFile.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const AdminToolbar = () => {
  const { logout } = useAdminStore();
  const admin = useAdminStore((s) => s.admin);
  const [search, setSearch] = useState({
    trackNumber: '',
    sender: '',
    receiver: '',
  });
  const [isParcelModalOpen, setIsParcelModalOpen] = useState(false);

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSearch((prevState) => ({ ...prevState, [name]: value }));
  };

  const isSuperAdmin = admin?.role === 'superAdmin';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trackNumber.trim() !== '') {
      e.preventDefault();
      setIsParcelModalOpen(true);
    }
  };

  return (
    <NavigationMenu className="py-3 md:py-4 [&>div]:w-full container">
      <NavigationMenuList
        className="
        grid
        w-full
        gap-x-5
        md:gap-y-3
        lg:gap-3
        pb-5
        md:py-5
        grid-cols-2
        grid-rows-2
        lg:grid-cols-[auto_1fr_auto]
        lg:grid-rows-1
  "
      >
        <NavigationMenuItem className="flex justify-end col-start-1 row-start-1">
          <Link to={'/admin'}>
            <img src={logoImage} alt="logo" className="w-30 md:w-25" />
          </Link>
        </NavigationMenuItem>

        <div className="flex flex-col md:flex-row gap-3 justify-center items-stretch w-full col-start-1 col-end-3 row-start-2 lg:col-start-2 lg:col-end-2 lg:row-start-1">
          <NavigationMenuItem className="flex-1">
            <Input
              type="search"
              name="trackNumber"
              id="trackNumber"
              placeholder="Трек номер посылки"
              value={search.trackNumber}
              onChange={inputChangeHandler}
              onKeyDown={handleKeyDown}
              className="focus-visible:border-amber-600 focus-visible:ring-amber-600 focus-visible:ring-1 w-full"
            />
            <ParcelModal
              open={isParcelModalOpen}
              onOpenChange={setIsParcelModalOpen}
              trackNumber={search.trackNumber}
            />
          </NavigationMenuItem>
          <NavigationMenuItem className="flex-1">
            <Input
              type="search"
              name="sender"
              id="sender"
              placeholder="ФИО отправителя"
              value={search.sender}
              onChange={inputChangeHandler}
              className="focus-visible:border-amber-600 focus-visible:ring-amber-600 focus-visible:ring-1 w-full"
            />
          </NavigationMenuItem>
          <NavigationMenuItem className="flex-1">
            <Input
              type="search"
              name="receiver"
              id="receiver"
              placeholder="ФИО получателя"
              value={search.receiver}
              onChange={inputChangeHandler}
              className="focus-visible:border-amber-600 focus-visible:ring-amber-600 focus-visible:ring-1 w-full"
            />
          </NavigationMenuItem>
        </div>

        <NavigationMenuItem className="flex gap-3 justify-start col-start-2 lg:col-start-3 lg:row-start-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-brand hover:bg-amber-600 transition duration-300 active:bg-amber-700">
                Меню
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuGroup>
                {!isSuperAdmin ? null : (
                  <>
                    <Link to="moderation">
                      <DropdownMenuItem>Администраторы</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="hidden sm:flex "
                    >
                      <ModalFile />
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={async () => await logout()}>Выйти</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default AdminToolbar;
