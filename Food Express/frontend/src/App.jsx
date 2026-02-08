import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Legal from './pages/Legal';
import ComingSoon from './pages/ComingSoon';
import NotFound from './pages/NotFound';
import Developers from './pages/Developers';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddRestaurant from './pages/owner/AddRestaurant';
import EditRestaurant from './pages/owner/EditRestaurant';
import OrderManagement from './pages/owner/OrderManagement';

// Delivery Pages
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import RestaurantDetails from './pages/user/RestaurantDetails';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import OrderConfirmation from './pages/user/OrderConfirmation';
import OrderTracking from './pages/user/OrderTracking';
import OrderHistory from './pages/user/OrderHistory';
import Profile from './pages/user/Profile';
import ChatBot from './components/common/ChatBot';
import ScrollToTop from './components/common/ScrollToTop';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect based on role
        if (user.role === 'admin') return <Navigate to="/admin" />;
        if (user.role === 'owner') return <Navigate to="/owner-dashboard" />;
        if (user.role === 'delivery') return <Navigate to="/delivery" />;
        return <Navigate to="/dashboard" />;
    }

    return children;
};

function App() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
            <ScrollToTop />
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/terms" element={<Legal />} />
                    <Route path="/privacy" element={<Legal />} />
                    <Route path="/refund" element={<Legal />} />
                    <Route path="/cookie" element={<Legal />} />

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />

                    {/* Owner Routes */}
                    <Route
                        path="/owner-dashboard"
                        element={
                            <PrivateRoute allowedRoles={['owner']}>
                                <OwnerDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/add-restaurant"
                        element={
                            <PrivateRoute allowedRoles={['owner']}>
                                <AddRestaurant />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/edit-restaurant/:id"
                        element={
                            <PrivateRoute allowedRoles={['owner']}>
                                <EditRestaurant />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/order-management"
                        element={
                            <PrivateRoute allowedRoles={['owner']}>
                                <OrderManagement />
                            </PrivateRoute>
                        }
                    />

                    {/* Delivery Routes */}
                    <Route
                        path="/delivery"
                        element={
                            <PrivateRoute allowedRoles={['delivery']}>
                                <DeliveryDashboard />
                            </PrivateRoute>
                        }
                    />

                    {/* User Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute allowedRoles={['user']}>
                                <UserDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/restaurant/:id"
                        element={
                            <PrivateRoute allowedRoles={['user']}>
                                <RestaurantDetails />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/cart"
                        element={
                            <PrivateRoute allowedRoles={['user']}>
                                <Cart />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <PrivateRoute allowedRoles={['user']}>
                                <Checkout />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/order-confirmation/:orderId"
                        element={
                            <PrivateRoute allowedRoles={['user']}>
                                <OrderConfirmation />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/order-tracking/:orderId"
                        element={
                            <PrivateRoute allowedRoles={['user']}>
                                <OrderTracking />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/orders"
                        element={
                            <PrivateRoute allowedRoles={['user']}>
                                <OrderHistory />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        }
                    />

                    {/* Catch All & Coming Soon */}
                    <Route path="/partner" element={<ComingSoon />} />
                    <Route path="/developers" element={<Developers />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <ChatBot />
            <Footer />
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}

export default App;
