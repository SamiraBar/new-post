import { offices } from '../../constants.ts';

interface Step2OfficeSelectionProps {
    selectedOffice: number | null;
    onSelectOffice: (officeId: number) => void;
}

export const Step2OfficeSelection = ({ selectedOffice, onSelectOffice }: Step2OfficeSelectionProps) => {
    return (
        <div className="w-full pt-5">
            <h3 className="text-2xl font-bold text-center mb-8">
                Тандоо кеңсесин / Выберите офис отправки
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                {offices.map((office) => (
                    <button
                        key={office.id}
                        onClick={() => onSelectOffice(office.id)}
                        className={`
              p-6 border-2 rounded-lg transition-all duration-300 text-left
              hover:shadow-lg hover:border-orange-300 hover:scale-105
              ${
                            selectedOffice === office.id
                                ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-xl scale-105 ring-2 ring-orange-200 ring-opacity-50'
                                : 'border-gray-300 bg-white'
                        }
            `}
                    >
                        <div className="flex flex-col h-full">
                            <h4 className="font-bold text-lg mb-2 text-gray-800">{office.name}</h4>
                            <p className="text-gray-600 flex-grow">{office.address}</p>
                            <div className={`mt-3 text-sm font-medium ${
                                selectedOffice === office.id ? 'text-orange-600' : 'text-gray-500'
                            }`}>
                                {selectedOffice === office.id ? '✓ Таңдалды / Выбран' : 'Тандоо / Выбрать'}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};