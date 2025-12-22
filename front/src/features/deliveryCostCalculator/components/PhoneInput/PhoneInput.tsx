import { Input } from '@/components/ui/input.tsx';
import { type FC, type ChangeEvent } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const PhoneInput: FC<PhoneInputProps> = ({ value, onChange, placeholder, error }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col">
      <Input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-gray-50"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default PhoneInput;
