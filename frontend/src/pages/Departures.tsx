import { useTranslation } from 'react-i18next';
import useWebSocket from '../hooks/useWebSocket';
import { useEffect, useState } from 'react';
import "../styles/Departure.css"
import { DirectionsRenderer, GoogleMap, useJsApiLoader  } from '@react-google-maps/api';
import SearchDepartures from '../components/SearchDepartures';
import { OptionType } from '../models/OptionType';
import FilterDepartures from '../components/FilterDepartures';
import DepartureResults from '../components/DepartureResults';
import useDepartures from '../hooks/useDepartures';
import { useMyGoogleMap } from '../hooks/useMyGoogleMap';
import { useSearchParams } from 'react-router-dom';

function Departures() {
    const { t } = useTranslation();
    const {departure} = useWebSocket(import.meta.env.VITE_ASGI_SERVER_URL);
    const [departureDate, setDepartureDate] = useState<Date>();
    const [numOfPassengers, setNumOfPassengers] = useState<string>("");
    const [selectedStartStation, setSelectedStartStation] = useState<OptionType | null>(null);
    const [selectedEndStation, setSelectedEndStation] = useState<OptionType | null>(null);
    const [searchButtonClicked, setSearchButtonClicked] = useState<Boolean>(false);
    const [filterButtonClicked, setFilterButtonClicked] = useState<Boolean>(false);
    const [selectedCarrier, setSelectedCarrier] = useState<OptionType | null>(null);
    const [minTime, setMinTime] = useState("");
    const [maxTime, setMaxTime] =  useState("");
    const [minDuration, setMinDuration] = useState("");
    const [maxDuration, setMaxDuration] = useState("");
    const [searchParams] = useSearchParams();
    const {directions, reloadKey, fetchDirections} = useMyGoogleMap();
    const [isSearchRouteFromUserPage, setIsSearchRouteFromUserPage] = useState<boolean>(false);
    const { departures, handleSearch } = useDepartures({
        departure,
        numOfPassengers,
        selectedStartStation,
        selectedEndStation,
        departureDate,
        filterButtonClicked,
        setFilterButtonClicked,
        setSearchButtonClicked,
        fetchDirections,
        selectedCarrier,
        minTime,
        maxTime,
        minDuration,
        maxDuration,
    });

    const updatePassengers = (passengers: string) => setNumOfPassengers(passengers);
    
    const updateStartStation = (startStation: OptionType | null) => setSelectedStartStation(startStation);

    const updateEndStation = (endStation: OptionType | null) => setSelectedEndStation(endStation);

    const updateDepartureDate = (date: Date | undefined) => setDepartureDate(date);

    const updateCarrier = (carrier: OptionType | null) => setSelectedCarrier(carrier);

    const updateMinTime = (minTime: string) => setMinTime(minTime);

    const updateMaxTime = (maxTime: string) => setMaxTime(maxTime);
    
    const updateMaxDuration = (maxDuration: string) => setMaxDuration(maxDuration);

    const updateMinDuration = (minDuration: string) => setMinDuration(minDuration);

    useEffect(() =>{
        const search = async () => {
            if(searchParams){
                const startStation = searchParams.get('start_station');
                const endStation = searchParams.get('end_station');
                const departureDatetime = searchParams.get('departure_datetime');
                if(startStation && endStation && departureDatetime){
                    setSelectedStartStation({value: startStation, label: startStation });
                    setSelectedEndStation({value: endStation, label: endStation});
                    setDepartureDate(new Date(departureDatetime));
                    setNumOfPassengers("1");
                    setIsSearchRouteFromUserPage(true);
                }
            }
        }
        search();
    },[])
    useEffect(() =>{
        
        const search = async () => {
            await handleSearch(false).then(result => {
                console.log(result); 
            })
        }
        search();
        
    },[isSearchRouteFromUserPage])

    useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['geometry', 'drawing','places'],
    });
       
    return <div>
                <div  className='departure-container'>
                    <h1>{t('realTimeData')}</h1>
                    <SearchDepartures
                        handleSearch={handleSearch}
                        updatePassengers={updatePassengers}
                        updateStartStation={updateStartStation}
                        updateEndStation={updateEndStation}
                        updateDepartureDate={updateDepartureDate}
                    />
                    {(departures.length !== 0 || filterButtonClicked) ? (
                    <div className='results-container'>
                        <div className='departure-search-results'>
                            <h3>{t('filterResults')}:</h3>
                            <FilterDepartures
                                updateCarrier={updateCarrier}
                                updateMinTime={updateMinTime}
                                updateMaxTime={updateMaxTime}
                                updateMinDuration={updateMinDuration}
                                updateMaxDuration={updateMaxDuration}
                                handleSearch={handleSearch}
                            />
                            {(departures.length !== 0 || !filterButtonClicked) ? 
                            (<DepartureResults
                                    departures={departures}
                                    fetchDirections={fetchDirections}
                                />) : 
                            (<div>
                                <h3>{t('noResults')}</h3>
                            </div>)}
                                
                        </div>
                        <div className='map-container'>                        
                            <GoogleMap id='google-map'
                                key={reloadKey} 
                                zoom={10}
                            >
                                {directions && <DirectionsRenderer directions={directions} />}
                            </GoogleMap>
                        </div>
                    </div>
                    ):(departures.length === 0 && searchButtonClicked && !filterButtonClicked) && 
                    (
                        <div>
                            <h2>{t('noResults')}</h2>
                        </div>
                    )
                    }  
                </div>
            </div>
}

export default Departures;