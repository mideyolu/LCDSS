import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode to decode the JWT token

const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            toast.error("You need to log in to access the dashboard.");
            navigate("/login");
            return;
        }

        // Decode the token
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Check if the token is expired
        if (decodedToken.exp < currentTime) {
            localStorage.removeItem("access_token");
            toast.error("Session expired. You need to log in again.");
            navigate("/login");
        } else {
            // Calculate the remaining time until the token expires
            const remainingTime = decodedToken.exp * 1000 - currentTime * 1000;

    
            // Set a timeout to log the user out after the remaining time
            const expirationTimeout = setTimeout(() => {
                localStorage.removeItem("access_token");
                toast.error("Session expired. You need to log in again.");
                navigate("/login");
            }, remainingTime);

            // Cleanup the timeout on component unmount
            return () => clearTimeout(expirationTimeout);
        }
    }, [navigate]);

    // Return anything else needed from the hook
};

export default useAuth;