import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import axiosApi from '@/axiosApi.ts';
import useCompanyFilesStore, { type CompanyFile } from '@/stores/fileStore/companyFilesStore.ts';

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
  const { downloadFile } = useCompanyFilesStore();

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

  const handleDownload = () => {
    if (!agreementFile) return;
    void downloadFile(agreementFile._id, agreementFile.fileName);
  };

  return (
    <div
      className={[
        'w-full sm:min-w-[420px] -order-1 sm:order-0',
        'rounded-2xl border-2 p-4 shadow-sm',
        agreementError && !isAgreed ? 'border-red-500 bg-red-50' : 'border-orange-300 bg-orange-50',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          className="mt-1"
          checked={isAgreed}
          onCheckedChange={(checked) => {
            setIsAgreed(checked === true);
            setAgreementError(false);
          }}
        />

        <div className="flex flex-col text-left">
          <Label
            className={[
              'text-sm leading-snug',
              agreementError && !isAgreed ? 'text-red-700' : 'text-gray-700',
            ].join(' ')}
          >
            Я согласен с условиями{' '}
            {agreementFile && (
              <button
                type="button"
                onClick={handleDownload}
                className="text-blue-600 underline ml-1 hover:text-blue-800"
              >
                ({agreementFile.fileName})
              </button>
            )}
          </Label>

          <p className="text-xs text-gray-600 mt-1">Вы можете скачать файл соглашения</p>
        </div>
      </div>
    </div>
  );
};

export default AgreementCheckbox;
