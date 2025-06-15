import { useState, useEffect } from 'react';
import { authApi } from '../services/authApi';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import { toast } from 'react-toastify';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authApi.getCurrentUser()
                .then((user) => {
                    setUser(user);
                    setLoading(false);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setLoading(false);
                    toast.error('Failed to fetch user data');
                });
        } else {
            setLoading(false);
        }
    }, []);

   const login = async (email: string, password: string) => {
        try {
            const { token, user } = await authApi.login(email, password);
            localStorage.setItem('token', token);
            setUser(user);
            toast.success('Logged in successfully');
            navigate(user.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard');
        } catch (error) {
            toast.error('Login failed');
            throw error;
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            const { token, user } = await authApi.register(email, password, name);
            localStorage.setItem('token', token);
            setUser(user);
            toast.success('Registered successfully');
            navigate(user.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard');
        } catch (error) {
            toast.error('Registration failed');
            throw error;
        }
    };

    const logout = async () => {
        try {
            localStorage.removeItem('token');
            setUser(null);
            toast.info('Logged out');
            navigate('/');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return { user, loading, login, register, logout };
};