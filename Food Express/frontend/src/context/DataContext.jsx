import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch restaurants (publicly accessible or with current token)
            const response = await api.get('/customer/restaurants');
            setRestaurants(response.data);

            if (user) {
                try {
                    let ordersPath = '/customer/orders';
                    if (user.role === 'owner') {
                        const ordersResponse = await api.get('/owner/orders');
                        setOrders((ordersResponse.data || []).map(normalizeOrder));
                    } else if (user.role === 'delivery' || user.role === 'agent') {
                        const [availableRes, myOrdersRes] = await Promise.all([
                            api.get('/agent/available-orders'),
                            api.get('/agent/orders/my')
                        ]);
                        const combined = [...(availableRes.data || []), ...(myOrdersRes.data || [])];
                        // Deduplicate by ID
                        const unique = Array.from(new Map(combined.map(o => [o.id, o])).values());
                        setOrders(unique.map(normalizeOrder));
                    } else {
                        const ordersResponse = await api.get(ordersPath);
                        setOrders((ordersResponse.data || []).map(normalizeOrder));
                    }

                    // Also fetch server-side cart to sync for customers
                    if (user.role === 'user' || user.role === 'customer') {
                        const cartResponse = await api.get('/customer/cart');
                        if (cartResponse.data && cartResponse.data.items) {
                            const normalizedCart = cartResponse.data.items.map(item => ({
                                id: item.foodItem.id,
                                name: item.foodItem.name,
                                price: item.foodItem.price,
                                quantity: item.quantity,
                                restaurantId: item.foodItem.restaurantId,
                                restaurantName: item.foodItem.restaurantName
                            }));
                            setCart(normalizedCart);
                        }
                    }
                } catch (e) {
                    console.warn('Could not fetch orders or cart', e);
                }
                fetchNotifications();
            } else {
                // Clear user-specific data on logout
                setOrders([]);
                setNotifications([]);
                setCart([]); // Clear cart as we rely on DB persistence
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const response = await api.get('/users/notifications');
            setNotifications(response.data || []);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const normalizeOrder = (order) => {
        if (!order) return null;
        return {
            ...order,
            total: order.totalAmount || 0,
            restaurantId: order.restaurant?.id || order.restaurantId,
            timeline: order.timeline || [],
            items: (order.items || []).map(item => ({
                ...item,
                name: item.foodName || item.name,
                price: item.price || 0,
                quantity: item.quantity || 0
            }))
        };
    };

    useEffect(() => {
        fetchData();
    }, [user]); // Re-fetch whenever user logs in or out

    const addRestaurant = async (restaurant) => {
        try {
            const response = await api.post('/owner/restaurant', restaurant);
            setRestaurants([...restaurants, response.data]);
            toast.success("Restaurant added successfully!");
            return { success: true, data: response.data };
        } catch (error) {
            toast.error("Failed to add restaurant");
            return { success: false, error: error.message };
        }
    };

    const updateRestaurant = async (restaurantId, details) => {
        try {
            const response = await api.put(`/owner/restaurant/${restaurantId}`, details);
            setRestaurants(restaurants.map(r => String(r.id) === String(restaurantId) ? response.data : r));
            toast.success("Restaurant updated!");
            return { success: true };
        } catch (error) {
            toast.error("Update failed");
            return { success: false, error: error.message };
        }
    };

    const deleteRestaurant = async (restaurantId) => {
        try {
            await api.delete(`/owner/restaurant/${restaurantId}`);
            setRestaurants(restaurants.filter(r => String(r.id) !== String(restaurantId)));
            toast.success("Restaurant deleted");
            return { success: true };
        } catch (error) {
            toast.error("Delete failed");
            return { success: false, error: error.message };
        }
    };

    const addMenuItem = async (item, restaurantId) => {
        try {
            const response = await api.post(`/owner/menu/${restaurantId}`, item);
            // Refresh restaurants to get updated menu
            await fetchData();
            toast.success("Menu item added!");
            return { success: true, data: response.data };
        } catch (error) {
            toast.error("Failed to add menu item");
            return { success: false, error: error.message };
        }
    };

    const updateMenuItem = async (restaurantId, itemId, details) => {
        try {
            await api.put(`/owner/menu/${itemId}`, details);
            await fetchData();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const deleteMenuItem = async (restaurantId, itemId) => {
        try {
            await api.delete(`/owner/menu/${itemId}`);
            await fetchData();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const getAvailableAgents = async () => {
        try {
            const response = await api.get('/owner/agents/available');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch available agents:', error);
            return [];
        }
    };

    const assignAgentToOrder = async (orderId, agentId) => {
        try {
            const response = await api.put(`/owner/orders/${orderId}/assign/${agentId}`);
            const normalized = normalizeOrder(response.data);
            setOrders(orders.map(o => String(o.id) === String(orderId) ? normalized : o));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const addToCart = async (item, restaurantId, restaurantName) => {
        // Check for multi-restaurant conflict
        const differentRestaurant = cart.find(c => String(c.restaurantId) !== String(restaurantId));

        let updated;
        if (differentRestaurant) {
            if (!window.confirm("Changing restaurants will clear your current cart. Continue?")) {
                return;
            }
            // Clear backend cart first
            try { await api.delete('/customer/cart'); } catch (e) { }
            updated = [{ ...item, restaurantId, restaurantName, quantity: 1 }];
        } else {
            const existingIndex = cart.findIndex(c => String(c.id) === String(item.id));
            if (existingIndex >= 0) {
                updated = cart.map((c, i) => i === existingIndex ? { ...c, quantity: c.quantity + 1 } : c);
            } else {
                updated = [...cart, { ...item, restaurantId, restaurantName, quantity: 1 }];
            }
        }

        setCart(updated);

        // Sync with backend
        try {
            await api.post(`/customer/cart/add?foodItemId=${item.id}&quantity=1`);
            toast.info(`Added ${item.name} to cart`);
        } catch (error) {
            console.error('Failed to sync cart item add', error);
        }
    };

    const updateCartQuantity = async (itemId, restaurantId, quantity) => {
        if (quantity <= 0) { removeFromCart(itemId, restaurantId); return; }
        const updated = cart.map(c => c.id === itemId && c.restaurantId === restaurantId ? { ...c, quantity } : c);
        setCart(updated);

        // Sync with backend
        try {
            await api.put(`/customer/cart/update-quantity?foodItemId=${itemId}&quantity=${quantity}`);
        } catch (error) {
            console.error('Failed to sync cart item quantity', error);
        }
    };

    const removeFromCart = async (itemId, restaurantId) => {
        const updated = cart.filter(c => !(c.id === itemId && c.restaurantId === restaurantId));
        setCart(updated);

        // Sync with backend
        try {
            await api.delete(`/customer/cart/remove/${itemId}`);
        } catch (error) {
            console.error('Failed to sync cart item remove', error);
        }
    };

    const clearCart = () => { setCart([]); };
    const getCartTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    const createOrder = async (orderData) => {
        try {
            // 🔥 FIXED PATH AND LOGIC
            // Backend now accepts address details in the body
            const response = await api.post('/customer/order', orderData.address);
            const normalized = normalizeOrder(response.data);
            setOrders([...orders, normalized]);
            clearCart();
            return normalized;
        } catch (error) {
            console.error('Order creation failed:', error);
            throw error;
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            const response = await api.put(`/customer/orders/${orderId}/cancel`);
            if (response.data) {
                const normalized = normalizeOrder(response.data);
                setOrders(orders.map(o => String(o.id) === String(orderId) ? normalized : o));
                return { success: true, data: normalized };
            }
        } catch (error) {
            console.error('Cancellation failed:', error);
            return { success: false, error: error.message };
        }
    };

    const updateOrderStatus = async (orderId, status, message) => {
        try {
            let response;
            // Map frontend statuses to backend endpoints/constants
            if (status === 'DELIVERED') {
                response = await api.put(`/agent/orders/${orderId}/deliver`);
            } else if (status === 'ACCEPTED') {
                response = await api.put(`/owner/orders/${orderId}/accept`);
            } else if (status === 'ON_THE_WAY') {
                // If it's the agent taking it
                response = await api.post(`/agent/orders/${orderId}/take`);
            }

            if (response) {
                const normalized = normalizeOrder(response.data);
                // Update local orders state
                setOrders(orders.map(o => String(o.id) === String(orderId) ? normalized : o));
                return { success: true };
            }
        } catch (error) {
            console.error('Failed to update order status:', error);
            return { success: false, error: error.message };
        }
    };

    const verifyDeliveryCompletion = async (orderId, token) => {
        try {
            const response = await api.put(`/agent/orders/${orderId}/verify-delivery?token=${token}`);
            if (response.data) {
                const normalized = normalizeOrder(response.data);
                setOrders(orders.map(o => String(o.id) === String(orderId) ? normalized : o));
                return { success: true, data: normalized };
            }
        } catch (error) {
            console.error('Verification failed:', error);
            throw error;
        }
    };

    const getOrdersByRestaurant = (ownerId) => {
        if (user?.role === 'owner') return orders;
        return orders.filter(o => String(o.restaurantId) === String(ownerId));
    };

    const getOrdersByUser = (userId) => {
        return orders; // Backend already filters for customer, but we can filter by matching customer ID if needed
    };

    return (
        <DataContext.Provider value={{
            restaurants,
            loading,
            orders,
            addRestaurant,
            cart,
            addToCart,
            updateCartQuantity,
            removeFromCart,
            clearCart,
            getCartTotal,
            createOrder,
            updateOrderStatus,
            verifyDeliveryCompletion,
            getOrdersByRestaurant,
            getOrdersByUser,
            cancelOrder,
            updateRestaurant,
            deleteRestaurant,
            addMenuItem,
            updateMenuItem,
            deleteMenuItem,
            getAvailableAgents,
            assignAgentToOrder,
            notifications,
            fetchNotifications,
            refreshData: fetchData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
