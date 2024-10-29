import { Navigate } from "react-router-dom";
import React, { ReactNode } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import useUser from "../hooks/useUser";


const ProtectedRoute = ({children}: { children: ReactNode }) => {
    const {isAuthenticated} = useUser();
    const isLoginPage = React.isValidElement(children) && children.type === Login;
    const isRegisterPage = React.isValidElement(children) && children.type === Register;
    let isLoginOrRegister: boolean = isLoginPage || isRegisterPage;

    if (isAuthenticated && isLoginOrRegister) return <Navigate to="/departures" />;
    else if(!isAuthenticated && !isLoginOrRegister) return <Navigate to="/login" />;
    return children;
}

export default ProtectedRoute;