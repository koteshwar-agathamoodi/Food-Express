import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const getErrorMessage = (error) => {
        if (!error.response) return error.message || 'Network error';
        const data = error.response.data;

        // Handle Spring Boot Validation Error Maps
        if (data && data.errors && typeof data.errors === 'object') {
            return Object.entries(data.errors)
                .map(([field, msg]) => `${field}: ${msg}`)
                .join(', ');
        }

        if (typeof data === 'string') return data;
        if (data && data.message) return data.message;
        if (data && typeof data === 'object') return JSON.stringify(data);
        return 'An unexpected error occurred';
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('food_express_token');
            if (token) {
                try {
                    const response = await api.get('/users/me');
                    const userData = response.data;

                    // Normalize role
                    let normalizedRole = userData.role.toLowerCase();
                    if (normalizedRole === 'agent') normalizedRole = 'delivery';
                    if (normalizedRole === 'customer') normalizedRole = 'user';

                    setUser({ ...userData, role: normalizedRole, token });
                } catch (error) {
                    console.error('Session restoration failed:', error);
                    localStorage.removeItem('food_express_token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    // Fetch all users for admin
    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            const normalized = response.data.map(u => {
                let r = u.role.toLowerCase();
                if (r === 'agent') r = 'delivery';
                if (r === 'customer') r = 'user';
                return { ...u, role: r };
            });
            setAllUsers(normalized);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    // Auto-fetch users if admin is logged in
    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'ADMIN') {
            fetchUsers();
        }
    }, [user]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, name, role } = response.data;

            // Normalize role
            let normalizedRole = role.toLowerCase();
            if (normalizedRole === 'agent') normalizedRole = 'delivery';
            if (normalizedRole === 'customer') normalizedRole = 'user';

            const userData = { ...response.data, role: normalizedRole };

            localStorage.setItem('food_express_token', token);
            setUser(userData);
            return { success: true, user: userData };
        } catch (error) {
            return { success: false, error: getErrorMessage(error) };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            // Map frontend roles to backend roles
            const roleMap = {
                'user': 'CUSTOMER',
                'owner': 'OWNER',
                'delivery': 'AGENT'
            };
            const mappedRole = roleMap[role] || role;

            const response = await api.post('/auth/register', {
                name,
                email,
                password,
                role: mappedRole
            });

            // Normalize role back for frontend consistency
            const resData = response.data;
            let normalizedRole = resData.role.toLowerCase();
            if (normalizedRole === 'agent') normalizedRole = 'delivery';
            if (normalizedRole === 'customer') normalizedRole = 'user';

            const userData = { ...resData, role: normalizedRole };

            // Auto login after registration
            if (resData.token) {
                localStorage.setItem('food_express_token', resData.token);
                setUser(userData);
            }

            return { success: true, user: userData };
        } catch (error) {
            return { success: false, error: getErrorMessage(error) };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('food_express_token');
    };

    const approveUser = async (id) => {
        try {
            await api.put(`/admin/users/${id}/approve`);
            await fetchUsers();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const rejectUser = async (id) => {
        try {
            await api.put(`/admin/users/${id}/reject`);
            await fetchUsers();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const deleteUser = async (id) => {
        try {
            await api.delete(`/admin/users/${id}`);
            await fetchUsers();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const getPendingUsers = () => allUsers.filter(u => u.status?.toUpperCase() === 'PENDING');
    const getApprovedUsers = () => allUsers.filter(u => u.status?.toUpperCase() === 'APPROVED');

    const updateProfile = async (profileData) => {
        try {
            const response = await api.put('/users/profile', profileData);

            // Normalize role for local state
            let normalizedRole = response.data.role.toLowerCase();
            if (normalizedRole === 'agent') normalizedRole = 'delivery';
            if (normalizedRole === 'customer') normalizedRole = 'user';

            const updatedUser = { ...response.data, role: normalizedRole, token: user.token };
            setUser(updatedUser);
            return { success: true, user: updatedUser };
        } catch (error) {
            return { success: false, error: getErrorMessage(error) };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            allUsers,
            loading,
            login,
            register,
            logout,
            updateProfile,
            approveUser,
            rejectUser,
            deleteUser,
            getPendingUsers,
            getApprovedUsers
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
