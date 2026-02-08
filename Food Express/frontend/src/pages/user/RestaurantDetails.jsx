import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Star, Clock, MapPin, Plus, Minus, ShoppingCart, Check } from 'lucide-react';

export default function RestaurantDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { restaurants, addToCart, cart, loading } = useData();
    const [addedItems, setAddedItems] = useState({});

    const restaurant = restaurants.find(r => String(r.id) === String(id));

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Restaurant not found.</p>
                <Button onClick={() => navigate('/dashboard')} className="mt-4">
                    Back to Home
                </Button>
            </div>
        );
    }

    const handleAddToCart = async (item) => {
        await addToCart(item, restaurant.id, restaurant.name);
        setAddedItems({ ...addedItems, [item.id]: true });
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [item.id]: false }));
        }, 1500);
    };

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Back Button */}
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Restaurants
            </button>

            {/* Restaurant Header */}
            <div className="relative rounded-2xl overflow-hidden">
                <img
                    src={restaurant.image.split(',')[0]}
                    alt={restaurant.name}
                    className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                            <p className="text-white/80 mb-3">{restaurant.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    {restaurant.rating || 4.5} (200+ reviews)
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {restaurant.deliveryTime || '20-30'} min
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {restaurant.address || 'Address not available'}
                                </span>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                            {restaurant.cuisine}
                        </span>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Menu</h2>
                    <span className="text-gray-500">{restaurant.menu.length} items</span>
                </div>

                {restaurant.menu.length === 0 ? (
                    <Card className="p-12 text-center">
                        <p className="text-gray-500">No menu items available yet.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {restaurant.menu.map(item => (
                            <Card key={item.id} className={`flex overflow-hidden transition-shadow ${!item.isAvailable ? 'opacity-60' : 'hover:shadow-md'}`}>
                                <div className="w-28 h-28 flex-shrink-0 relative">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {!item.isAvailable && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold uppercase rotate-12 border-2 border-white p-1">
                                                Sold Out
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-lg font-bold text-primary-600">
                                            ₹{item.price}
                                        </span>
                                        <Button
                                            size="sm"
                                            onClick={() => item.isAvailable && handleAddToCart(item)}
                                            className={addedItems[item.id] ? 'bg-primary-500 hover:bg-primary-600' : ''}
                                            disabled={!item.isAvailable}
                                        >
                                            {addedItems[item.id] ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    Added
                                                </>
                                            ) : (
                                                <>
                                                    {item.isAvailable ? (
                                                        <>
                                                            <Plus className="w-4 h-4" />
                                                            Add
                                                        </>
                                                    ) : (
                                                        'Unavailable'
                                                    )}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Cart Button */}
            {cartItemCount > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
                    <Button
                        size="lg"
                        className="shadow-xl px-8"
                        onClick={() => navigate('/cart')}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        View Cart ({cartItemCount} items)
                    </Button>
                </div>
            )}
        </div>
    );
}
