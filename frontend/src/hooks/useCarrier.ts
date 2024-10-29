import { useEffect, useState } from "react";
import { Carrier } from "../models/Carrier";
import { OptionType } from "../models/OptionType";
import api from "../api";
import { GET_CARRIERS_URL } from "../urls";


const useCarriers = () => {
    const [carriers, setCarriers] = useState<Carrier[]>([]);
    const [carrierOptions, setCarrierOptions] = useState<OptionType[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCarriers = async () => {
            try {
                const res = await api.get(GET_CARRIERS_URL);
                setCarriers(res.data.results);
            } catch (err) {
                setError("Failed to load providers");
            }
        };
        fetchCarriers();
    }, []);

    useEffect(() => {
        if (carriers && carriers.length > 0) {
            const newOptions = carriers.map((carrier) => ({
                value: carrier.name,
                label: carrier.name
            }));
            setCarrierOptions(newOptions);
        }
    }, [carriers]);

    return { carrierOptions };
};

export default useCarriers;