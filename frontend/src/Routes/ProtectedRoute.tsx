import {useAuth} from "../../Context/useAuth.tsx";
import {Navigate, useLocation} from "react-router-dom";
import {ReactNode} from "react";

interface Props {
    children: ReactNode;
}

const ProtectedRoute = ({children}: Props) => {
    const location = useLocation();
    const { isLoggedIn } = useAuth();

    return (
        isLoggedIn() ? <>{children}</> : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default ProtectedRoute;