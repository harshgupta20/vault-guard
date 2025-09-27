import { Navigate } from 'react-router';

// Replace with your real authentication logic
const isAuthenticated = () => {
    return !!localStorage.getItem('walletConnected');
};

const ProtectedRoute = ({ children }) => {

    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
