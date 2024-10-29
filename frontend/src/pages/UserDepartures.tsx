import { useTranslation } from 'react-i18next';
import useUser from '../hooks/useUser';
import { useEffect, useState } from 'react';
import { GET_USER_DEPARTURE_URL, GET_USER_LOCATION_URL } from '../urls';
import api from '../api';
import { BusStation, Departure } from '../models/Departure';
import { Location } from '../models/Location';
import { transformBusStation } from '../utilities/BusStationHelper';
import { formatDate } from '../utilities/DateHelper';
import { DirectionsRenderer, GoogleMap, useJsApiLoader  } from '@react-google-maps/api';
import { useMyGoogleMap } from '../hooks/useMyGoogleMap';
import { useNavigate } from 'react-router-dom';

function UserDepartures() {
    const { t } = useTranslation();
    const {userId,setUserIdFromStorage} = useUser();
    const [userLocation, setUserLocation] = useState<Location>();
    const [error, setError] = useState<string | null>(null);
    const [userDepartures, setUserDepartures] = useState<Departure[]>([])
    const {directions, reloadKey, fetchDirections} = useMyGoogleMap();
    const [isCardClicked, setIsCardClicked] = useState<boolean>(false);
    const [clickedDepartureId, setClickedDepartureId] = useState<number>();
    const navigate = useNavigate();


    useEffect(() => {
        setUserIdFromStorage();
        const fetchLocation = async () => {
            try {
                const result = await api.get(`${GET_USER_LOCATION_URL}${userId}`);
                setUserLocation(result.data);
            } catch (err) {
                setError("Failed to load user location");
            }
        };
        fetchLocation();
    }, []);

    useEffect(() => {
        const fetchUserDepartures = async () => {
            try{
                const result = await api.post(GET_USER_DEPARTURE_URL,userLocation,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setUserDepartures(result.data);

            }catch(error){
                setError("Falied to load user departures")
            }
        }
        
        fetchUserDepartures();
        
    },[userLocation])

    const handleClickOnDepartureCard = (start_station: BusStation, end_station: BusStation, departureId: number) => {
        setIsCardClicked(true);
        setClickedDepartureId(departureId);
        fetchDirections(transformBusStation(start_station), transformBusStation(end_station));
    }

    useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['geometry', 'drawing','places'],
    });


    const handleSearch = () =>{
        const departure = userDepartures.find(departure => departure.id === clickedDepartureId);
        if(departure){
            const startBusStation = transformBusStation(departure.start_station);
            const endBusStation = transformBusStation(departure.end_station);
            navigate(`/departures?start_station=${startBusStation}&end_station=${endBusStation}&departure_datetime=${departure?.departure_datetime}`);
        }
    }
    
    
    return <div className='main-container-user-dep'>
            
            <div className='results-container'>
                
                <div className='user-departures-container'>
                    <h2>My departures</h2>
                    <ul className='departure-ul'>
                        {userDepartures.map(({id, carrier, provider, start_station, end_station, departure_datetime, arrival_datetime, total_seats, available_seats, provider_website, price}) => (
                        <li className='departure-li' onClick={() => handleClickOnDepartureCard(start_station, end_station, id )}>
                            <div className='carrier-provider-titles'>
                                <h3>Carrier: {carrier.name}</h3>
                                <h3>Provider: {provider.name}</h3>
                            </div>
                            <h3>Cheapest price: {price}</h3>

                            <div className='departure-date-times-info'>
                                <p>Departure datetime: {formatDate(departure_datetime)} Arrival time: {formatDate(arrival_datetime)}</p>
                            </div>
                            <div className='seats-info'>
                                <p>Total seats: {total_seats}</p>
                                <p>Available seats: {available_seats}</p>
                            </div>
                            <div className='seats-info'>
                                <p>Start station: {transformBusStation(start_station)} - End station: {transformBusStation(end_station)}</p>
                                
                            </div>
                            <p>Buy tickets: {provider_website}</p>

                        </li>
                            ))}
                    
                    </ul>
                </div>
                {isCardClicked && (
                    <div className='map-container google-map-container'>
                    <GoogleMap id='google-map'
                                key={reloadKey} 
                                zoom={10}
                            >
                                {directions && <DirectionsRenderer directions={directions} />}
                    </GoogleMap>
                    <button onClick={handleSearch} className='search-user-route-button'>Search this route</button>
                </div>
                )}
                
            </div>
            
        </div>
}

export default UserDepartures;