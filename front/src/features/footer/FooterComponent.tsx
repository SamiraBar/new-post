import { useEffect, useState } from 'react';
import logoDark from '../../assets/logo/logo.png';
import logoKg from '../../assets/logo/newpost_logo01.png';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axiosApi from '@/axiosApi';

interface SocialNetwork {
  _id: string;
  name: string;
  url: string;
  icon: string;
  order: number;
}

const FooterComponent = () => {
  const { t, i18n } = useTranslation();
  const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>([]);

  useEffect(() => {
    const loadSocials = async () => {
      try {
        const { data } = await axiosApi.get('/social-networks');
        setSocialNetworks(data.socialNetworks || []);
      } catch (error) {
        console.error('Failed to load social networks:', error);
      }
    };

    void loadSocials();
  }, []);

  const logoByLang = i18n.resolvedLanguage === 'kg' ? logoKg : logoDark;

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
              src={logoByLang}
              alt="New Post logo"
              className="h-14 sm:h-16 w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </Link>
        </div>

        <div className="text-sm leading-relaxed space-y-1 text-neutral-300">
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
              href="mailto:janypochta.kg@gmail.com"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              janypochta.kg@gmail.com
            </a>
          </p>
        </div>

        <div className="flex items-center gap-4">
          {socialNetworks.length > 0
            ? socialNetworks.map((social) => (
                <a
                  key={social._id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
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
                    group-hover:border-amber-500/70
                  "
                  >
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${social.icon}`}
                      alt={social.name}
                      className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </a>
              ))
            : null}
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
