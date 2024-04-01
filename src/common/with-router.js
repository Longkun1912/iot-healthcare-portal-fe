import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import authService from "../services/auth.service";

export const withRouter = (Component) => {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return <Component {...props} router={{ location, navigate, params }} />;
    }
    return ComponentWithRouterProp;
};
export const ProtectedRoute = ({ element, requiredRole }) => {
    const user = authService.getCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user's role matches the required role
        if (user != null && (Array.isArray(user.roles) && user.roles.includes(requiredRole))) {
            // Allow rendering the protected component
        } else {
            // Redirect to another route if the role doesn't match
            navigate('/unauthorized');
        }
    }, [navigate, user, requiredRole]);

    return element;
};