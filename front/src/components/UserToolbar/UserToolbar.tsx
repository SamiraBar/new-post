import { useState } from 'react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '../ui/navigation-menu';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import logo from '../../assets/logo/newPostLogo.jpeg';
import icWhatsapp from '../../assets/cosialIcons/whatsapp.png';

const renderText: { kg: string; ru: string; link: string }[] = [
  { kg: 'Маанилуу маалымат', ru: 'Важная информация', link: '#important-info' },
  { kg: 'Биз жонундо', ru: 'О компании', link: '#about' },
  { kg: 'Байланыштар', ru: 'Контакты', link: '#' },
];

const UserToolbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-5">
      <div className="container mx-auto px-4">
        <NavigationMenu className="w-full py-3 md:py-4 max-w-none [&>div]:w-full">
          <NavigationMenuList className="w-full max-w-none gap-12 m-0">
            <NavigationMenuItem>
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="New Post logo"
                  className="h-12 md:h-16 w-auto object-contain"
                />
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem className="hidden sm:block flex-1">
              <ul className="flex items-center justify-center gap-6 md:gap-12">
                {renderText.map((text, index) => (
                  <li key={`${text.ru}-${index}`}>
                    <Link
                      to={text.link}
                      className="group flex flex-col items-center text-center transition-colors hover:text-blue-600"
                    >
                      <span className="sm:text-sm md:text-lg lg:text-xl font-semibold leading-tight">
                        {text.kg}
                      </span>
                      <span className="sm:text-xs md:text-sm lg:text-lg text-gray-600 group-hover:text-blue-600 transition-colors">
                        {text.ru}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </NavigationMenuItem>

            <NavigationMenuItem className="flex items-center gap-12">
              <Link to="#" aria-label="WhatsApp">
                <img
                  src={icWhatsapp}
                  alt="whatsapp"
                  className="w-9 h-9 md:w-10 md:h-10 transition-transform hover:scale-110"
                />
              </Link>

              <button
                onClick={toggleMenu}
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div
          className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="py-4 border-t border-gray-200">
            <ul className="flex flex-col gap-4">
              {renderText.map((text, index) => (
                <li key={`mobile-${text.ru}-${index}`}>
                  <Link
                    to={text.link}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-base font-semibold text-gray-900">{text.kg}</span>
                    <span className="text-sm text-gray-600">{text.ru}</span>
                  </Link>
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
