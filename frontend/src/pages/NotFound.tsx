import { useTranslation } from 'react-i18next';

function NotFound() {
    const { t } = useTranslation();
    return <div>
            <h1>{t('notFoundMessage')}</h1>
            <p>{t('notFoundDescription')}</p>
        </div>
}

export default NotFound;