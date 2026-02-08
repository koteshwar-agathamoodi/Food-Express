import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import SearchBar from '../ui/SearchBar';
import NotificationCenter from '../common/NotificationCenter';
import {
    LogOut,
    User,
    ChefHat,
    ShoppingCart,
    Package,
    ClipboardList,
    Home,
    Info,
    Shield,
    Truck
} from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useData();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const getRoleIcon = () => {
        switch (user?.role) {
            case 'admin': return Shield;
            case 'owner': return ChefHat;
            case 'delivery': return Truck;
            default: return User;
        }
    };

    const getRoleLabel = () => {
        switch (user?.role) {
            case 'admin': return 'Admin';
            case 'owner': return 'Owner';
            case 'delivery': return 'Delivery';
            default: return 'User';
        }
    };

    const RoleIcon = getRoleIcon();

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 flex-shrink-0"
                    >
                        <img
                            src="/logo.png"
                            alt="Food Express"
                            className="h-12 w-auto object-contain"
                        />
                    </Link>

                    {/* Search Bar - Only show for customers */}
                    {user?.role === 'user' && (
                        <div className="hidden md:block flex-1 max-w-md">
                            <SearchBar />
                        </div>
                    )}

                    {/* Navigation Links */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Public Links */}
                        {!user && (
                            <>
                                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors p-2">
                                    <Home className="w-5 h-5 md:hidden" />
                                    <span className="hidden md:inline text-sm">Home</span>
                                </Link>
                                <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors p-2">
                                    <Info className="w-5 h-5 md:hidden" />
                                    <span className="hidden md:inline text-sm">About</span>
                                </Link>
                            </>
                        )}

                        {user ? (
                            <>
                                {/* Customer Links */}
                                {user.role === 'user' && (
                                    <>
                                        <Link to="/orders" className="text-gray-600 hover:text-gray-900 transition-colors">
                                            <div className="flex items-center gap-1.5 text-sm p-2">
                                                <Package className="w-4 h-4" />
                                                <span className="hidden md:inline">Orders</span>
                                            </div>
                                        </Link>
                                        <Link to="/cart" className="relative">
                                            <Button variant="ghost" size="sm">
                                                <ShoppingCart className="w-5 h-5" />
                                                <span className="hidden md:inline">Cart</span>
                                                {cartItemCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                                                        {cartItemCount}
                                                    </span>
                                                )}
                                            </Button>
                                        </Link>
                                    </>
                                )}

                                {/* Owner Links */}
                                {user.role === 'owner' && (
                                    <Link to="/order-management">
                                        <Button variant="ghost" size="sm">
                                            <ClipboardList className="w-5 h-5" />
                                            <span className="hidden md:inline">Orders</span>
                                        </Button>
                                    </Link>
                                )}

                                {/* Admin Links */}
                                {user.role === 'admin' && (
                                    <Link to="/admin">
                                        <Button variant="ghost" size="sm">
                                            <Shield className="w-5 h-5" />
                                            <span className="hidden md:inline">Admin Panel</span>
                                        </Button>
                                    </Link>
                                )}

                                {/* Delivery Links */}
                                {user.role === 'delivery' && (
                                    <Link to="/delivery">
                                        <Button variant="ghost" size="sm">
                                            <Package className="w-5 h-5" />
                                            <span className="hidden md:inline">My Deliveries</span>
                                        </Button>
                                    </Link>
                                )}

                                {/* User Info */}
                                <Link to="/profile" className="hidden sm:flex items-center gap-2 text-sm text-gray-600 px-3 py-1.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                                    <RoleIcon className="w-4 h-4" />
                                    <span className="font-medium max-w-[80px] truncate">{user.name}</span>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                        user.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'delivery' ? 'bg-blue-100 text-blue-700' :
                                                'bg-primary-100 text-primary-700'
                                        }`}>
                                        {getRoleLabel()}
                                    </span>
                                </Link>

                                <NotificationCenter />

                                <Button variant="ghost" size="sm" onClick={handleLogout}>
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden md:inline">Logout</span>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm">Register</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {user?.role === 'user' && (
                    <div className="md:hidden pb-3">
                        <SearchBar />
                    </div>
                )}
            </div>
        </nav>
    );
}
