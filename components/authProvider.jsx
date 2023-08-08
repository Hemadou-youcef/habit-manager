// React Components
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        name: 'Youcef Hemadou',
        email: 'youcef.hemadou@hotmail.com',
        habitsGroups: [
            {
                name: 'Health',
                icon: 'health',
            },
            {
                name: 'Work',
                icon: 'work',
            },
            {
                name: 'Social',
                icon: 'social',
            }
        ]
    });

    const login = (user) => {
        setUser(user);
    }
    const logOut = () => {
        setUser(null);
    }

    const value = {
        user,
        login,
        logOut
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);