import {useAuth} from "../../Context/useAuth.tsx";
import {Navigate, useLocation} from "react-router-dom";
import {ReactNode} from "react";

interface Props {
    children: ReactNode;
}

/*
* If the user is not logged in, lead the user to log in page.
* If the user is logged in, they cannot go to log in or register pages
* */
const ProtectedRoute = ({children}: Props) => {
    const location = useLocation();
    const { isLoggedIn } = useAuth();
    
    const reRoute = () => {
        if(isLoggedIn()) {
            if(location.pathname === '/login' || location.pathname === '/register') {
                return <Navigate to="/" state={{ from: location }} replace />;
            }
            return <>{children}</>;
        } else {
            if(location.pathname === '/login' || location.pathname === '/register'){
                return <>{children}</>;
            }
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
    }

    return (
        reRoute()
    );
}

export default ProtectedRoute;