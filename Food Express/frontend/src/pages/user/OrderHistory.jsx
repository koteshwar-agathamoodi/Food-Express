import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Package, Clock, ChevronRight, MapPin, UtensilsCrossed } from 'lucide-react';

const STATUS_COLORS = {
    PLACED: 'bg-yellow-100 text-yellow-700',
    ACCEPTED: 'bg-blue-100 text-blue-700',
    PREPARING: 'bg-purple-100 text-purple-700',
    ON_THE_WAY: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-primary-100 text-primary-700',
    CANCELLED: 'bg-red-100 text-red-700'
};

const STATUS_LABELS = {
    PLACED: 'Pending',
    ACCEPTED: 'Confirmed',
    PREPARING: 'Preparing',
    ON_THE_WAY: 'On the Way',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
};

export default function OrderHistory() {
    const { user } = useAuth();
    const { getOrdersByUser } = useData();

    const orders = getOrdersByUser(user.id);

    if (orders.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                <Link to="/dashboard">
                    <Button>
                        <UtensilsCrossed className="w-5 h-5" />
                        Start Ordering
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Order History</h1>

            <div className="space-y-4">
                {orders.map(order => (
                    <Card key={order.id} className="overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                        <Package className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-sm">#{order.id}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                                                {STATUS_LABELS[order.status]}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-primary-600">₹{order.total.toFixed(0)}</p>
                                    <p className="text-sm text-gray-500">{order.items.length} items</p>
                                </div>
                            </div>

                            {/* Items Preview */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {order.items.slice(0, 3).map((item, i) => (
                                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                                        {item.quantity}x {item.name}
                                    </span>
                                ))}
                                {order.items.length > 3 && (
                                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-500">
                                        +{order.items.length - 3} more
                                    </span>
                                )}
                            </div>

                            {/* Delivery Address */}
                            <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                                <MapPin className="w-3 h-3" />
                                {order.address.street}, {order.address.city}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-3">
                                {order.status === 'PLACED' && (
                                    <Button
                                        variant="outline"
                                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                        size="sm"
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to cancel this order?')) {
                                                cancelOrder(order.id);
                                            }
                                        }}
                                    >
                                        Cancel Order
                                    </Button>
                                )}
                                {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                                    <Link to={`/order-tracking/${order.id}`} className="flex-1">
                                        <Button className="w-full" size="sm">
                                            Track Order
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                )}
                                {order.status === 'DELIVERED' && (
                                    <Link to="/dashboard" className="flex-1">
                                        <Button variant="secondary" className="w-full" size="sm">
                                            Reorder
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
