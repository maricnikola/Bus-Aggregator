import { useState, useEffect } from 'react';
import { GET_BUS_STATIONS_URL } from '../urls';
import api from '../api';
import { transformBusStation } from '../utilities/BusStationHelper';
import { BusStation } from '../models/Departure';
import { OptionType } from '../models/OptionType';

const useBusStations = () => {
    const [busStations, setBusStations] = useState<BusStation[]>([]);
    const [startStationsOptions, setStartStationsOptions] = useState<OptionType[]>([]);
    const [endStationsOptions, setEndStationsOptions] = useState<OptionType[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBusStations = async () => {
            try {
                const res = await api.get(GET_BUS_STATIONS_URL);
                setBusStations(res.data.results);
            } catch (err) {
                setError("Failed to load bus stations");
            }
        };
        fetchBusStations();
    }, []);

    useEffect(() => {
        if (busStations && busStations.length > 0) {
            const newOptions = busStations.map((station) => ({
                value: transformBusStation(station),
                label: transformBusStation(station)
            }));
            setStartStationsOptions(newOptions);
            setEndStationsOptions(newOptions);
        }
    }, [busStations]);

    return { startStationsOptions, endStationsOptions, error };
};

export default useBusStations;
