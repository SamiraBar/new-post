import logo from '../../assets/logo/newPostLogo.jpeg';
import whatsappIcon from '../../assets/cosialIcons/WhatsApp.png';
import instagramIcon from '../../assets/cosialIcons/Instagram.png';
import { useTranslation } from 'react-i18next';

const FooterComponent = () => {
  const { t } = useTranslation();

  return (
      <footer
          id="contacts"
          className="w-full bg-neutral-900 text-neutral-300 py-10 mt-20 border-t border-neutral-800"
      >
        <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center md:items-start justify-between gap-10 text-center md:text-left">
          <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-3">
            <div className="relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-b from-neutral-700/80 to-neutral-950 p-[3px] shadow-lg shadow-black/40">
              <div className="bg-white rounded-2xl px-3 py-2 flex items-center justify-center">
                <img
                    src={logo}
                    alt="New Post logo"
                    width={180}
                    height={100}
                    className="h-14 sm:h-16 md:h-18 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          <div className="text-sm leading-relaxed md:flex-1 md:px-10 space-y-1 text-neutral-300">
            <p>{t('footer.address')}</p>
            <p>
              Телефон:{' '}
              <a
                  href="tel:+996778465557"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                +996 778 465 557
              </a>
            </p>
            <p>
              Электронная почта:{' '}
              <a
                  href="mailto:lanvoochta@omalcom"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                janypochta.kg@gmail.com
              </a>
            </p>
          </div>

          <div className="flex justify-center md:justify-end items-center gap-5">
            <a
                href="https://wa.me/996778465557?text=Здравствуйте%2C+у+меня+есть+вопрос"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 flex items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 group-hover:border-green-500/70 transition-all duration-300 shadow-md shadow-black/30">
                <img
                    src={whatsappIcon}
                    alt="WhatsApp"
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-transform duration-300 group-hover:scale-110 brightness-100"
                />
              </div>
            </a>

            <a
                href="https://www.instagram.com/newpost.kg/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 flex items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 group-hover:border-pink-500/70 transition-all duration-300 shadow-md shadow-black/30">
                <img
                    src={instagramIcon}
                    alt="Instagram"
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-transform duration-300 group-hover:scale-110 brightness-100"
                />
              </div>
            </a>
          </div>
        </div>
      </footer>
  );
};

export default FooterComponent;
