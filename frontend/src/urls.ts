const BASE_URL = import.meta.env.VITE_DJANGO_URL;

export const GET_CARRIERS_URL: string = "/api/carriers/";
export const GET_PROVIDERS_URL: string = "/api/providers/";
export const POST_REFRESH_TOKEN_URL: string = "/api/token/refresh/";
export const LOGIN_URL: string = "/api/token/";
export const REGISTER_URL: string = "api/user/register/";
export const SEARCH_URL: string = "/search/";
export const GET_BUS_STATIONS_URL: string = "/api/bus-stations/";
export const ADD_USER_LOCATION_URL: string = "/api/add-user-location/";
export const GET_USER_LOCATION_URL: string = "api/get-user-location/";
export const GET_USER_DEPARTURE_URL: string = "api/user-departures/";
export const SEARCH_URL_ABS: string = `${BASE_URL}/search/`;
