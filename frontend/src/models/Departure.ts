import { Location } from "./Location";

export interface Departure{
    id:number;
    carrier:CarrierForDeparture;
    provider:ProviderForDeparture;
    start_station:BusStation;
    end_station:BusStation;
    departure_datetime:Date;
    arrival_datetime:Date;
    total_seats:number;
    available_seats:number;
    provider_website:string;
    price:number;
}

interface CarrierForDeparture{
    id:string;
    name:string;
}
interface ProviderForDeparture{
    id:string;
    name:string;
}

export interface BusStation{
    name:string;
    location: Location;
    longitude:number;
    latitude:number;
}