import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import api from '../../lib/api';
import { toast } from 'react-toastify';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    Users,
    Store,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    User,
    ChefHat,
    IndianRupee,
    TrendingUp,
    Trash2,
    Eye,
    BellPlus
} from 'lucide-react';

const TABS = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'pending', label: 'Pending Approvals', icon: Clock },
    { id: 'users', label: 'All Users', icon: Users },
    { id: 'restaurants', label: 'Restaurants', icon: Store },
    { id: 'orders', label: 'All Orders', icon: Package },
    { id: 'notifications', label: 'Send Notifications', icon: BellPlus }
];

export default function AdminDashboard() {
    const { allUsers, approveUser, rejectUser, deleteUser, getPendingUsers, getApprovedUsers } = useAuth();
    const { restaurants, orders } = useData();
    const [activeTab, setActiveTab] = useState('overview');
    const [notifData, setNotifData] = useState({ title: '', message: '', type: 'INFO' });
    const [sending, setSending] = useState(false);

    const pendingUsers = getPendingUsers();
    const approvedUsers = getApprovedUsers();

    const usersByRole = {
        user: allUsers.filter(u => u.role?.toLowerCase() === 'user').length,
        owner: allUsers.filter(u => u.role?.toLowerCase() === 'owner').length,
        delivery: allUsers.filter(u => u.role?.toLowerCase() === 'delivery').length
    };

    const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);

    const getRoleIcon = (role) => {
        switch (role) {
            case 'owner': return ChefHat;
            case 'delivery': return Truck;
            default: return User;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'owner': return 'bg-purple-100 text-purple-600';
            case 'delivery': return 'bg-blue-100 text-blue-600';
            default: return 'bg-primary-100 text-primary-600';
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'APPROVED': return 'bg-primary-100 text-primary-700';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage users, restaurants, and orders</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b pb-4">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === tab.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        {tab.id === 'pending' && pendingUsers.length > 0 && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                {pendingUsers.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{allUsers.length - 1}</p>
                                    <p className="text-sm text-gray-500">Total Users</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                                    <Store className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{restaurants.length}</p>
                                    <p className="text-sm text-gray-500">Restaurants</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary-100 text-primary-600">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{orders.length}</p>
                                    <p className="text-sm text-gray-500">Total Orders</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary-100 text-primary-600">
                                    <IndianRupee className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">₹{totalRevenue.toFixed(0)}</p>
                                    <p className="text-sm text-gray-500">Revenue</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Users by Role */}
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4">Users by Role</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-primary-50 rounded-xl text-center">
                                <User className="w-8 h-8 mx-auto text-primary-600 mb-2" />
                                <p className="text-2xl font-bold">{usersByRole.user}</p>
                                <p className="text-sm text-gray-500">Customers</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-xl text-center">
                                <ChefHat className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                                <p className="text-2xl font-bold">{usersByRole.owner}</p>
                                <p className="text-sm text-gray-500">Restaurant Owners</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl text-center">
                                <Truck className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                                <p className="text-2xl font-bold">{usersByRole.delivery}</p>
                                <p className="text-sm text-gray-500">Delivery Partners</p>
                            </div>
                        </div>
                    </Card>

                    {/* Pending Alert */}
                    {pendingUsers.length > 0 && (
                        <Card className="p-4 bg-yellow-50 border-yellow-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                    <div>
                                        <p className="font-medium text-yellow-800">
                                            {pendingUsers.length} user{pendingUsers.length > 1 ? 's' : ''} pending approval
                                        </p>
                                        <p className="text-sm text-yellow-600">Review and approve to grant access</p>
                                    </div>
                                </div>
                                <Button size="sm" onClick={() => setActiveTab('pending')}>
                                    Review Now
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            )}

            {/* Pending Approvals Tab */}
            {activeTab === 'pending' && (
                <div>
                    {pendingUsers.length === 0 ? (
                        <Card className="p-12 text-center">
                            <CheckCircle className="w-12 h-12 mx-auto text-primary-500 mb-4" />
                            <p className="text-gray-500">No pending approvals</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {pendingUsers.map(user => {
                                const RoleIcon = getRoleIcon(user.role);
                                return (
                                    <Card key={user.id} className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl ${getRoleColor(user.role)}`}>
                                                    <RoleIcon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 capitalize">
                                                            {user.role === 'user' ? 'Customer' : user.role === 'owner' ? 'Restaurant Owner' : 'Delivery Partner'}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            Applied {new Date(user.createdAt).toLocaleDateString('en-IN')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => approveUser(user.id)}
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => rejectUser(user.id)}
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* All Users Tab */}
            {activeTab === 'users' && (
                <div className="space-y-4">
                    {allUsers.filter(u => u.role?.toLowerCase() !== 'admin').map(user => {
                        const RoleIcon = getRoleIcon(user.role);
                        return (
                            <Card key={user.id} className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${getRoleColor(user.role)}`}>
                                            <RoleIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                        {user.status?.toUpperCase() === 'PENDING' && (
                                            <>
                                                <Button size="sm" variant="secondary" onClick={() => approveUser(user.id)}>
                                                    Approve
                                                </Button>
                                                <Button size="sm" variant="danger" onClick={() => rejectUser(user.id)}>
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Restaurants Tab */}
            {activeTab === 'restaurants' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {restaurants.map(restaurant => (
                        <Card key={restaurant.id} className="overflow-hidden">
                            <img src={restaurant.image?.split(',')[0]} alt={restaurant.name} className="w-full h-32 object-cover" />
                            <div className="p-4">
                                <h3 className="font-semibold">{restaurant.name}</h3>
                                <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
                                <div className="flex items-center justify-between mt-2 text-sm">
                                    <span>{restaurant.menu.length} items</span>
                                    <span className="text-primary-600">★ {restaurant.rating}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <Card className="p-12 text-center">
                            <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">No orders yet</p>
                        </Card>
                    ) : (
                        orders.map(order => (
                            <Card key={order.id} className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-mono text-sm">#{order.id}</p>
                                        <p className="text-sm text-gray-500">{order.userName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-primary-600">₹{order.totalAmount?.toFixed(0) || order.total?.toFixed(0) || '0'}</p>
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(order.status === 'DELIVERED' ? 'APPROVED' : order.status === 'CANCELLED' ? 'REJECTED' : 'PENDING')}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div className="max-w-2xl mx-auto">
                    <Card className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-primary-100 text-primary-600">
                                <BellPlus className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Send System Notification</h2>
                                <p className="text-sm text-gray-500">This message will be broadcast to all users</p>
                            </div>
                        </div>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setSending(true);
                            try {
                                await api.post('/admin/notifications', notifData);
                                toast.success("Notification broadcast successfully!");
                                setNotifData({ title: '', message: '', type: 'INFO' });
                            } catch (error) {
                                console.error('Failed to send notification:', error);
                                toast.error("Failed to send notification. Please try again.");
                            } finally {
                                setSending(false);
                            }
                        }} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={notifData.title}
                                    onChange={(e) => setNotifData({ ...notifData, title: e.target.value })}
                                    placeholder="Important Update"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 outline-none h-32 resize-none"
                                    value={notifData.message}
                                    onChange={(e) => setNotifData({ ...notifData, message: e.target.value })}
                                    placeholder="Type your message here..."
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Notification Type</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {['INFO', 'SUCCESS', 'WARNING', 'ERROR'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setNotifData({ ...notifData, type })}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${notifData.type === type
                                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 ring-2 ring-primary-500'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button className="w-full py-4 text-lg font-bold" disabled={sending}>
                                {sending ? 'Sending...' : 'Broadcast Notification'}
                            </Button>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
