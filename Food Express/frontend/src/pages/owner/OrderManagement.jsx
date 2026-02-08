import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Package, Clock, CheckCircle, XCircle, ChefHat, Truck, IndianRupee, TrendingUp } from 'lucide-react';

const STATUS_CONFIG = {
    PLACED: { label: 'New', color: 'bg-yellow-100 text-yellow-700', nextStatus: 'ACCEPTED', nextLabel: 'Confirm Order' },
    ACCEPTED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', nextStatus: null, nextLabel: null },
    ON_THE_WAY: { label: 'Out for Delivery', color: 'bg-indigo-100 text-indigo-700', nextStatus: null, nextLabel: null },
    DELIVERED: { label: 'Delivered', color: 'bg-primary-100 text-primary-700', nextStatus: null, nextLabel: null },
    CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700', nextStatus: null, nextLabel: null }
};

export default function OrderManagement() {
    const { user } = useAuth();
    const { getOrdersByRestaurant, updateOrderStatus, getAvailableAgents, assignAgentToOrder } = useData();
    const [filter, setFilter] = useState('all');
    const [availableAgents, setAvailableAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState({});

    const allOrders = getOrdersByRestaurant(user.id);

    useEffect(() => {
        const loadAgents = async () => {
            const agents = await getAvailableAgents();
            setAvailableAgents(agents);
        };
        loadAgents();
    }, [getAvailableAgents]);

    const handleAssignAgent = async (orderId) => {
        const agentId = selectedAgent[orderId];
        if (!agentId) return;
        const result = await assignAgentToOrder(orderId, agentId);
        if (result.success) {
            // Re-fetch agents or just filter locally
            setAvailableAgents(prev => prev.filter(a => String(a.id) !== String(agentId)));
        }
    };

    const filteredOrders = filter === 'all'
        ? allOrders
        : allOrders.filter(o => o.status === filter);

    const stats = {
        total: allOrders.length,
        pending: allOrders.filter(o => o.status === 'PLACED').length,
        preparing: allOrders.filter(o => o.status === 'ACCEPTED').length,
        completed: allOrders.filter(o => o.status === 'DELIVERED').length,
        revenue: allOrders.filter(o => o.status === 'DELIVERED').reduce((sum, o) => sum + o.total, 0)
    };

    const handleUpdateStatus = (orderId, newStatus, message) => {
        updateOrderStatus(orderId, newStatus, message);
    };

    const filters = [
        { value: 'all', label: 'All Orders' },
        { value: 'PLACED', label: 'New' },
        { value: 'ACCEPTED', label: 'Confirmed' },
        { value: 'ON_THE_WAY', label: 'Out for Delivery' },
        { value: 'DELIVERED', label: 'Completed' }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                <p className="text-gray-500 mt-1">Manage incoming orders from customers</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.pending}</p>
                            <p className="text-xs text-gray-500">Pending</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                            <ChefHat className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.preparing}</p>
                            <p className="text-xs text-gray-500">In Progress</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.completed}</p>
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
                            <p className="text-2xl font-bold">₹{stats.revenue.toFixed(0)}</p>
                            <p className="text-xs text-gray-500">Revenue</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {filters.map(f => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f.value
                            ? 'bg-primary-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <Card className="p-12 text-center">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No orders found</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => {
                        const statusConfig = STATUS_CONFIG[order.status];

                        return (
                            <Card key={order.id} className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-sm">#{order.id}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                                    {statusConfig.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-primary-600">₹{order.total.toFixed(0)}</p>
                                        <p className="text-sm text-gray-500">{order.items.length} items</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                    <p className="text-sm font-medium mb-2">Customer: {order.userName}</p>
                                    <p className="text-sm text-gray-500">{order.address.street}, {order.address.city}</p>
                                    {order.address.instructions && (
                                        <p className="text-sm text-gray-400 italic mt-1">"{order.address.instructions}"</p>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {order.items.map((item, i) => (
                                        <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm">
                                            {item.quantity}x {item.name}
                                        </span>
                                    ))}
                                </div>

                                {statusConfig.nextStatus && (
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={() => handleUpdateStatus(order.id, statusConfig.nextStatus, `Order ${statusConfig.nextLabel.toLowerCase()}`)}
                                            className="flex-1"
                                        >
                                            {statusConfig.nextLabel}
                                        </Button>
                                        {order.status === 'PLACED' && (
                                            <Button
                                                variant="danger"
                                                onClick={() => handleUpdateStatus(order.id, 'CANCELLED', 'Order cancelled by restaurant')}
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {order.status === 'ACCEPTED' && (
                                    <div className="flex flex-col md:flex-row gap-3 mt-4 pt-4 border-t">
                                        <select
                                            className="flex-1 rounded-lg border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500"
                                            value={selectedAgent[order.id] || ''}
                                            onChange={(e) => setSelectedAgent({ ...selectedAgent, [order.id]: e.target.value })}
                                        >
                                            <option value="">Select Delivery Agent</option>
                                            {availableAgents.map(agent => (
                                                <option key={agent.id} value={agent.id}>
                                                    {agent.user?.name || agent.name} (Online)
                                                </option>
                                            ))}
                                        </select>
                                        <Button
                                            disabled={!selectedAgent[order.id]}
                                            onClick={() => handleAssignAgent(order.id)}
                                            className="whitespace-nowrap"
                                        >
                                            <Truck className="w-4 h-4" />
                                            Assign & Ship
                                        </Button>
                                    </div>
                                )}

                                {order.deliveryAgent && (
                                    <div className="flex items-center gap-2 mt-4 text-sm text-indigo-600 font-medium">
                                        <Truck className="w-4 h-4" />
                                        Assigned to Agent: {order.deliveryAgent.user?.name || order.deliveryAgent.name}
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
