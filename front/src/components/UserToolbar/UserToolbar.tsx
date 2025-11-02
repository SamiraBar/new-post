import { useState } from "react";
import logo from "../../assets/logo/newPostLogo.jpeg";
import "./styles/UserToolbar.css";
import "./styles/UserToolbarAdaptive.css";

const UserToolbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="container flex items-center justify-between user-toolbar-main flex-wrap">
      <a href="#">
        <img
          src={logo}
          alt="New Post logo"
          width="200"
          height="120"
          className="user-toolbar-logo"
        />
      </a>

      <button
        className={`burger-menu ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul
        className={`flex items-center justify-around list-none links-list flex-wrap ${
          isMenuOpen ? "active" : ""
        }`}
      >
        <li>
          <a href="#" onClick={() => setIsMenuOpen(false)}>
            Маанилуу маалымат
            <br />
            Важная информация
          </a>
        </li>
        <li>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>
                Биз жонундо
                <br />О компании
            </a>
        </li>
        <li>
          <a href="#" onClick={() => setIsMenuOpen(false)}>
            Байланыштар
            <br />
            Контакты
          </a>
        </li>
      </ul>
      <a href="#" className="link-wa">
        whatsapp
      </a>
    </div>
  );
};

export default UserToolbar;
