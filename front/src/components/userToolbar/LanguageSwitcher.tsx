import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const isKyrgyz = i18n.language === 'kg';
  const currentLang = isKyrgyz ? 'ҚЫР' : 'РУС';

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => changeLanguage(isKyrgyz ? 'ru' : 'kg')}
        className="block sm:hidden text-sm font-semibold uppercase text-gray-700 transition-colors duration-300 hover:text-[#FF4F00]"
      >
        {currentLang}
      </button>

      <div className="hidden sm:flex items-center gap-3">
        <span className="text-sm font-semibold uppercase text-gray-700">{currentLang}</span>

        <button
          role="switch"
          aria-checked={isKyrgyz}
          onClick={() => changeLanguage(isKyrgyz ? 'ru' : 'kg')}
          className={cn(
            'relative inline-flex h-7 w-14 sm:h-8 sm:w-16 items-center rounded-full border-2 border-gray-200',
            'shadow-sm hover:shadow-md transition-all duration-600 ease-in-out focus:outline-none',
            isKyrgyz ? 'bg-[#FF4F00]' : 'bg-white',
          )}
        >
          <span
            className={cn(
              'inline-block h-5 w-5 sm:h-6 sm:w-6 rounded-full shadow-md transform transition-all duration-500 ease-in-out',
              isKyrgyz
                ? 'translate-x-[1.875rem] sm:translate-x-[2.25rem] bg-white'
                : 'translate-x-0.5 bg-[#FF4F00]',
            )}
          />
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
