import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { OptionType } from '../models/OptionType';
import useCarriers from '../hooks/useCarrier';

interface FilterDeparturesProps {
    updateCarrier: (carrier: OptionType | null) => void;
    updateMinTime: (minTime: string) => void;
    updateMaxTime: (maxTime: string) => void;
    updateMinDuration: (minDuration: string) => void;
    updateMaxDuration: (maxDuration: string) => void;
    handleSearch: (applyFilters: boolean) => void;
}

const FilterDepartures = ({updateCarrier, updateMinTime, updateMaxTime, updateMinDuration, updateMaxDuration, handleSearch} : FilterDeparturesProps) =>  {
    const { t } = useTranslation();
    const [selectedCarrier, setSelectedCarrier] = useState<OptionType | null>(null);
    const { carrierOptions } = useCarriers();
    const [minTime, setMinTime] = useState<string>("");
    const [maxTime, setMaxTime] =  useState<string>("");
    const [minDuration, setMinDuration] = useState<string>("");
    const [maxDuration, setMaxDuration] = useState<string>("");
    const [error, setError] = useState<string>('');

    useEffect(() => {
        updateCarrier(selectedCarrier);
    }, [selectedCarrier]);
    
    useEffect(() => {
        updateMinTime(minTime);
    }, [minTime]);
    
    useEffect(() => {
        updateMaxTime(maxTime);
    }, [maxTime]);
    
    useEffect(() => {
        updateMinDuration(minDuration);
    }, [minDuration]);

    useEffect(() => {
        updateMaxDuration(maxDuration);
    }, [maxDuration]);

    const handleChangeCarrier = (option: OptionType | null) => {
        setSelectedCarrier(option);
    };

    return  <div className='filter-container'>
                <Select
                className='select-carrier'
                value={selectedCarrier}
                onChange={handleChangeCarrier}
                options={carrierOptions}
                isSearchable={true}  
                placeholder={t('carrierPlaceholder')}
                />
                <input value={minTime} onChange={(e) => setMinTime(e.target.value)} className='time-input' type='time'></input>
                <input value={maxTime} onChange={(e) => setMaxTime(e.target.value)} className='time-input' type='time'></input>
                <input value={minDuration} onChange={(e) => setMinDuration(e.target.value)} className='duration-input' type='number' placeholder={t('minDuration')} min="0"></input>
                <input value={maxDuration} onChange={(e) => setMaxDuration(e.target.value)} className='duration-input' type='number' placeholder={t('maxDuration')} min="0"></input>
                <button type='button' onClick={(e) => handleSearch(true)} className='apply-filter-button'>{t('applyFilters')}</button>
            </div>
}

export default FilterDepartures;