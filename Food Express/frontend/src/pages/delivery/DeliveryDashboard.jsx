import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    Package,
    MapPin,
    Phone,
    Navigation,
    CheckCircle,
    Clock,
    Truck,
    IndianRupee,
    User,
    AlertCircle
} from 'lucide-react';

const ORDER_STATUSES = {
    ON_THE_WAY: { label: 'Out for Delivery', color: 'bg-blue-100 text-blue-700' },
    DELIVERED: { label: 'Delivered', color: 'bg-primary-100 text-primary-700' }
};

export default function DeliveryDashboard() {
    const { user } = useAuth();
    const { orders, updateOrderStatus, verifyDeliveryCompletion } = useData();
    const [activeTab, setActiveTab] = useState('available');
    const [showVerify, setShowVerify] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [verifyError, setVerifyError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    // Get different order sets
    const availableOrders = orders.filter(o => o.status === 'ACCEPTED');
    const myActiveOrders = orders.filter(o => o.status === 'ON_THE_WAY');
    const completedOrders = orders.filter(o => o.status === 'DELIVERED');

    const todaysEarnings = completedOrders
        .filter(o => {
            // Fallback to createdAt if timeline is missing, assuming delivered today for now if status is DELIVERED
            const deliveredTime = o.timeline?.find(t => t.status === 'DELIVERED')?.time || o.createdAt;
            return deliveredTime && new Date(deliveredTime).toDateString() === new Date().toDateString();
        })
        .length * 50; // ₹50 per delivery

    const handleTakeOrder = async (orderId) => {
        const result = await updateOrderStatus(orderId, 'ON_THE_WAY', 'Agent picked up the order');
        if (result.success) {
            setActiveTab('active');
        }
    };

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setVerifyError('');

        try {
            const result = await verifyDeliveryCompletion(selectedOrder.id, verificationCode);
            if (result.success) {
                setShowVerify(false);
                setVerificationCode('');
                setActiveTab('completed');
            }
        } catch (error) {
            setVerifyError(error.response?.data?.message || 'Invalid code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Delivery Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {user.name}!</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Online</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{myActiveOrders.length}</p>
                            <p className="text-xs text-gray-500">Active Orders</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{completedOrders.length}</p>
                            <p className="text-xs text-gray-500">Completed</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                            <IndianRupee className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">₹{todaysEarnings}</p>
                            <p className="text-xs text-gray-500">Today's Earnings</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">₹50</p>
                            <p className="text-xs text-gray-500">Per Delivery</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab('available')}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${activeTab === 'available'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    Available ({availableOrders.length})
                </button>
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${activeTab === 'active'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    Active ({myActiveOrders.length})
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${activeTab === 'completed'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    Completed ({completedOrders.length})
                </button>
            </div>

            {/* Orders List */}
            {activeTab === 'available' && (
                <>
                    {availableOrders.length === 0 ? (
                        <Card className="p-12 text-center">
                            <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 mb-2">No available orders</p>
                            <p className="text-sm text-gray-400">Orders accepted by restaurants will appear here</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {availableOrders.map(order => (
                                <Card key={order.id} className="p-6 border-l-4 border-primary-500">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-sm font-semibold">#{order.id}</span>
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                                                    Ready for Pickup
                                                </span>
                                            </div>
                                            <p className="text-lg font-bold">{order.restaurantName}</p>
                                            <p className="text-sm text-gray-500">{order.address.city}</p>
                                        </div>
                                        <p className="text-xl font-bold text-primary-600">₹{order.total.toFixed(0)}</p>
                                    </div>
                                    <Button className="w-full" onClick={() => handleTakeOrder(order.id)}>
                                        Take Order & Start Delivery
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}

            {activeTab === 'active' && (
                <>
                    {myActiveOrders.length === 0 ? (
                        <Card className="p-12 text-center">
                            <Truck className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 mb-2">No active deliveries</p>
                            <p className="text-sm text-gray-400">Take an available order to get started</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {myActiveOrders.map(order => (
                                <Card key={order.id} className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-sm font-semibold">#{order.id}</span>
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                                                    Out for Delivery
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">{order.restaurantName}</p>
                                        </div>
                                        <p className="text-xl font-bold text-primary-600">₹{order.total.toFixed(0)}</p>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium">{order.userName}</span>
                                        </div>
                                        <div className="flex items-start gap-2 mb-2">
                                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm">{order.address.street}</p>
                                                <p className="text-sm text-gray-500">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm">{order.address.phone}</span>
                                        </div>
                                        {order.address.instructions && (
                                            <div className="flex items-start gap-2 mt-2 pt-2 border-t">
                                                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                                                <p className="text-sm text-yellow-700 italic">{order.address.instructions}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Items */}
                                    <div className="mb-4">
                                        <p className="text-sm font-medium mb-2">Order Items:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {order.items.map((item, i) => (
                                                <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm">
                                                    {item.quantity}x {item.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <Button className="flex-1" onClick={() => {
                                            setSelectedOrder(order);
                                            setShowVerify(true);
                                        }}>
                                            <CheckCircle className="w-4 h-4" />
                                            Verify & Deliver
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setIsNavigating(true);
                                                setTimeout(() => setIsNavigating(false), 3000);
                                            }}
                                        >
                                            <Navigation className="w-4 h-4" />
                                            Navigate
                                        </Button>
                                        <a href={`tel:${order.address.phone}`}>
                                            <Button variant="secondary">
                                                <Phone className="w-4 h-4" />
                                            </Button>
                                        </a>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Verification Modal */}
            {showVerify && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-sm p-6">
                        <h3 className="text-xl font-bold mb-2">Verify Delivery</h3>
                        <p className="text-sm text-gray-500 mb-6">Ask the customer for their 6-digit verification code or scan their QR.</p>

                        <form onSubmit={handleVerificationSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Verification Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full text-center text-3xl font-bold tracking-[0.5em] py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                                    placeholder="000000"
                                    required
                                    autoFocus
                                />
                                {verifyError && (
                                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1 justify-center">
                                        <AlertCircle className="w-4 h-4" />
                                        {verifyError}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setShowVerify(false);
                                        setVerificationCode('');
                                        setVerifyError('');
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={verificationCode.length !== 6 || loading}
                                >
                                    {loading ? 'Verifying...' : 'Complete'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {activeTab === 'completed' && (
                <>
                    {completedOrders.length === 0 ? (
                        <Card className="p-12 text-center">
                            <CheckCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">No completed deliveries yet</p>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {completedOrders.map(order => (
                                <Card key={order.id} className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-mono text-sm">#{order.id}</p>
                                                <p className="text-sm text-gray-500">{order.restaurantName}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-primary-600">₹{order.total.toFixed(0)}</p>
                                            <p className="text-xs text-primary-600">+₹50 earned</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}
            {/* Radar Animation Overlay */}
            {isNavigating && (
                <div className="fixed inset-0 bg-primary-900/40 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-6 text-white overflow-hidden">
                    <div className="relative w-80 h-80 flex items-center justify-center">
                        {/* Radar Circles */}
                        <div className="absolute inset-0 border-2 border-primary-400/30 rounded-full scale-100" />
                        <div className="absolute inset-0 border-2 border-primary-400/20 rounded-full scale-75" />
                        <div className="absolute inset-0 border-2 border-primary-400/10 rounded-full scale-50" />

                        {/* Sweeping Line */}
                        <div className="absolute inset-0 border-r-4 border-primary-400/50 rounded-full animate-[radar_2s_infinite_linear]" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary-400/20 rounded-full animate-[radar_2s_infinite_linear]" />

                        {/* Blips */}
                        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-primary-400 rounded-full shadow-[0_0_15px_rgba(30,58,138,0.5)] animate-pulse" />
                        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-primary-400 rounded-full shadow-[0_0_15px_rgba(30,58,138,0.5)] animate-pulse [animation-delay:-0.5s]" />

                        <div className="relative z-10 flex flex-col items-center animate-bounce">
                            <Navigation className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    <div className="text-center mt-8 space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Locating Customer...</h2>
                        <p className="text-primary-100/80 font-medium">Calibrating navigation systems</p>
                    </div>

                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes radar {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}} />
                </div>
            )}
        </div>
    );
}
