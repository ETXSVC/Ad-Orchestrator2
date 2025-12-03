import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const value = {
        toast,
        showToast
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    padding: '1rem 1.5rem',
                    background: toast.type === 'success' ? '#10B981' : '#EF4444',
                    color: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    zIndex: 9999
                }}>
                    {toast.message}
                </div>
            )}
        </AppContext.Provider>
    );
};
