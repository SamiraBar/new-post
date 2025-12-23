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
    <div className="flex flex-col group">
      <div
        className={`
    flex items-center w-full h-10 rounded-lg border
    bg-gray-50 px-3 py-2 text-sm
    transition-all
    ${error ? 'border-red-500' : 'border-gray-300'}
    group-focus-within:border-gray-300
    group-focus-within:shadow-[0_0_0_2px_rgba(156,163,175,0.4)]
  `}
      >
        <PhoneInputWithCountry
          international
          defaultCountry="KG"
          countries={['KG', 'RU', 'KZ', 'BY']}
          value={value}
          onChange={(phone) => onChange(phone || '')}
          placeholder={placeholder || '+996 XXX XXX XXX'}
          className="flex items-center w-full"
          numberInputProps={{
            className: 'w-full bg-transparent border-none outline-none ring-0 focus:ring-0 text-sm',
          }}
          countrySelectProps={{
            className: 'bg-transparent border-none outline-none pr-2',
          }}
        />
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default PhoneInput;
