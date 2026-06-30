import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = () => {
    const { token } = useAuth();

    if (token){
        return <Outlet />
    }

    return (
        <Navigate to="/login" replace />
    );
};

export default ProtectedRoute;