import "../styles/NavBar.css"
import { useTranslation } from 'react-i18next';
import Burger from "./Burger";

const Navbar = () => {
    const { t } = useTranslation();

    return (
        <nav>
            <h2>{t('appTitle')}</h2>
            <Burger/>
        </nav>
    );
};

export default Navbar;
