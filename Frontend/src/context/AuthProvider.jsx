import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const jwt = Cookies.get('jwt');
        const messengerData = localStorage.getItem('messenger');

        if (jwt && messengerData) {
            try {
                setAuthUser(JSON.parse(messengerData));
            } catch (error) {
                console.error("Failed to parse user data:", error);
                logout(); // Clear corrupted data
            }
        }
        setLoading(false); // Stop loading once auth check is done
    }, []);

    const login = (userData, jwt) => {
        setAuthUser(userData);
        Cookies.set('jwt', jwt, { expires: 1 });
        localStorage.setItem('messenger', JSON.stringify(userData));
    };

    const logout = () => {
        setAuthUser(null);
        Cookies.remove('jwt');
        localStorage.removeItem('messenger');
    };

    // Include setAuthUser in the context value
    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
