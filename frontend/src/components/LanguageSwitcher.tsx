import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        <div className="dropdown">
            <select onChange={changeLanguage} defaultValue={i18n.language} className="language-switcher">
                <option value="en">English</option>
                <option value="sr">Srpski</option>
            </select>
        </div>
    );
};

export default LanguageSwitcher;
