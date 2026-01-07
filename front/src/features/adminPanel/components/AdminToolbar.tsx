import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu.tsx';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { type ChangeEvent, useCallback, useEffect, useState } from 'react';
import logoImage from '@/assets/logo/newPostLogo.jpeg';
import useAdminStore from '@/stores/adminStore/adminStore.ts';
import ModalFile from '@/features/adminPanel/components/ModalFile.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useParcelsStore from '@/stores/parcelsStore/parcelsStore';
import { toast } from 'sonner';
import { useBarcodeScanner } from './hooks/useBarcodeScanner';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const AdminToolbar = () => {
  const { logout } = useAdminStore();
  const admin = useAdminStore((s) => s.admin);
  const { parcelsResponse, setSearchFilters } = useParcelsStore();

  const [search, setSearch] = useState({
    trackingNumber: '',
    sender: '',
    recipient: '',
  });

  const debouncedTrackingNumber = useDebounce(search.trackingNumber, 500);
  const debouncedSender = useDebounce(search.sender, 500);
  const debouncedRecipient = useDebounce(search.recipient, 500);

  useBarcodeScanner({
    onScan: (barcode) => {
      setSearchFilters({
        trackingNumber: barcode,
        sender: '',
        recipient: '',
      });
      setSearch({
        trackingNumber: barcode,
        sender: '',
        recipient: '',
      });
      toast.success(`Отсканирован баркод: ${barcode}`);
    },
    minLength: 4,
    maxTimeBetweenKeys: 30,
    enabled: true,
    targetInputId: 'trackingNumber',
  });

  useEffect(() => {
    setSearchFilters({
      trackingNumber: debouncedTrackingNumber,
      sender: debouncedSender,
      recipient: debouncedRecipient,
    });
  }, [debouncedTrackingNumber, debouncedSender, debouncedRecipient, setSearchFilters]);

  const parcels = parcelsResponse?.parcels ?? [];
  const hasSearchParams =
    Boolean(debouncedTrackingNumber) || Boolean(debouncedSender) || Boolean(debouncedRecipient);
  const notFound = parcels.length === 0 && hasSearchParams;

  useEffect(() => {
    if (notFound) {
      toast.error('Ничего не найдено');
      setSearchFilters({ trackingNumber: '', sender: '', recipient: '' });
    }
  }, [parcelsResponse, notFound, setSearchFilters]);

  const trackingChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value.length > 10) return;

    setSearch((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  }, []);

  const textChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleTrackingKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        setSearchFilters({
          trackingNumber: e.currentTarget.value.trim(),
          sender: '',
          recipient: '',
        });
      }
    },
    [setSearchFilters],
  );

  const isSuperAdmin = admin?.role === 'superAdmin';

  return (
    <NavigationMenu className="py-3 md:py-4 [&>div]:w-full container">
      <NavigationMenuList className="grid w-full gap-x-5 md:gap-y-3 lg:gap-3 pb-5 md:py-5 grid-cols-2 grid-rows-2 lg:grid-cols-[auto_1fr_auto] lg:grid-rows-1">
        <NavigationMenuItem className="flex justify-end col-start-1 row-start-1">
          <Link to={'/admin'}>
            <img src={logoImage} alt="logo" className="w-30 md:w-25" />
          </Link>
        </NavigationMenuItem>

        <div className="flex flex-col md:flex-row gap-3 justify-center items-stretch w-full col-start-1 col-end-3 row-start-2 lg:col-start-2 lg:col-end-2 lg:row-start-1">
          <NavigationMenuItem className="flex-1">
            <Input
              type="search"
              name="trackingNumber"
              id="trackingNumber"
              placeholder="Трек номер посылки"
              value={search.trackingNumber}
              onChange={trackingChangeHandler}
              onKeyDown={handleTrackingKeyDown}
              maxLength={10}
              className="focus-visible:border-amber-600 focus-visible:ring-amber-600 focus-visible:ring-1 w-full"
            />
          </NavigationMenuItem>

          <NavigationMenuItem className="flex-1">
            <Input
              type="search"
              name="sender"
              id="sender"
              placeholder="ФИО отправителя"
              value={search.sender}
              onChange={textChangeHandler}
              className="focus-visible:border-amber-600 focus-visible:ring-amber-600 focus-visible:ring-1 w-full"
            />
          </NavigationMenuItem>

          <NavigationMenuItem className="flex-1">
            <Input
              type="search"
              name="recipient"
              id="recipient"
              placeholder="ФИО получателя"
              value={search.recipient}
              onChange={textChangeHandler}
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
                {isSuperAdmin && (
                  <>
                    <Link to="moderation">
                      <DropdownMenuItem>Администраторы</DropdownMenuItem>
                    </Link>
                    <Link to="site-content">
                      <DropdownMenuItem>Редактировать сайт</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="hidden sm:flex"
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
