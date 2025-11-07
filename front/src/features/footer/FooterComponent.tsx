import logo from '../../assets/logo/newPostLogo.jpeg';
import whatsappIcon from '../../assets/cosialIcons/whatsapp.png';
import instagramIcon from '../../assets/cosialIcons/instagram.png';
import facebookIcon from '../../assets/cosialIcons/facebook.png';

const FooterComponent = () => {
  return (
    <footer className="w-full mt-10 py-6 px-4">
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
          <p>“ЖАНЫ ПОЧТА” ЖЧК Бишкек шаары, Лев Толстой көчөсү, 24/1</p>
          <p>ОСОО “Новая Почта”, г. Бишкек, ул. Льва Толстого 24/1</p>
          <p>
            Телефон:{' '}
            <a href="tel:+996778465557" className="hover:text-blue-600">
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
            href="https://wa.me/996778465557"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <img
              src={whatsappIcon}
              alt="WhatsApp"
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 transition-transform hover:scale-110"
            />
          </a>

          <a
            href="https://www.instagram.com/your_instagram_here"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <img
              src={instagramIcon}
              alt="Instagram"
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 transition-transform hover:scale-110"
            />
          </a>

          <a
            href="https://www.facebook.com/your_facebook_here"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <img
              src={facebookIcon}
              alt="Facebook"
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 transition-transform hover:scale-110"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
