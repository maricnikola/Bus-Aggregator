import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import "../styles/Search.css"
import { SearchResult, FormData, initialFormData, Filters, initialFilters } from '../types';
import { SEARCH_URL_ABS } from '../urls'
import { formatTime } from '../utilities/DateHelper';
import SeatDetailsModal from '../components/SeatDetailsModal';


const Search = () => {
    const { t } = useTranslation();

    const [results, setResults] = useState<SearchResult[]>([]);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10); // Rezultati po stranici
    const [popupIndex, setPopupIndex] = useState<number | null>(null); // Stanje za pop-up

    const { departure_date, start_station, end_station, passenger_count } = formData;
    const { carrier, timeFrom, timeTo, durationFrom, durationTo } = filters;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        fetchResults(SEARCH_URL_ABS, formData);
    };

    const fetchResults = async (url: string, params: FormData = initialFormData) => {
        try {
            const response = await axios.get(url, { params });
            setResults(response.data);  // Svi rezultati bez paginacije sa backenda
            setCurrentPage(1);  // Reset paginacije kad dobijem nove rezultate
        } catch (error) {
            console.error('Error fetching search results', error);
        }
    };

    // Filtriranje i paginacija na frontendu
    const filteredResults = results.filter(({ carrier: resultCarrier, departure_datetime, arrival_datetime }) => {
        if (carrier && !resultCarrier.name.toLowerCase().includes(carrier.toLowerCase())) {
            return false;
        }
    
        const departureTime = new Date(departure_datetime).getHours();
        if (timeFrom && departureTime < parseInt(timeFrom)) {
            return false;
        }
        if (timeTo && departureTime > parseInt(timeTo)) {
            return false;
        }
    
        const duration = (new Date(arrival_datetime).getTime() - new Date(departure_datetime).getTime()) / 3600000;
        if (durationFrom && duration < parseInt(durationFrom)) {
            return false;
        }
        if (durationTo && duration > parseInt(durationTo)) {
            return false;
        }
    
        return true;
    });  

    const paginatedResults = filteredResults.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const totalPages = Math.ceil(filteredResults.length / pageSize);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const togglePopup = (index: number) => {
        setPopupIndex(popupIndex === index ? null : index);
    };

    return (
        <div>
            <div className='search'>   
            <h1>{t('searchTitle')}</h1> 
                <form onSubmit={handleSubmit} className="search-fields">
                    <input
                        type="date"
                        name="departure_date"
                        value={departure_date}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="start_station"
                        placeholder={t('startStationPlaceholder')}
                        value={start_station}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="end_station"
                        placeholder={t('endStationPlaceholder')}
                        value={end_station}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="passenger_count"
                        placeholder={t('numberOfPassengersPlaceholder')}
                        min="1"
                        value={passenger_count}
                        onChange={handleChange}
                    />
                    <button className='button-search-page' type="submit">{t('search')}</button>
                </form>
            </div>

            <div className='filter-results'>
                {/* Filters */}
                <div className='filters'>
                    <h2 className="h2-filters">{t('filterTitle')}</h2>
                    <div className="search-fields"> 
                        <label>{t('carrier')}</label>
                        <input
                            type="text"
                            name="carrier"
                            value={carrier}
                            onChange={handleFilterChange}
                        />
                        <label>{t('timePeriod')}</label>
                        <div>
                            <input
                                type="time"
                                name="timeFrom"
                                value={timeFrom}
                                onChange={handleFilterChange}
                                style={{ width: '55px', textAlign: 'center' }}
                            />
                            <input
                                type="time"
                                name="timeTo"
                                value={timeTo}
                                onChange={handleFilterChange}
                                style={{ width: '55px', textAlign: 'center' }}
                            />
                        </div>
                        <label>{t('duration')}</label>
                        <div>
                            <input
                                type="number"
                                name="durationFrom"
                                value={durationFrom}
                                onChange={handleFilterChange}
                                placeholder={t('durationMin')}
                                style={{ width: '55px' }}
                            />
                            <input
                                type="number"
                                name="durationTo"
                                value={durationTo}
                                onChange={handleFilterChange}
                                placeholder={t('durationMax')}
                                style={{ width: '55px' }}
                            />
                        </div>
                    </div>
                </div>
            
                {/* Results */}
                <div className='results'>
                    <h2>{t('resultsTitle')}</h2>
                    
                    {filteredResults.length === 0 ? (
                        // Ako nema rezultata, prikaži poruku
                        <p>{t('noResults')}</p>
                    ) : (
                        <>
                            <ul>
                                {paginatedResults.map((result, index) => (
                                    <li key={index} className="result-item" style={{ position: 'relative' }}>
                                        <span>{t('carrier')}: {result.carrier.name}</span> &nbsp;|&nbsp;
                                        <span>{t('departureAt')}: {formatTime(result.departure_datetime)}</span> &nbsp;|&nbsp;
                                        <span>{t('arrivalAt')}: {formatTime(result.arrival_datetime)}</span> &nbsp;|&nbsp;
                                        <a href={result.provider_website}>{t('buyHere')}</a> &nbsp;|&nbsp;

                                        {/* Za detalje */}
                                        <span 
                                            className="three-dots" 
                                            onClick={() => togglePopup(index)}
                                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                                        > {t('details')} </span>

                                        {/* Pop-up prozor */}
                                        {popupIndex === index && (
                                            <div className="popup" style={{ position: 'absolute', top: '-150%', left: '50%', transform: 'translateX(-50%)' }}>
                                                <SeatDetailsModal
                                                    totalSeats={result.total_seats}
                                                    availableSeats={result.available_seats}
                                                    onClose={() => setPopupIndex(null)}
                                                />
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            
                            {/* Paginacija samo ako ima rezultata */}
                            <div className="pagination-buttons">
                                <div className="button-container">
                                    {currentPage > 1 && (
                                        <button className='button-search-page' onClick={() => handlePageChange(currentPage - 1)}>{'◄'}</button>
                                    )}
                                    {currentPage < totalPages && (
                                        <button className='button-search-page' onClick={() => handlePageChange(currentPage + 1)}>{'►'}</button>
                                    )}
                                </div>
                            
                                {/* Prikaz stranica ako ima rezultata */}
                                <p className="page-info">{t('page')} {currentPage} {t('of')} {totalPages}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;