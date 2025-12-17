import { type FC } from 'react';
import PhoneInputWithCountry from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { AlertCircle } from 'lucide-react';

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    defaultValue?: boolean;
}

const PhoneInput: FC<PhoneInputProps> = ({ value, onChange, error, placeholder, defaultValue }) => {
  return (
        <div className="relative">
            <PhoneInputWithCountry
                international={false}
                defaultCountry="KG"
                countries={defaultValue ? ['KG'] : ['RU', 'KZ', 'BY']}
                value={value}
                onChange={(phone) => onChange(phone || '')}
                placeholder={placeholder || '+996 XXX XXX XXX'}
                className={`
          flex items-center w-full p-3 border-2 rounded-lg transition-all
          bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-offset-1
          ${error
                    ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-200'
                    : 'border-gray-300 focus-within:border-orange-500 focus-within:ring-orange-200'
                }
        `}
                numberInputProps={{
                    className: 'bg-transparent border-none outline-none ring-0 focus:ring-0 w-full',
                }}
                countrySelectProps={{
                    className: 'border-none bg-transparent pr-2',
                }}
            />
            {error && (
                  <div
                    className="flex items-center gap-1.5 mt-1 text-red-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle size={14} className="shrink-0"/>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default PhoneInput;