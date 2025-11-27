import { type FC } from 'react';
import PhoneInputWithCountry from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
}

const PhoneInput: FC<PhoneInputProps> = ({ value, onChange, error, placeholder }) => {
    return (
        <div className="relative">
            <PhoneInputWithCountry
                international
                defaultCountry="KG"
                countries={['KG', 'RU', 'KZ', 'BY']}
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
                <div className="absolute -bottom-5 left-0">
                    <p className="text-red-500 text-xs">{error}</p>
                </div>
            )}
        </div>
    );
};

export default PhoneInput;