import { useEffect, useState } from "react";
import { Carrier } from "../models/Carrier";
import { Provider } from "../models/Provider";
import api from '../api';
import "../styles/Carriers.css"
import { GET_CARRIERS_URL, GET_PROVIDERS_URL } from "../urls";
import { useTranslation } from 'react-i18next';

function CarriersProvidersList() {
    const { t } = useTranslation();
    const [carriers, setCarriers] = useState<Carrier[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [error, setError] = useState<string>('');
    
    useEffect(() => {
        const fetchCarriers = async () => {
            try{
                const res = await api.get(GET_CARRIERS_URL);
                setCarriers(res.data.results);
            }catch (err) {
                setError("Failed to load carriers");
            }
        };
        fetchCarriers();
    }, []);

    useEffect(() => {
        const fetchProviders = async () => {
            try{
                const res = await api.get(GET_PROVIDERS_URL);
                setProviders(res.data.results);
            }catch (err) {
                setError("Failed to load providers");
            }
        };
        fetchProviders();
    },[]);
    

    return <div >
                <div className="list-container">
                    <h2>{t('carriersList')}</h2>
                    <ul>
                        {carriers.map(({id, name, logo, headquarters, phone, contact_person, email }) => (
                            <div className="carrier-record">
                                <img src={logo}/>
                                <li key={id}>
                                    <h4>{t('name')}: {name}</h4>
                                    <div className="carrier-info">
                                        <p>{t('headquarters')}: {headquarters?.name}, {headquarters?.country}  </p>
                                        <p>{t('phone')}: {phone}</p>
                                        <p>{t('contactPerson')}: {contact_person}</p>
                                    </div>
                                    <p>{t('email')}: {email}</p>
                                </li> 
                            </div>
                            
                        ))}
                    </ul>
                </div>
                <div className="list-container">
                <h2>{t('providersList')}</h2>
                    <ul>
                        {providers.map(({id, name, headquarters, phone, contact_person, email }) => (
                            <li className="provider-li" key={id}>
                                <div className="provider-info">
                                    <h4>{t('name')}: {name}</h4>
                                    <div className="provider-contact-info">
                                        <p>{t('headquarters')}: {headquarters?.name}, {headquarters?.country}</p>
                                        <p>{t('phone')}: {phone}</p>
                                        <p>{t('contactPerson')}: {contact_person}</p>
                                    </div>
                                    <p>{t('email')}: {email}</p>
                                </div>
                                
                                
                            </li> 
                        ))}
                    </ul>
                </div>
            </div>
}

export default CarriersProvidersList;