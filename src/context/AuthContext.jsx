import React, { useState, useEffect, useCallback } from 'react';
import { loginUser } from '../api';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }, []);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check expiry
                if (decoded.exp * 1000 < Date.now()) {
                    queueMicrotask(logout);
                } else {
                    queueMicrotask(() => {
                        setUser(decoded);
                    });
                }
            } catch {
                queueMicrotask(logout);
            }
        }
        queueMicrotask(() => {
            setLoading(false);
        });
    }, [token, logout]);

    const login = async (email, password) => {
        try {
            const { data } = await loginUser({ email, password });
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(jwtDecode(data.token));
            return { success: true, role: data.role };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
