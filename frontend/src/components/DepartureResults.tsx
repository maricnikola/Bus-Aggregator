import { Departure } from "../models/Departure";
import { transformBusStation } from '../utilities/BusStationHelper';
import { formatDate } from "../utilities/DateHelper";

interface DepartureResultsProps {
    departures: Departure[];
    fetchDirections: (start_station: string, end_station: string) => void;
}

const DepartureResults = ({ departures, fetchDirections}: DepartureResultsProps) => {
    return (
        <ul className='departure-ul'>
            {departures.map(({ carrier, provider, start_station, end_station, departure_datetime, arrival_datetime, total_seats, available_seats, provider_website, price}) => (
                <li className='departure-li' onClick={() => fetchDirections(transformBusStation(start_station), transformBusStation(end_station))}>
                    <div>
                        <div className='carrier-provider-titles'>
                            <h3>Carrier: {carrier.name}</h3>
                            <h3>Provider: {provider.name}</h3>
                        </div>
                        <div className='departure-date-times-info'>
                            <p>Departure datetime: {formatDate(departure_datetime)} Arrival time: {formatDate(arrival_datetime)}</p>
                            <p>Price: {price}e</p>
                        </div>
                        <div className='seats-info'>
                            <p>Total seats: {total_seats}</p>
                            <p>Available seats: {available_seats}</p>
                        </div>
                        <p><a href={provider_website}>Buy tickets here</a></p>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default DepartureResults;