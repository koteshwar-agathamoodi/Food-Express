import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, UtensilsCrossed } from 'lucide-react';

export default function Cart() {
    const navigate = useNavigate();
    const { cart, updateCartQuantity, removeFromCart, getCartTotal } = useData();

    // Group items by restaurant
    const groupedItems = cart.reduce((acc, item) => {
        if (!acc[item.restaurantId]) {
            acc[item.restaurantId] = {
                restaurantName: item.restaurantName,
                items: []
            };
        }
        acc[item.restaurantId].items.push(item);
        return acc;
    }, {});

    const subtotal = getCartTotal();
    const deliveryFee = cart.length > 0 ? 40 : 0;
    const tax = subtotal * 0.05; // 5% GST
    const total = subtotal + deliveryFee + tax;

    if (cart.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
                <Link to="/dashboard">
                    <Button>
                        <UtensilsCrossed className="w-5 h-5" />
                        Browse Restaurants
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {Object.entries(groupedItems).map(([restaurantId, group]) => (
                        <Card key={restaurantId} className="p-6">
                            <h3 className="font-semibold text-lg mb-4 pb-3 border-b">
                                {group.restaurantName}
                            </h3>
                            <div className="space-y-4">
                                {group.items.map(item => (
                                    <div key={`${item.id}-${restaurantId}`} className="flex items-center gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 rounded-xl object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium">{item.name}</h4>
                                            <p className="text-primary-600 font-semibold">₹{item.price}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                                <button
                                                    onClick={() => updateCartQuantity(item.id, restaurantId, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateCartQuantity(item.id, restaurantId, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id, restaurantId)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <p className="font-semibold w-20 text-right">
                                            ₹{(item.price * item.quantity).toFixed(0)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="p-6 sticky top-24">
                        <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium">₹{subtotal.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Delivery Fee</span>
                                <span className="font-medium">₹{deliveryFee}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">GST (5%)</span>
                                <span className="font-medium">₹{tax.toFixed(0)}</span>
                            </div>
                            <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary-600">₹{total.toFixed(0)}</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            className="w-full mt-6"
                            onClick={() => navigate('/checkout')}
                        >
                            Proceed to Checkout
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                        <Link to="/dashboard" className="block mt-3">
                            <Button variant="secondary" className="w-full">
                                Add More Items
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}
