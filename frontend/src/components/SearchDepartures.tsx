import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { OptionType } from '../models/OptionType';
import useBusStations from '../hooks/useBusStations';


interface SearchDeparturesProps {
    handleSearch: (applyFilters: boolean) => void;
    updatePassengers: (numOfPassengers: string) => void;
    updateStartStation: (startStation: OptionType | null) => void;
    updateEndStation: (endStation: OptionType | null) => void;
    updateDepartureDate: (date: Date | undefined) => void;
}

const SearchDepartures = ({updateDepartureDate, updatePassengers, updateStartStation, updateEndStation, handleSearch}: SearchDeparturesProps) => {
    const { t } = useTranslation();
    const [numOfPassengers, setNumOfPassengers] = useState<string>("");
    const [departureDate, setDepartureDate] = useState<Date>();
    const { startStationsOptions, endStationsOptions } = useBusStations();
    const [selectedStartStation, setSelectedStartStation] = useState<OptionType | null>(null);
    const [selectedEndStation, setSelectedEndStation] = useState<OptionType | null>(null);

    useEffect(() => {
        updatePassengers(numOfPassengers);
    }, [numOfPassengers]);
    
    useEffect(() => {
        updateStartStation(selectedStartStation);
    }, [selectedStartStation]);
    
    useEffect(() => {
        updateEndStation(selectedEndStation);
    }, [selectedEndStation]);
    
    useEffect(() => {
        updateDepartureDate(departureDate);
    }, [departureDate]);

    const handleChangeStartStations = (option: OptionType | null) => {
        setSelectedStartStation(option);
    };
    const handleChangeEndStations = (option: OptionType | null) => {
        setSelectedEndStation(option);
    };

    return <div>
            <form className='search-form-container'>
                <input className='search-form-input' type="date" value={departureDate ? departureDate.toISOString().substring(0, 10) : ''}
                onChange={(e) => setDepartureDate(new Date(e.target.value))}  placeholder={t('departurePlaceholder')}  name="startDate" />
                <Select
                    className='select-station'
                    value={selectedStartStation}
                    onChange={handleChangeStartStations}
                    options={startStationsOptions}
                    isSearchable={true}  
                    placeholder={t('startStationPlaceholder')}
                />
                <Select
                className='select-station'
                    value={selectedEndStation}
                    onChange={handleChangeEndStations}
                    options={endStationsOptions}
                    isSearchable={true}  
                    placeholder={t('endStationPlaceholder')}
                />
                <input className="search-form-input" type="number" min="0" value={numOfPassengers} 
                onChange={(e) => setNumOfPassengers(e.target.value)} placeholder={t("numberOfPassengersPlaceholder")}></input>
                <button type='button' onClick={(e) => handleSearch(false)} className='search-button'>{t('search')}</button>
            </form>
        </div>
}

export default SearchDepartures;