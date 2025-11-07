import {Button} from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label";
import {DatabaseIcon} from "lucide-react";
import {NavigationMenuItem} from "@/components/ui/navigation-menu.tsx";
import useFileStore from "@/stores/fileStore/fileStore.ts";
import {type ChangeEvent} from "react";
import {toast} from "sonner";
import FileInput from "../../ui/FileInput.tsx";

const ModalFile = () => {
  const {handFile, pvzFile, setPvzFile, setHandFile, uploadFiles, loadingPvz, loadingHand} = useFileStore();

  const handlePvzChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPvzFile(file);
  };

  const handleHandChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setHandFile(file);
  };

  const handleUpload = async (type: "PVZ" | "Hand") => {
    toast.promise(uploadFiles(type), {
      loading: "Отправка...",
      success: "База успешно обновлена",
      error: (err) => err instanceof Error ? err.message : "Ошибка отправки",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <NavigationMenuItem className="hidden sm:inline-flex">
          <Button
            className="bg-brand hover:bg-amber-600 transition duration-300 active:bg-amber-700"
            size={"icon"}
          >
            <DatabaseIcon/>
          </Button>
        </NavigationMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Загрузка БД</DialogTitle>
          <DialogDescription>
            Приложите файлы с корректными данными для загрузки тарифов и городов.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="PVZ">Тарифы для доставки в ПВЗ</Label>
            <div className="flex w-full max-w-sm items-center gap-2">
              <FileInput name="PVZ" onChange={handlePvzChange} file={pvzFile}/>
              <Button
                className={"bg-brand hover:bg-amber-600 transition duration-300 active:bg-amber-700"}
                type="button"
                disabled={loadingPvz}
                onClick={() => handleUpload("PVZ")}
              >Отправить </Button>
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="Hand">Тарифы для личной доставки</Label>
            <div className="flex w-full max-w-sm items-center gap-2">
              <FileInput name="Hand" onChange={handleHandChange} file={handFile}/>
              <Button
                className={"bg-brand hover:bg-amber-600 transition duration-300 active:bg-amber-700"}
                type="button"
                disabled={loadingHand}
                onClick={() => handleUpload("Hand")}
              >Отправить</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalFile;