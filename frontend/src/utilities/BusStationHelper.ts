import { BusStation } from "../models/Departure";

export const transformBusStation = (busStation: BusStation) =>{
    return busStation.name + " " + busStation.location.name + ", " + busStation.location.country;
}