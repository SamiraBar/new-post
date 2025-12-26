import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { ChevronLeft, Pencil, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator.tsx';
import CreateOffice from '@/features/offices/CreateOffice.tsx';
import { useEffect, useState } from 'react';
import useOfficesStore from '@/stores/officesStore/officesStore.ts';
import dayjs from 'dayjs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import EditOfficeDialog from '@/features/offices/EditOfficeDialog.tsx';

const OfficesList = () => {

  const {
    getOffices,
    adminOffices,
    deleteOffice
  } = useOfficesStore();
  const [editingOfficeId, setEditingOfficeId] = useState<string | null>(null);

  const deleteOfficeById = async (id: string) => {
    await deleteOffice(id);
  };

  const editOfficeById = async (id: string) => {
    setEditingOfficeId(id);
  };

  console.log(adminOffices);

  useEffect(() => {
    void getOffices('admin');
  }, [getOffices]);

  return (
    <div className="relative">
      <div className="sticky top-0 z-50 bg-background/85 backdrop-blur border-b py-3">
        <div className="container py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link to="/admin">
                <Button variant="outline" size="icon" className="rounded-full">
                  <ChevronLeft/>
                </Button>
              </Link>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Офисы</h1>
                <p className="text-sm text-muted-foreground">
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Separator orientation="vertical" className="hidden md:block h-8 mx-1"/>
              <CreateOffice/>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <Table className="mt-10">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Название</TableHead>
              <TableHead>Адрес</TableHead>
              <TableHead>Ссылка</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата создания</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              adminOffices.map(office => (
                <TableRow
                  key={office._id}
                >
                  <TableCell>{office.name}</TableCell>
                  <TableCell>{office.address}</TableCell>
                  <TableCell>
                    <a
                      href={office.mapUrl}
                      target="_blank"
                      className="text-blue-600">
                      {office.mapUrl}
                    </a>
                  </TableCell>
                  <TableCell>{office.isActive ? 'Активен' : 'Не активен'}</TableCell>
                  <TableCell>{dayjs(office.createdAt).format('HH:mm DD.MM.YYYY')}</TableCell>
                  <TableCell className="flex gap-2 items-center">
                    <Button
                      variant="outline"
                      className="bg-amber-300"
                      size="icon"
                      onClick={() => editOfficeById(office._id)}
                    >
                      <Pencil color="white" />
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-red-600"
                      size="icon"
                      onClick={() => deleteOfficeById(office._id)}
                    >
                      <Trash color="white"/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
      {editingOfficeId && (
        <EditOfficeDialog
          officeId={editingOfficeId}
          open={!!editingOfficeId}
          onOpenChange={(open) => {
            if (!open) setEditingOfficeId(null);
          }}
        />
      )}
    </div>
  );
};


export default OfficesList;