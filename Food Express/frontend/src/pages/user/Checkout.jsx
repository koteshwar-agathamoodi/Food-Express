import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { MapPin, CreditCard, Check, ChevronRight, Lock, IndianRupee } from 'lucide-react';

export default function Checkout() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, getCartTotal, createOrder, restaurants } = useData();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        instructions: ''
    });

    const [payment, setPayment] = useState({
        method: 'card',
        cardNumber: '',
        expiry: '',
        cvv: '',
        upiId: ''
    });

    const subtotal = getCartTotal();
    const deliveryFee = 40;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;

    // 🔥 FIXED: Wrap side-effects (navigation) in useEffect
    useEffect(() => {
        if (cart.length === 0) {
            navigate('/cart');
        }
    }, [cart.length, navigate]);

    // 🔥 NEW: Address Auto-fill using Pincode API
    useEffect(() => {
        const fetchAddress = async () => {
            if (address.pincode.length === 6) {
                try {
                    const response = await fetch(`https://api.postalpincode.in/pincode/${address.pincode}`);
                    const data = await response.json();

                    if (data[0].Status === 'Success') {
                        const postOffice = data[0].PostOffice[0];
                        setAddress(prev => ({
                            ...prev,
                            city: postOffice.District,
                            state: postOffice.State
                        }));
                    }
                } catch (error) {
                    console.error('Failed to fetch pincode data:', error);
                }
            }
        };
        fetchAddress();
    }, [address.pincode]);

    if (cart.length === 0) {
        return null;
    }

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Get restaurant owner ID for order
        const firstItem = cart[0];
        const restaurant = restaurants.find(r => String(r.id) === String(firstItem.restaurantId));

        const order = await createOrder({
            userId: user.id,
            userName: user.name,
            address,
            payment: { method: payment.method },
            subtotal,
            deliveryFee,
            tax,
            total,
            restaurantId: firstItem.restaurantId,
            restaurantName: firstItem.restaurantName
        });

        setLoading(false);
        if (order && order.id) {
            navigate(`/order-tracking/${order.id}`);
        }
    };


    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                            {step > 1 ? <Check className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                        </div>
                        <span className="font-medium hidden sm:inline">Address</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <span className="font-medium hidden sm:inline">Payment</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Forms */}
                <div className="lg:col-span-2">
                    {step === 1 && (
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary-600" />
                                Delivery Address
                            </h2>
                            <form onSubmit={handleAddressSubmit} className="space-y-4">
                                <Input
                                    label="Street Address"
                                    value={address.street}
                                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                    placeholder="Enter your full address"
                                    required
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="City"
                                        value={address.city}
                                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                        placeholder="City"
                                        required
                                    />
                                    <Input
                                        label="State"
                                        value={address.state}
                                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                        placeholder="State"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Pincode"
                                        value={address.pincode}
                                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                        placeholder="6-digit pincode"
                                        maxLength={6}
                                        required
                                    />
                                    <Input
                                        label="Phone Number"
                                        value={address.phone}
                                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                        placeholder="10-digit mobile"
                                        maxLength={10}
                                        required
                                    />
                                </div>
                                <Input
                                    label="Delivery Instructions (Optional)"
                                    value={address.instructions}
                                    onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
                                    placeholder="Any special instructions for delivery"
                                />
                                <Button type="submit" className="w-full mt-6">
                                    Continue to Payment
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </form>
                        </Card>
                    )}

                    {step === 2 && (
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary-600" />
                                Payment Method
                            </h2>

                            {/* Payment Method Selection */}
                            <div className="flex gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setPayment({ ...payment, method: 'card' })}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${payment.method === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                                        }`}
                                >
                                    <CreditCard className="w-6 h-6 mb-2 mx-auto" />
                                    <p className="font-medium text-center">Card</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPayment({ ...payment, method: 'upi' })}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${payment.method === 'upi' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                                        }`}
                                >
                                    <IndianRupee className="w-6 h-6 mb-2 mx-auto" />
                                    <p className="font-medium text-center">UPI</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPayment({ ...payment, method: 'cod' })}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${payment.method === 'cod' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                                        }`}
                                >
                                    <IndianRupee className="w-6 h-6 mb-2 mx-auto" />
                                    <p className="font-medium text-center">Cash</p>
                                </button>
                            </div>

                            <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                {payment.method === 'card' && (
                                    <>
                                        <Input
                                            label="Card Number"
                                            value={payment.cardNumber}
                                            onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                            required
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Expiry Date"
                                                value={payment.expiry}
                                                onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                required
                                            />
                                            <Input
                                                label="CVV"
                                                type="password"
                                                value={payment.cvv}
                                                onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                                                placeholder="123"
                                                maxLength={3}
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {payment.method === 'upi' && (
                                    <Input
                                        label="UPI ID"
                                        value={payment.upiId}
                                        onChange={(e) => setPayment({ ...payment, upiId: e.target.value })}
                                        placeholder="yourname@paytm / yourname@upi"
                                        required
                                    />
                                )}

                                {payment.method === 'cod' && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                        <p className="text-yellow-800 text-sm">
                                            Please keep exact change ready. Our delivery partner may not carry change for large bills.
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                                    <Lock className="w-4 h-4" />
                                    <span>Your payment information is secure and encrypted</span>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="flex-1"
                                        onClick={() => setStep(1)}
                                    >
                                        Back
                                    </Button>
                                    <Button type="submit" className="flex-1" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>Pay ₹{total.toFixed(0)}</>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="p-6 sticky top-24">
                        <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                        <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                            {cart.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{item.quantity}x {item.name}</span>
                                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(0)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span>₹{subtotal.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Delivery Fee</span>
                                <span>₹{deliveryFee}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">GST (5%)</span>
                                <span>₹{tax.toFixed(0)}</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary-600">₹{total.toFixed(0)}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
