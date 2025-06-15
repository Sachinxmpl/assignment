import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import type { User } from '../types';
import { toast } from 'react-toastify';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('useAuth: Checking token...');
        const token = localStorage.getItem('token');
        if (token) {
            authApi.getCurrentUser()
                .then((user) => {
                    console.log('useAuth: User fetched:', user);
                    setUser(user);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('useAuth: Failed to fetch user:', error);
                    localStorage.removeItem('token');
                    setUser(null);
                    setLoading(false);
                    toast.error('Session expired. Please log in again.');
                });
        } else {
            console.log('useAuth: No token found.');
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            console.log('useAuth: Logging in with:', email);
            setLoading(true);
            const { token, user } = await authApi.login(email, password);
            localStorage.setItem('token', token);
            
            setTimeout(() => {
                setUser(user);
                setLoading(false);
                console.log('useAuth: User set after login:', user);
                toast.success('Logged in successfully');
            }, 100);
            
        } catch (error) {
            console.error('useAuth: Login error:', error);
            setLoading(false);
            toast.error('Login failed. Check your credentials.');
            throw error;
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            console.log('useAuth: Registering with:', email, name);
            setLoading(true);
            const { token, user } = await authApi.register(email, password, name);
            localStorage.setItem('token', token);
            
            // Force a state update with a small delay to ensure React re-renders
            setTimeout(() => {
                setUser(user);
                setLoading(false);
                console.log('useAuth: User set after register:', user);
                toast.success('Registered successfully');
                
                // Navigate after state is updated
                navigate('/dashboard');
            }, 100);
            
        } catch (error) {
            console.error('useAuth: Register error:', error);
            setLoading(false);
            toast.error('Registration failed.');
            throw error;
        }
    };

    const logout = async () => {
        try {
            console.log('useAuth: Logging out...');
            
            // Optional: Call logout API endpoint if you have one
            // await authApi.logout();
            
            localStorage.removeItem('token');
            setUser(null);
            console.log('useAuth: User cleared after logout.');
            toast.success('Logged out successfully');
            navigate('/');
        } catch (error) {
            console.error('useAuth: Logout error:', error);
            toast.error('Logout failed');
        }
    };

    return { 
        user, 
        loading, 
        isLoading: loading, // Export both for compatibility
        login, 
        register, 
        logout 
    };
};