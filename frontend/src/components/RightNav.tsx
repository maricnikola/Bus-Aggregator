import { BurgerProps } from './Burger';
import { Link } from 'react-router-dom';
import useUser from '../hooks/useUser';
import { FaRegUserCircle } from 'react-icons/fa';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import '../styles/RightNav.css'; 


const RightNav = ({ open }: BurgerProps) => {
    const {isAuthenticated, logout} = useUser();
    const { t } = useTranslation();

  return (
      <ul className={`options-container ${open ? 'open' : ''}`}>
        <li>
          <Link to="/departures">{t('departures')}</Link>
        </li>
        <li className="user-li" style={{ marginLeft: "20px" }}>
          <Link to={"/search"}>{t('search')}</Link>
        </li>
        {isAuthenticated && (
          <li className="user-li" style={{ marginLeft: '20px' }}>
            <Link to="/carriers-providers">{t('carriersProviders')}</Link>
          </li>
        )}
        {isAuthenticated ? (
          <li  style={{ marginLeft: '20px' }}>
            <Link className="user-li" to="/user-departures">
              <FaRegUserCircle size={25} color="#ffff" />
              <p>{t('user')}</p>
            </Link>
          </li>
        ) : (
          <li style={{ marginLeft: '20px' }}>
            <Link to="/login">{t('logIn')}</Link>
          </li>
        )}
        {isAuthenticated ? (
          <li style={{ marginLeft: '20px' }}>
            <a onClick={logout}>{t('logout')}</a>
          </li>
        ) : (
          <li style={{ marginLeft: '20px' }}>
            <Link to="/register">{t('register')}</Link>
          </li>
        )}
        <LanguageSwitcher />
      </ul>
    );
  };

export default RightNav