// React Components
import { createContext, useContext, useState } from 'react';

// Styles
import styles from './authProvider.module.css';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        name: 'Youcef Hemadou',
        email: 'youcef.hemadou@hotmail.com',
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

    if (!user) return (
        <div className={styles.container}>
            <h1 className={styles.title}>Please Log In</h1>
            <button className={styles.btn}
            onClick={() => login({ name: 'Youcef Hemadou', email: 'youcef.hemadou@hotmail.com' })}>Log In</button>
        </div>
    )
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);