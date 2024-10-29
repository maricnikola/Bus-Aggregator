import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css"
import { UserCredentials } from "../models/User";
import { useTranslation } from 'react-i18next'; 
import useUser from "../hooks/useUser";


function Login() {
    const { t } = useTranslation();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isFormValid, setIsFormValid] = useState<boolean>(true);
    const {login} = useUser();
    const navigate = useNavigate();

    const handleClickSignUp = () => {
        navigate('/register'); 
    };

    const validateForm = () => {
        if ( !username?.trim() || !password?.trim()) {
            setIsFormValid(false);
            return false;
        }
        return true;
      };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if(!validateForm()){
            return;
        }
        const user: UserCredentials = {
            username: username,
            password: password
        }
        login(user);
    }

    return <div>
            <form onSubmit={handleSubmit} className="form-container">
            <h1>{t('loginTitle')}</h1>
            <input className="form-input" type="text" value={username} 
            onChange={(e) => setUsername(e.target.value)} placeholder={t('usernamePlaceholder')}></input>
            <input className="form-input" type="password" value={password} 
            onChange={(e) => setPassword(e.target.value)} placeholder={t('passwordPlaceholder')}></input>
            {!isFormValid && <p style={{ color: "red" }}>{t('invalidFormMessage')}</p>}

            <div className="text-bellow-login">
                <p>{t('noAccountMessage')}</p>  
                <p onClick={handleClickSignUp} style={{ cursor: 'pointer' }}>
                    {t('createAccount')}
                </p></div>
            <button className="form-button" type="submit">{t('submitButton')}</button>
            </form>
        </div>
}

export default Login;