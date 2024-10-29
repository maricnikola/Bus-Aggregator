import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css"
import { UserInfo } from "../models/User";
import { useTranslation } from 'react-i18next';
import useUser from "../hooks/useUser";
import { Location } from "../models/Location";

function Register() {
    const { t } = useTranslation();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [userCity, setUserCity] = useState<string>("");
    const [userCountry, setUserCountry] = useState<string>("");
    const {register, addUserLocation} = useUser();
    const navigate = useNavigate();

    const [isFormValid, setIsFormValid] = useState<boolean>(true);

    const handleClickSignIn = () => {
        navigate('/login'); 
    };


    const validateForm = () => {
        if ( !username?.trim() || !password?.trim() || !passwordConfirm?.trim() || !firstName?.trim() || !lastName?.trim()  ||  !email?.trim() ) {
          return false;
        }
        if(password?.trim() !== passwordConfirm?.trim()){
            return false;
        } 
        return true;
      };
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if(!validateForm()){
            setIsFormValid(false);
            return;
        }
        const userInfo: UserInfo = {
            username: username,
            password: password,
            password_confirm: passwordConfirm,
            first_name: firstName,
            last_name: lastName,
            email: email
        }
        const userLocation: Location = {
            name: userCity,
            country: userCountry
        }
        const userId = await register(userInfo);
        addUserLocation(userId, userLocation);
    }   

    return <div>
            <form onSubmit={handleSubmit} className="form-container">
            <h1>{t('registrationTitle')}</h1>
            <input className="form-input" type="text" value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} placeholder={t('firstNamePlaceholder')}></input>
            <input className="form-input" type="text" value={lastName} 
            onChange={(e) => setLastName(e.target.value)} placeholder={t('lastNamePlaceholder')}></input>
            <input className="form-input" type="text" value={email} 
            onChange={(e) => setEmail(e.target.value)} placeholder={t('emailPlaceholder')}></input>
            <input className="form-input" type="text" value={username} 
            onChange={(e) => setUsername(e.target.value)} placeholder={t('usernamePlaceholder')}></input>
            <div className="location-container">
                <input className="location-input" type="text" value={userCity} 
                onChange={(e) => setUserCity(e.target.value)} placeholder="City"></input>
                <input className="location-input" type="text" value={userCountry} 
                onChange={(e) => setUserCountry(e.target.value)} placeholder="Country"></input>
            </div>
            <input className="form-input" type="password" value={password} 
            onChange={(e) => setPassword(e.target.value)} placeholder={t('passwordPlaceholder')}></input>
            <input className="form-input" type="password" value={passwordConfirm} 
            onChange={(e) => setPasswordConfirm(e.target.value)} placeholder={t('confirmPasswordPlaceholder')}></input>
            {!isFormValid && <p style={{ color: "red" }}>{t('invalidFormMessage')}</p>}
            <div className="text-bellow-login">
                <p>{t('alreadyHaveAccount')}</p>  
                <p onClick={handleClickSignIn} style={{ cursor: 'pointer' }}>
                    {t('logIn')}
                </p></div>
            <button className="form-button" type="submit">{t('submitButton')}</button>
            </form>
        </div>
}

export default Register;