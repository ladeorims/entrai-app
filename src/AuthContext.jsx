import { createContext, useContext } from 'react';

// Create the context
export const AuthContext = createContext(null);

// Create the custom hook
export const useAuth = () => {
    return useContext(AuthContext);
};