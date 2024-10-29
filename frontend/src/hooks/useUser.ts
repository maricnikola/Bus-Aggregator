import { useEffect} from 'react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { jwtDecode } from 'jwt-decode';
import { UserCredentials, UserInfo } from '../models/User';
import { useUserContext } from '../context/UserContext';
import { ADD_USER_LOCATION_URL, LOGIN_URL, POST_REFRESH_TOKEN_URL, REGISTER_URL } from '../urls';
import { Location } from '../models/Location';

interface JwtPayload {
  user_id: number; 
}

const useUser = () =>   {
  const { isAuthenticated, setIsAuthenticated, userId, setUserId} = useUserContext(); 
  const navigate = useNavigate();

  useEffect(() => {
    try{
      auth();
    }catch{
      setIsAuthenticated(false)
    }

    window.addEventListener("storage", () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => {
      window.removeEventListener("storage", () => {});
    };
  }, []);
  
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post(POST_REFRESH_TOKEN_URL, {
          refresh: refreshToken
      });
      if(res.status === 200){
          localStorage.setItem(ACCESS_TOKEN, res.data.access);
          setIsAuthenticated(true);
      }else{
        setIsAuthenticated(false);
      }
    }
    catch (error) {
      console.log(error);
      setIsAuthenticated(false);
    }
  }
  const auth = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token){
      setIsAuthenticated(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp || 0;
    const now = Date.now() / 1000;

    if (tokenExpiration < now){
      refreshToken();
    }
    else{
      setIsAuthenticated(true);
    }
  }
  
  
  const login  = async (userCredentials:UserCredentials) => {
    try {
      const res = await api.post(LOGIN_URL,{
        username: userCredentials.username,
        password: userCredentials.password
      });
      const accesToken = res.data.access;
      const decodedToken = jwtDecode<JwtPayload>(accesToken);
      setUserId(decodedToken.user_id)
      
      localStorage.setItem(ACCESS_TOKEN, accesToken);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

      window.dispatchEvent(new Event("storage"));

      navigate("/departures");

    } catch (error) {
        alert(error);
    }
      
  };
  const setUserIdFromStorage = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if(token){
      const decodedToken = jwtDecode<JwtPayload>(token);
      setUserId(decodedToken.user_id)
    }
  }

  const logout = () => {
      localStorage.clear();
      setIsAuthenticated(false);
      setUserId(null);
      navigate("/login"); 
    };

  const register = async (userInfo: UserInfo) => {
    try {
      
      let response = await api.post(REGISTER_URL, userInfo);
      const userId = await response.data.id;
      navigate("/login");
      return userId;

    } catch (error) {
        alert(error);
    }
  }
  const addUserLocation = async (userId: number, locationData: Location) => {
    try{
      const response = await api.post(ADD_USER_LOCATION_URL, {
        user_id: userId,   
        location: {        
            name: locationData.name,
            country: locationData.country
        }
    });

    }catch (error){
      alert(error);
    }
    
  };

  return {isAuthenticated, userId, login, logout, register, addUserLocation, setUserIdFromStorage};
};

export default useUser;