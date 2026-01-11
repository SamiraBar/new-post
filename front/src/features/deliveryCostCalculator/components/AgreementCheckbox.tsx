import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import axiosApi from '@/axiosApi.ts';
import type { CompanyFile } from '@/stores/fileStore/companyFilesStore.ts';

const AgreementCheckbox = ({
  isAgreed,
  setIsAgreed,
  agreementError,
  setAgreementError,
}: {
  isAgreed: boolean;
  setIsAgreed: (val: boolean) => void;
  agreementError: boolean;
  setAgreementError: (val: boolean) => void;
}) => {
  const [agreementFile, setAgreementFile] = useState<CompanyFile | null>(null);

  useEffect(() => {
    const loadAgreement = async () => {
      try {
        const { data } = await axiosApi.get('/admin/company-files/agreement');
        setAgreementFile(data);
      } catch {
        setAgreementFile(null);
      }
    };
    void loadAgreement();
  }, []);


  return (
    <div
      className={[
        'w-full sm:min-w-[420px] -order-1 sm:order-0',
        'rounded-2xl border-2 p-4 shadow-sm',
        agreementError && !isAgreed ? 'border-red-500 bg-red-50' : 'border-orange-300 bg-orange-50',
      ].join(' ')}
    >
      <div className="flex items-center justify-center">
        <Checkbox
          checked={isAgreed}
          onCheckedChange={(checked) => {
            setIsAgreed(checked === true);
            setAgreementError(false);
          }}
        />
      </div>

      <div className="text-left">
        <Label
          className={[
            'block text-sm leading-snug mt-1',
            agreementError && !isAgreed ? 'text-red-700' : 'text-gray-700',
          ].join(' ')}
        >
          Я согласен с условиями{' '}
          {agreementFile && (
            <a
              href={agreementFile.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={agreementFile.fileName}
              className="text-blue-600 underline ml-1"
            >
              ({agreementFile.fileName})
            </a>
          )}
        </Label>
        <p className="text-xs text-gray-600 mt-1">Вы можете скачать файл соглашения</p>
      </div>
    </div>
  );
};

export default AgreementCheckbox;
