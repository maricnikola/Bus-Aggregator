import { useEffect, useState } from "react";
import { Departure } from "../models/Departure";
import { transformBusStation } from "../utilities/BusStationHelper";
import { calculateHoursDifference, compareTimeWithDate, isSameDate } from "../utilities/DateHelper";
import { SEARCH_URL } from "../urls";
import api from "../api";
import { OptionType } from "../models/OptionType";
import "../styles/UserDepartures.css"

interface UseDeparturesProps{
    departure: Departure | null; 
    numOfPassengers: string;
    selectedStartStation: OptionType | null;
    selectedEndStation: OptionType | null;
    departureDate: Date | undefined;
    filterButtonClicked: Boolean;
    setFilterButtonClicked: (clicked: boolean) => void;
    setSearchButtonClicked: (clicked: boolean) => void;
    fetchDirections: (startStation: string, endStation: string) => void;
    selectedCarrier?: OptionType | null;
    minTime: string;
    maxTime: string;
    minDuration: string;
    maxDuration: string;
}

const useDepartures = ({departure, numOfPassengers, selectedStartStation, selectedEndStation, departureDate, filterButtonClicked, setFilterButtonClicked,
    setSearchButtonClicked, fetchDirections, selectedCarrier, minTime, maxTime, minDuration, maxDuration
}: UseDeparturesProps) => {    
    const [error, setError] = useState<string | null>(null);
    const [departures, setDepartures] = useState<Departure[]>([]);

    const isConditionForFilterInvalid = (departure: Departure) => {
        return (
          (selectedCarrier?.value && departure.carrier.name !== selectedCarrier.value) ||
          (minTime.trim() !== "" && !compareTimeWithDate(minTime, departure.arrival_datetime)) ||
          (maxTime.trim() !== "" && compareTimeWithDate(maxTime, departure.arrival_datetime)) ||
          (minDuration.trim() !== "" && Number(minDuration) > calculateHoursDifference(departure.departure_datetime, departure.arrival_datetime)) ||
          (maxDuration.trim() !== "" && Number(maxDuration) < calculateHoursDifference(departure.departure_datetime, departure.arrival_datetime))
        );
    };

    useEffect(() => {
        if (!departure) return;
        
        const isExisting = departures.some((d) => d.id === departure?.id);
            
        if (!isExisting &&
            Number(numOfPassengers) < departure.available_seats &&
            transformBusStation(departure?.start_station) === selectedStartStation?.value.toString() &&
            transformBusStation(departure?.end_station) === selectedEndStation?.value.toString() &&
            isSameDate(new Date(departure.departure_datetime), departureDate || new Date())
        ) {
            if (filterButtonClicked) {
                if (!isConditionForFilterInvalid(departure)) {
                    setDepartures([...departures, departure]);
                }
            } else {
                setDepartures([...departures, departure]);
            }
        }
    
      },[departure]);

    const handleSearch  = async (applyFilters: boolean)=>{
        const formattedDate = departureDate?.toISOString().split('T')[0];
        setSearchButtonClicked(true);
        setFilterButtonClicked(applyFilters);
        if(selectedStartStation && selectedEndStation){
            fetchDirections(selectedStartStation.value , selectedEndStation.value);
            try {
                const res= await api.get(SEARCH_URL, {
                    params: {
                        departure_date: formattedDate,
                        start_station: selectedStartStation.value.split(" ")[0].trim().toString(),
                        end_station: selectedEndStation.value.split(" ")[0].trim().toString(),
                        passenger_count: numOfPassengers,
                        apply_filters: applyFilters,
                        ...(selectedCarrier?.value && {carrier: selectedCarrier.value}),
                        ...(minTime.trim() !== "" && {time_from: minTime}),
                        ...(maxTime.trim() !== "" && {time_to: maxTime}),
                        ...(minDuration.trim() !== "" && {duration_from: minDuration}),
                        ...(maxDuration.trim() !== "" && {duration_to: maxDuration}) 
                    }
                    });
                setDepartures(res.data);
                return Promise.resolve();
    
            } catch (error) {
                console.error('Error fetching data:', error);
                return Promise.reject(error); 
            }
        }
    }
    
    return { departures, handleSearch, error } ;
}

export default useDepartures;