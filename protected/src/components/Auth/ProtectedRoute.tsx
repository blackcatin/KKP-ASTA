import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    element: React.ReactElement;
    allowedRoles?: string[];
}

const ProtectedRoute = ({ element, allowedRoles = [] }: ProtectedRouteProps) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role || "")) {
        return <Navigate to="/unauthorized" replace />;
    }

    return element;
}

export default ProtectedRoute;