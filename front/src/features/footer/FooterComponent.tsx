import logo from '../../assets/logo/newPostLogo.jpeg';
import whatsappIcon from '../../assets/cosialIcons/WhatsApp.png';
import instagramIcon from '../../assets/cosialIcons/Instagram.png';
import { useTranslation } from 'react-i18next';

const FooterComponent = () => {
  const { t } = useTranslation();

  return (
    <footer
      id="contacts"
      className="w-full bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)] sticky mt-25 py-6"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex-shrink-0">
          <img
            src={logo}
            alt="New Post logo"
            width="180"
            height="100"
            className="w-32 h-auto sm:w-40 md:w-44 lg:w-48 mx-auto md:mx-0"
          />
        </div>

        <div className="text-gray-700 text-sm leading-relaxed md:flex-1 md:px-10">
          <p>{t('footer.address')}</p>
          <p>
            Телефон:{' '}
            <a href="tel:+996778465557" className="hover:text-blue-600 ">
              +996 778 465 557
            </a>
          </p>
          <p>
            Электронная почта:{' '}
            <a href="mailto:lanvoochta@omalcom" className="hover:text-blue-600">
              janypochta.kg@gmail.com
            </a>
          </p>
        </div>

        <div className="flex justify-center md:justify-end items-center gap-6">
          <a
            href="https://wa.me/996778465557?text=Здравствуйте%2C+у+меня+есть+вопрос"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <img
              src={whatsappIcon}
              alt="WhatsApp"
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 transition-transform duration-700 hover:scale-110"
            />
          </a>

          <a
            href="https://www.instagram.com/newpost.kg/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <img
              src={instagramIcon}
              alt="Instagram"
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 transition-transform duration-700 hover:scale-110"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
