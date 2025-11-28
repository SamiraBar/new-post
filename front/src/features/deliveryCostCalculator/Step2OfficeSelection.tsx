import { offices } from '@/constants.ts';
import type { Order } from '@/types';
import { CheckCircle, MapPin, XCircle } from 'lucide-react';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    order: Order;
    setOrder: Dispatch<SetStateAction<Order>>;
    handleNext: () => void;
}

const Step2SenderOfficeSelection: FC<Props> = ({ order, setOrder }) => {
    const { t } = useTranslation();

    const isOfficeSelected = !!order.originOffice;

    const handleOfficeSelect = (officeId: number) => {
        const selectedOffice = offices.find(o => o.id === officeId);

        if (!selectedOffice) {
            console.error(`Office with id ${officeId} not found`);
            return;
        }

        const city = selectedOffice.address || selectedOffice.name.split(' - ')[1] || order.originCity;

        setOrder((prev) => ({
            ...prev,
            originOffice: officeId,
            originCity: city,
        }));
    };

    return (
        <div className="w-full pt-5">
            <div className="flex items-center justify-center gap-2 mb-6">
                <h3 className="text-2xl font-bold text-center">
                    {t('deliveryCostCalculator.stepTwoForm.title')}
                </h3>
                {isOfficeSelected ? (
                    <CheckCircle className="text-green-500" size={24} />
                ) : (
                    <XCircle className="text-gray-300" size={24} />
                )}
            </div>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                    <span className="font-medium">Выберите офис отправки.</span> Вы сможете сдать посылку в выбранном офисе.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                {offices.map((office) => {
                    const isSelected = order.originOffice === office.id;

                    return (
                        <button
                            type="button"
                            key={office.id}
                            onClick={() => handleOfficeSelect(office.id)}
                            className={`
                p-6 border-2 rounded-lg transition-all duration-300 text-left relative
                hover:shadow-lg hover:border-orange-300 hover:scale-[1.02]
                ${
                                isSelected
                                    ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-xl scale-105 ring-2 ring-orange-200'
                                    : 'border-gray-300 bg-white'
                            }
              `}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3">
                                    <CheckCircle className="text-orange-500" size={24} />
                                </div>
                            )}

                            <div className="flex flex-col h-full">
                                <div className="flex items-start gap-2 mb-2">
                                    <MapPin className={`flex-shrink-0 mt-1 ${isSelected ? 'text-orange-500' : 'text-gray-400'}`} size={20} />
                                    <h4 className="font-bold text-lg text-gray-800">{office.name}</h4>
                                </div>

                                <p className="text-gray-600 flex-grow">{office.address}</p>

                                <div className={`mt-3 text-sm font-medium ${isSelected ? 'text-orange-600' : 'text-gray-500'}`}>
                                    {isSelected ? '✓ Выбран' : 'Нажмите для выбора'}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
            {!isOfficeSelected && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-lg mx-5">
                    <p className="text-amber-700 text-sm font-medium">
                        ⚠️ Пожалуйста, выберите офис отправки
                    </p>
                </div>
            )}
        </div>
    );
};

export default Step2SenderOfficeSelection;