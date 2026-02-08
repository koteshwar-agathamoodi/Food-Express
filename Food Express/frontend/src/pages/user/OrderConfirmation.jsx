import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle, Package, MapPin, Clock, ArrowRight, UtensilsCrossed } from 'lucide-react';

export default function OrderConfirmation() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { orders } = useData();

    const order = orders.find(o => String(o.id) === String(orderId));

    if (!order) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Order not found.</p>
                <Button onClick={() => navigate('/dashboard')} className="mt-4">
                    Back to Home
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto text-center">
            {/* Success Animation */}
            <div className="mb-8">
                <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center animate-bounce-in">
                    <CheckCircle className="w-12 h-12 text-primary-500" />
                </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-500 mb-8">
                Your order #{order.id} has been placed and will be delivered soon.
            </p>

            {/* Order Details Card */}
            <Card className="p-6 text-left mb-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-mono font-semibold">#{order.id}</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium capitalize">
                        {order.status}
                    </span>
                </div>

                <div className="space-y-4">
                    {/* Delivery Address */}
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary-600 mt-0.5" />
                        <div>
                            <p className="font-medium">Delivery Address</p>
                            <p className="text-sm text-gray-500">
                                {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}
                            </p>
                        </div>
                    </div>

                    {/* Estimated Time */}
                    <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary-600 mt-0.5" />
                        <div>
                            <p className="font-medium">Estimated Delivery</p>
                            <p className="text-sm text-gray-500">30-45 minutes</p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="mt-6 pt-4 border-t">
                    <p className="font-medium mb-3">Order Items</p>
                    <div className="space-y-2">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{item.quantity}x {item.name}</span>
                                <span className="font-medium">₹{(item.price * item.quantity).toFixed(0)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Paid</span>
                        <span className="text-xl font-bold text-primary-600">₹{order.total.toFixed(0)}</span>
                    </div>
                </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={`/order-tracking/${order.id}`}>
                    <Button className="w-full sm:w-auto">
                        <Package className="w-5 h-5" />
                        Track Order
                    </Button>
                </Link>
                <Link to="/dashboard">
                    <Button variant="secondary" className="w-full sm:w-auto">
                        <UtensilsCrossed className="w-5 h-5" />
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </div>
    );
}
