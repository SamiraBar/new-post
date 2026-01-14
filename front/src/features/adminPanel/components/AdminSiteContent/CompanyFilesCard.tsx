import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useCompanyFilesStore from '@/stores/fileStore/companyFilesStore.ts';

interface UploadFormState {
  file: File | null;
  type: string;
}

const CompanyFilesCard = () => {
  const { items, loading, fetchFiles, uploadFile, replaceFile, deleteFile, downloadFile } =
    useCompanyFilesStore();

  const [uploadForm, setUploadForm] = useState<UploadFormState>({
    file: null,
    type: '',
  });

  const replaceFileRefs = useRef<Record<string, HTMLInputElement>>({});

  useEffect(() => {
    void fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.type) {
      toast.error('Выберите файл и укажите тип');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('type', uploadForm.type);

    try {
      await uploadFile(formData);
      setUploadForm({ file: null, type: '' });
      toast.success('Файл успешно загружен');
    } catch {
      toast.error('Ошибка загрузки файла');
    }
  };

  const handleReplace = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await replaceFile(id, formData);
      toast.success('Файл заменён');
    } catch {
      toast.error('Ошибка замены файла');
    }
  };

  return (
    <Card className="rounded-2xl border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl font-semibold">Файлы компании</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="space-y-2">

          <div className="flex flex-col md:flex-row md:items-end gap-4">

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Тип файла</label>
              <input
                type="text"
                placeholder="Contract / License / Rules"
                value={uploadForm.type}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full h-10 rounded-md border px-3 text-sm"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Файл</label>

              <label className="flex items-center gap-3 h-10 cursor-pointer">
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      file: e.target.files?.[0] || null,
                    }))
                  }
                />

                <span className="px-4 py-2 h-10 flex items-center rounded-md border bg-white text-sm whitespace-nowrap">
                  Выбрать файл
                </span>

                <span className="text-sm text-muted-foreground truncate max-w-[220px]">
                  {uploadForm.file ? uploadForm.file.name : 'Файл не выбран'}
                </span>
              </label>
            </div>

            <Button
              onClick={handleUpload}
              disabled={loading}
              className="h-10 bg-brand hover:bg-amber-600"
            >
              Загрузить
            </Button>
          </div>

          <p className="text-xs text-orange-600">
            Важно: указывайте тип файла на английском. Например: <strong>Contract</strong>,{' '}
            <strong>License</strong>, <strong>Rules</strong>
          </p>
        </div>
        <ul className="space-y-3">
          {items.map((file) => (
            <li
              key={file._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border rounded-xl p-4"
            >
              <div className="min-w-0 space-y-1">
                <p className="font-medium truncate max-w-[320px]">{file.fileName}</p>
                <p className="text-sm text-muted-foreground">Тип: {file.type}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadFile(file._id, file.fileName)}
                >
                  Скачать
                </Button>

                <input
                  type="file"
                  hidden
                  ref={(el) => {
                    if (el) replaceFileRefs.current[file._id] = el;
                  }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleReplace(file._id, f);
                  }}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => replaceFileRefs.current[file._id]?.click()}
                >
                  Заменить
                </Button>

                <Button size="sm" variant="destructive" onClick={() => deleteFile(file._id)}>
                  Удалить
                </Button>
              </div>
            </li>
          ))}
        </ul>

        {!items.length && (
          <p className="text-sm text-muted-foreground text-center">Файлы ещё не загружены</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyFilesCard;
