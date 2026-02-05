import { useState } from 'react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '../ui/navigation-menu';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/logo/logo.png';
import logoKg from '../../assets/logo/newpost_logo01.png';
import LanguageSwitcher from './LanguageSwitcher.tsx';
import { useTranslation } from 'react-i18next';

const navigationItems = [
  { key: 'nav.importantInfo', link: '#important-info' },
  { key: 'nav.about', link: '#about' },
  { key: 'nav.contacts', link: '#contacts' },
];

const UserToolbar = () => {
  const [state, setState] = useState({
    isMenuOpen: false,
    hoveredIndex: null as number | null,
  });

  const { t, i18n } = useTranslation();

  const logoByLang = i18n.resolvedLanguage === 'kg' ? logoKg : logo;

  const toggleMenu = () => setState((prev) => ({ ...prev, isMenuOpen: !prev.isMenuOpen }));

  const handleMouseEnter = (index: number) => {
    setState((prev) => ({ ...prev, hoveredIndex: index }));
  };

  const handleMouseLeave = () => {
    setState((prev) => ({ ...prev, hoveredIndex: null }));
  };

  const handleAnchorClick = () => {
    setState((prev) => ({ ...prev, isMenuOpen: false }));
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 font-medium">
      <div className="container mx-auto px-4">
        <NavigationMenu className="w-full py-3 md:py-4 max-w-none [&>div]:w-full">
          <NavigationMenuList className="w-full max-w-none gap-12 m-0">
            <NavigationMenuItem>
              <Link to="/" className="flex items-center">
                <img
                  src={logoByLang}
                  alt="New Post logo"
                  className="h-12 md:h-16 w-auto object-contain"
                />
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem className="hidden sm:block flex-1">
              <ul className="flex items-center justify-center gap-6 md:gap-12">
                {navigationItems.map((item, index) => (
                  <li key={`${item.key}-${index}`}>
                    <a
                      href={item.link}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                      onClick={handleAnchorClick}
                      className={`group flex flex-col items-center text-center transition-colors duration-800 cursor-pointer font-semibold ${
                        state.hoveredIndex === index ? 'text-[#FF4F00]' : 'text-black'
                      }`}
                    >
                      <span className="sm:text-sm md:text-lg lg:text-xl leading-tight">
                        {t(item.key)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </NavigationMenuItem>

            <NavigationMenuItem className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={toggleMenu}
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {state.isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div
          className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            state.isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="py-4 border-t border-gray-200">
            <ul className="flex flex-col gap-4">
              {navigationItems.map((item, index) => (
                <li key={`mobile-${item.key}-${index}`}>
                  <a
                    href={item.link}
                    onClick={handleAnchorClick}
                    className="flex flex-col px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-base font-bold text-gray-900">{t(item.key)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default UserToolbar;
