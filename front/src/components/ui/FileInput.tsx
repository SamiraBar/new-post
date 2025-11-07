import {useRef, useState, type ChangeEvent, type FC, useEffect} from "react";
import {Input} from "@/components/ui/input";

interface Props {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  file?: File | null;
}

const FileInput: FC<Props> = ({onChange, name, file}) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");

  const handleClick = () => {
    ref.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFileName(file ? file.name : "");
    onChange(e);
  };

  useEffect(() => {
    if (!file) {
      setFileName("");
      if (ref.current) ref.current.value = "";
    }
  }, [file]);

  return (
    <div className="flex flex-col gap-1 w-full">

      <input
        ref={ref}
        name={name}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex gap-2 w-full items-center">
        <Input
          className="focus-visible:border-amber-600 focus-visible:ring-amber-600 focus-visible:ring-1"
          value={fileName}
          readOnly
          onClick={handleClick}
          placeholder="Файл не выбран"
        />
      </div>
    </div>
  );
};

export default FileInput;
