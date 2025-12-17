import logoDark from '../../assets/logo/logo-2.png';
import whatsappIcon from '../../assets/cosialIcons/WhatsApp.png';
import instagramIcon from '../../assets/cosialIcons/Instagram.png';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { usePublicSiteText } from '@/features/adminPanel/hooks/usePublicSiteText.ts';

const FooterComponent = () => {
  const { t } = useTranslation();
  const { data } = usePublicSiteText();

  return (
    <footer
      id="contacts"
      className="w-full bg-neutral-900 text-neutral-300 py-10 mt-20 border-t border-neutral-800"
    >
      <div
        className="
          container mx-auto max-w-6xl px-4
          flex flex-col md:flex-row
          items-center md:items-center
          justify-between
          gap-8
          text-center md:text-left
        "
      >
        <div className="flex flex-col items-center md:items-start">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-block"
          >
            <img
              src={logoDark}
              alt="New Post logo"
              className="h-14 sm:h-16 w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </Link>
        </div>

        <div className="text-sm leading-relaxed space-y-1 text-neutral-300">

          <p>{data['footer.address']?.trim() || t('footer.address')}</p>
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
              href="mailto:janypochta.kg@gmail.com"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              janypochta.kg@gmail.com
            </a>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/996778465557?text=Здравствуйте%2C+у+меня+есть+вопрос"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="group"
          >
            <div
              className="
                w-11 h-11
                flex items-center justify-center
                rounded-full
                bg-neutral-800
                border border-neutral-700
                transition-all duration-300
                group-hover:border-green-500/70
              "
            >
              <img
                src={whatsappIcon}
                alt="WhatsApp"
                className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
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
            <div
              className="
                w-11 h-11
                flex items-center justify-center
                rounded-full
                bg-neutral-800
                border border-neutral-700
                transition-all duration-300
                group-hover:border-pink-500/70
              "
            >
              <img
                src={instagramIcon}
                alt="Instagram"
                className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
