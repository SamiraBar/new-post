import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import useCompanyFilesStore from '@/stores/fileStore/companyFilesStore.ts';

const ImportantInfo = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  const { items, fetchFiles, downloadFile } = useCompanyFilesStore();

  useEffect(() => {
    void fetchFiles();

    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [fetchFiles]);

  return (
    <section
      id="important-info"
      ref={sectionRef}
      className={`container mt-20 transition-all duration-500 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      <div className="p-2 sm:p-5 rounded-lg">
        <Card className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-amber-300 cursor-pointer">
          <CardContent className="p-5 sm:p-8">
            <div className="w-full">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-medium text-gray-900">
                  {t('importantInfo.title')}
                </h3>

                <Separator className="bg-amber-600 my-4 mx-auto w-20" />
              </div>

              <ul className="space-y-3 mt-4">
                {items.length > 0 ? (
                  items.map((file) => (
                    <li
                      key={file._id}
                      onClick={() => downloadFile(file._id, file.fileName)}
                      className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition"
                    >
                      <p className="font-medium truncate">{file.fileName}</p>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center">
                    Файлы ещё не загружены
                  </p>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ImportantInfo;
