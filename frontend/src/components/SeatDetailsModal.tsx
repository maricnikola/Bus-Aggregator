import React from 'react';
import { useTranslation } from 'react-i18next';

type SeatDetailsModalProps = {
    totalSeats: number;
    availableSeats: number;
    onClose: () => void;
};

const SeatDetailsModal: React.FC<SeatDetailsModalProps> = ({ totalSeats, availableSeats, onClose }) => {
    const { t } = useTranslation();

    return (
        <div className="popup" style={{ position: 'absolute', top: '-150%', left: '50%', transform: 'translateX(-50%)' }}>
            <div className="popup-content">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <h3>{t('seatsDetails')}</h3>
                <p>{t('seatsTotal')}: {totalSeats}</p>
                <p>{t('seatsAvailable')}: {availableSeats}</p>
            </div>
        </div>
    );
};

export default SeatDetailsModal;
