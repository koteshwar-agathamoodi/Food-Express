import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Package, Truck, Home, Check, Clock, Star } from 'lucide-react';

const ORDER_STEPS = [
    { status: 'PLACED', label: 'Order Placed', icon: Package, description: 'Your order has been received' },
    { status: 'ACCEPTED', label: 'Confirmed', icon: Check, description: 'Restaurant confirmed your order' },
    { status: 'ON_THE_WAY', label: 'On the Way', icon: Truck, description: 'Driver is heading to you' },
    { status: 'DELIVERED', label: 'Delivered', icon: Home, description: 'Enjoy your meal!' }
];

export default function OrderTracking() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { orders, cancelOrder } = useData();

    const order = orders.find(o => String(o.id) === String(orderId));

    if (!order) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500">Order not found.</p>
                <Button onClick={() => navigate('/orders')} className="mt-4">
                    View All Orders
                </Button>
            </div>
        );
    }

    const currentStepIndex = ORDER_STEPS.findIndex(s => s.status === order.status);

    const getStepTime = (status) => {
        const timelineEntry = order.timeline.find(t => t.status === status);
        if (timelineEntry) {
            return new Date(timelineEntry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return null;
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => navigate('/orders')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                All Orders
            </button>

            {/* Order Header */}
            <Card className="p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm text-gray-500">Order #{order.id}</p>
                        <p className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-primary-600">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">Est. 25-35 min</span>
                    </div>
                </div>
            </Card>

            {order.status === 'PLACED' && (
                <div className="mb-6 pb-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-gray-900">Changed your mind?</h4>
                        <p className="text-sm text-gray-500">You can cancel your order while it's still pending.</p>
                    </div>
                    <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={async () => {
                            if (window.confirm('Are you sure you want to cancel this order?')) {
                                await cancelOrder(order.id);
                                navigate('/orders');
                            }
                        }}
                    >
                        Cancel Order
                    </Button>
                </div>
            )}

            {/* Progress Tracker */}
            <Card className="p-6 mb-6">
                <div className="relative py-8">
                    {ORDER_STEPS.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        const Icon = step.icon;
                        const time = getStepTime(step.status);

                        return (
                            <div key={step.status} className="relative flex items-start gap-4 pb-8 last:pb-0">
                                {/* Vertical Line */}
                                {index < ORDER_STEPS.length - 1 && (
                                    <div
                                        className={`absolute left-5 top-10 w-0.5 h-full -translate-x-1/2 ${isCompleted ? 'bg-primary-500' : 'bg-gray-200'
                                            }`}
                                    />
                                )}

                                {/* Icon */}
                                <div
                                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isCompleted
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-gray-100 text-gray-400'
                                        } ${isCurrent ? 'ring-4 ring-primary-100 animate-pulse' : ''}`}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {step.label}
                                        </h4>
                                        {time && (
                                            <span className="text-sm text-gray-500">{time}</span>
                                        )}
                                    </div>
                                    <p className={`text-sm ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Order Details */}
            <Card className="p-6 mb-6">
                <h3 className="font-semibold mb-4">Order Details</h3>
                <div className="space-y-2 mb-4">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.quantity}x {item.name}</span>
                            <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary-600">₹{order.total.toFixed(0)}</span>
                </div>
            </Card>

            {/* Delivery Address */}
            <Card className="p-6 mb-6">
                <h3 className="font-semibold mb-3">Delivery Address</h3>
                <p className="text-gray-600">{order.address.street}</p>
                <p className="text-gray-500 text-sm">{order.address.city}, {order.address.state} {order.address.pincode}</p>
                {order.address.phone && (
                    <p className="text-gray-500 text-sm mt-1">Phone: {order.address.phone}</p>
                )}
                {order.address.instructions && (
                    <p className="text-sm text-gray-400 mt-2 italic">Note: {order.address.instructions}</p>
                )}
            </Card>

            {/* Verification QR Code */}
            {
                order.status === 'ON_THE_WAY' && order.verificationToken && (
                    <Card className="p-6 mb-6 text-center bg-primary-50 border-primary-100">
                        <h3 className="font-bold text-lg mb-2">Delivery Verification</h3>
                        <p className="text-sm text-gray-600 mb-4">Show this QR code to the delivery agent to confirm receiving your order.</p>
                        <div className="bg-white p-4 rounded-2xl inline-block shadow-sm border border-primary-100">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${order.verificationToken}&color=F97316`}
                                alt="Order Verification QR"
                                className="w-40 h-40 mx-auto"
                            />
                            <p className="mt-3 font-mono font-bold text-2xl tracking-widest text-primary-600">
                                {order.verificationToken}
                            </p>
                        </div>
                    </Card>
                )
            }

            {/* Rating Section */}
            {
                order.status === 'DELIVERED' && (
                    <RatingSection orderId={order.id} />
                )
            }
        </div >
    );
}

function RatingSection({ orderId }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const { refreshData } = useData();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return;

        setLoading(true);
        try {
            await api.post(`/reviews/order/${orderId}`, {
                rating,
                comment
            });
            setSubmitted(true);
            refreshData();
        } catch (error) {
            console.error('Failed to submit review:', error);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <Card className="p-8 text-center bg-primary-50 border-primary-100">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-1">Thank You!</h3>
                <p className="text-primary-700">Your feedback helps us improve our service.</p>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Rate your Experience</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="focus:outline-none transition-transform hover:scale-110"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        >
                            <Star
                                className={`w-8 h-8 ${(hover || rating) >= star
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                    }`}
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                        {rating > 0 ? `${rating} Stars` : 'Select stars'}
                    </span>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Comments (Optional)</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you like or what could be improved?"
                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px] resize-none"
                    />
                </div>

                <Button type="submit" className="w-full" disabled={rating === 0 || loading}>
                    {loading ? 'Submitting...' : 'Submit Review'}
                </Button>
            </form>
        </Card>
    );
}

// Inline api import simulation or use existing if any.
// Actually, DataContext already has it. I'll need to check if I can import it here.
// Looking at imports in OrderTracking.jsx... it doesn't have `api`.
// I'll add `api` to imports.
