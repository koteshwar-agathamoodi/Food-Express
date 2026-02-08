import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Plus, Store, UtensilsCrossed, DollarSign, Trash2, Edit2, ClipboardList, TrendingUp, Truck } from 'lucide-react';

export default function OwnerDashboard() {
    const { user } = useAuth();
    const { restaurants, addMenuItem, getOrdersByRestaurant, updateMenuItem } = useData();
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [showAddItem, setShowAddItem] = useState(false);
    const [loadingMap, setLoadingMap] = useState({});

    // ... (stats logic stays same)

    const handleToggleAvailability = async (restaurantId, item) => {
        const itemId = item.id;
        setLoadingMap(prev => ({ ...prev, [itemId]: true }));
        try {
            await updateMenuItem(restaurantId, itemId, {
                ...item,
                isAvailable: !item.isAvailable
            });
        } catch (error) {
            console.error('Failed to toggle availability:', error);
        } finally {
            setLoadingMap(prev => ({ ...prev, [itemId]: false }));
        }
    };

    const [newItem, setNewItem] = useState({ name: '', price: '', description: '', category: '', image: '' });

    const FOOD_CATEGORIES = [
        { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80' },
        { name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' },
        { name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=800&q=80' },
        { name: 'Pasta', image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800&q=80' },
        { name: 'Dosa', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80' },
        { name: 'Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80' },
        { name: 'Dessert', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80' },
        { name: 'Drinks', image: 'https://images.unsplash.com/photo-1544145945-f904253d0c7b?w=800&q=80' },
        { name: 'Coffee', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80' },
        { name: 'Chicken', image: 'https://images.unsplash.com/photo-1606728035253-49df89693f91?w=800&q=80' }
    ];

    const handleCategorySelect = (cat) => {
        setNewItem(prev => ({ ...prev, category: cat.name, image: cat.image }));
    };

    const myRestaurants = restaurants.filter(r => r.owner?.id === user.id);
    const orders = getOrdersByRestaurant(user.id);
    const pendingOrders = orders.filter(o => o.status === 'PLACED').length;
    const confirmedOrders = orders.filter(o => o.status === 'ACCEPTED' && !o.deliveryAgent).length;
    const totalRevenue = orders.filter(o => o.status === 'DELIVERED').reduce((sum, o) => sum + o.total, 0);

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (selectedRestaurant) {
            const result = await addMenuItem({
                ...newItem,
                price: parseFloat(newItem.price),
                image: newItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
                isAvailable: true
            }, selectedRestaurant.id);

            if (result.success) {
                setNewItem({ name: '', price: '', description: '', category: '', image: '' });
                setShowAddItem(false);
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage your restaurants and orders</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/order-management">
                        <Button variant="secondary">
                            <ClipboardList className="w-5 h-5" />
                            Manage Orders
                            {pendingOrders > 0 && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                    {pendingOrders}
                                </span>
                            )}
                        </Button>
                    </Link>
                    <Link to="/add-restaurant">
                        <Button>
                            <Plus className="w-5 h-5" />
                            Add Restaurant
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary-100 text-primary-600">
                            <Store className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Restaurants</p>
                            <p className="text-2xl font-bold">{myRestaurants.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-orange-100 text-secondary-500">
                            <UtensilsCrossed className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Items</p>
                            <p className="text-2xl font-bold">
                                {myRestaurants.reduce((acc, r) => acc + (r.menu?.length || 0), 0)}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <p className="text-2xl font-bold">{orders.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary-100 text-primary-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Revenue</p>
                            <p className="text-2xl font-bold">₹{totalRevenue.toFixed(0)}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Pending Orders Alert */}
            <div className="space-y-4">
                {pendingOrders > 0 && (
                    <Card className="p-4 bg-yellow-50 border-yellow-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-yellow-200 text-yellow-700">
                                    <ClipboardList className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-yellow-800">You have {pendingOrders} new order{pendingOrders > 1 ? 's' : ''}</p>
                                    <p className="text-sm text-yellow-600">Review and confirm to start preparing</p>
                                </div>
                            </div>
                            <Link to="/order-management">
                                <Button size="sm">View Orders</Button>
                            </Link>
                        </div>
                    </Card>
                )}

                {confirmedOrders > 0 && (
                    <Card className="p-4 bg-blue-50 border-blue-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-blue-200 text-blue-700">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-blue-800">You have {confirmedOrders} confirmed order{confirmedOrders > 1 ? 's' : ''} awaiting assignment</p>
                                    <p className="text-sm text-blue-600">Assign a delivery agent to ship these orders</p>
                                </div>
                            </div>
                            <Link to="/order-management">
                                <Button size="sm" variant="secondary">Assign Agents</Button>
                            </Link>
                        </div>
                    </Card>
                )}
            </div>

            {/* Restaurants section */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Your Restaurants</h2>
                {myRestaurants.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Store className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">You haven't added any restaurants yet.</p>
                        <Link to="/add-restaurant" className="inline-block mt-4">
                            <Button>Add Your First Restaurant</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {myRestaurants.map(restaurant => (
                            <Card key={restaurant.id} className="overflow-hidden">
                                <div className="h-40 overflow-hidden relative">
                                    <img
                                        src={restaurant.image.split(',')[0]}
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <Link
                                        to={`/edit-restaurant/${restaurant.id}`}
                                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                                            <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
                                        </div>
                                        <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-700">
                                            {restaurant.menu?.length || 0} items
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">{restaurant.description}</p>

                                    {/* Menu Items */}
                                    <div className="border-t pt-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium text-sm">Menu Items</h4>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => {
                                                    setSelectedRestaurant(restaurant);
                                                    setShowAddItem(true);
                                                }}
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Item
                                            </Button>
                                        </div>
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                            {!restaurant.menu || restaurant.menu.length === 0 ? (
                                                <p className="text-sm text-gray-400 text-center py-2">No items yet</p>
                                            ) : (
                                                restaurant.menu.map(item => (
                                                    <div key={item.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${item.isAvailable ? 'bg-gray-50 border-gray-100' : 'bg-red-50 border-red-100'}`}>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">{item.name}</span>
                                                            <span className="text-xs text-primary-600 font-semibold">₹{item.price.toFixed(0)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${item.isAvailable ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-700'}`}>
                                                                {item.isAvailable ? 'Available' : 'Sold Out'}
                                                            </span>
                                                            <button
                                                                onClick={() => handleToggleAvailability(restaurant.id, item)}
                                                                disabled={loadingMap[item.id]}
                                                                className={`p-2 rounded-lg transition-colors ${item.isAvailable ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-primary-100 text-primary-600 hover:bg-primary-200'} disabled:opacity-50`}
                                                                title={item.isAvailable ? 'Mark as Sold Out' : 'Mark as Available'}
                                                            >
                                                                {loadingMap[item.id] ? (
                                                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                                ) : item.isAvailable ? (
                                                                    <UtensilsCrossed className="w-4 h-4" />
                                                                ) : (
                                                                    <Plus className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Item Modal */}
            {showAddItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Add Menu Item to {selectedRestaurant?.name}</h3>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Quick Categories</label>
                                <div className="flex flex-wrap gap-2">
                                    {FOOD_CATEGORIES.map(cat => (
                                        <button
                                            key={cat.name}
                                            type="button"
                                            onClick={() => handleCategorySelect(cat)}
                                            className={`px-3 py-1 text-xs rounded-full transition-all ${newItem.category === cat.name
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Input
                                label="Item Name"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                placeholder="e.g., Margherita Pizza"
                                required
                            />
                            <Input
                                label="Price (₹)"
                                type="number"
                                step="1"
                                value={newItem.price}
                                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                placeholder="499"
                                required
                            />
                            <Input
                                label="Image URL"
                                value={newItem.image}
                                onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                            {newItem.image && (
                                <div className="h-24 rounded-lg overflow-hidden border">
                                    <img src={newItem.image} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <Input
                                label="Description"
                                value={newItem.description}
                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                placeholder="Brief description"
                            />
                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddItem(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1">
                                    Add Item
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
