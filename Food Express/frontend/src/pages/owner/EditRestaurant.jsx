import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Store, Image, Trash2, Edit2, Save, X } from 'lucide-react';

export default function EditRestaurant() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        restaurants,
        updateRestaurant,
        deleteRestaurant,
        updateMenuItem,
        deleteMenuItem,
        addMenuItem
    } = useData();

    const restaurant = restaurants.find(r => String(r.id) === String(id) && r.owner?.id === user.id);

    const [newItem, setNewItem] = useState({ name: '', price: '', description: '', image: '' });

    const [formData, setFormData] = useState(restaurant ? {
        name: restaurant.name,
        description: restaurant.description,
        cuisine: restaurant.cuisine,
        image: restaurant.image
    } : {});

    const [editingItem, setEditingItem] = useState(null);
    const [itemData, setItemData] = useState({});

    if (!restaurant) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Restaurant not found.</p>
                <Button onClick={() => navigate('/owner-dashboard')} className="mt-4">
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateRestaurant(id, formData);
        navigate('/owner-dashboard');
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this restaurant? This cannot be undone.')) {
            deleteRestaurant(id);
            navigate('/owner-dashboard');
        }
    };

    const handleEditItem = (item) => {
        setEditingItem(item.id);
        setItemData({ name: item.name, price: item.price, description: item.description });
    };

    const handleSaveItem = (itemId) => {
        updateMenuItem(id, itemId, { ...itemData, price: parseFloat(itemData.price) });
        setEditingItem(null);
    };

    const handleDeleteItem = (itemId) => {
        if (window.confirm('Delete this menu item?')) {
            deleteMenuItem(id, itemId);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        const result = await addMenuItem({ ...newItem, price: parseFloat(newItem.price) });
        if (result.success) {
            setNewItem({ name: '', price: '', description: '', image: '' });
        }
    };

    const cuisineOptions = ['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'Thai', 'Fast Food', 'American', 'Mediterranean'];

    return (
        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate('/owner-dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
            </button>

            {/* Restaurant Details */}
            <Card className="p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Store className="w-5 h-5" />
                        Restaurant Details
                    </h2>
                    <Button variant="danger" size="sm" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4" />
                        Delete Restaurant
                    </Button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <Input
                        label="Restaurant Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Cuisine Type</label>
                        <div className="flex flex-wrap gap-2">
                            {cuisineOptions.map(cuisine => (
                                <button
                                    key={cuisine}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, cuisine })}
                                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${formData.cuisine === cuisine
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {cuisine}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Input
                        label="Image URL"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                    />
                    {formData.image && (
                        <div className="rounded-xl overflow-hidden h-40">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <Button type="submit" className="w-full">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </Button>
                </form>
            </Card>

            {/* Menu Items */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Menu Items ({restaurant.menu.length})</h2>
                </div>

                {/* Add New Item Form */}
                <form onSubmit={handleAddItem} className="mb-8 p-4 bg-primary-50 rounded-xl border border-primary-100">
                    <h3 className="text-sm font-semibold text-primary-700 mb-3 uppercase tracking-wider">Add New Item</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <Input
                            placeholder="Item Name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            required
                        />
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Price (₹)"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            required
                        />
                    </div>
                    <Input
                        placeholder="Description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        className="mb-3"
                    />
                    <Input
                        placeholder="Image URL"
                        value={newItem.image}
                        onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                        className="mb-3"
                    />
                    <Button type="submit" size="sm" className="w-full">
                        Add to Menu
                    </Button>
                </form>

                {restaurant.menu.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No menu items yet.</p>
                ) : (
                    <div className="space-y-3">
                        {restaurant.menu.map(item => (
                            <div key={item.id} className="p-4 bg-gray-50 rounded-xl">
                                {editingItem === item.id ? (
                                    <div className="space-y-3">
                                        <Input
                                            placeholder="Item name"
                                            value={itemData.name}
                                            onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="Price"
                                                value={itemData.price}
                                                onChange={(e) => setItemData({ ...itemData, price: e.target.value })}
                                            />
                                            <Input
                                                placeholder="Description"
                                                value={itemData.description}
                                                onChange={(e) => setItemData({ ...itemData, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleSaveItem(item.id)}>
                                                <Save className="w-4 h-4" />
                                                Save
                                            </Button>
                                            <Button size="sm" variant="secondary" onClick={() => setEditingItem(null)}>
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                            ) : (
                                                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                                                    <Image className="w-8 h-8" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-500">{item.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-primary-600">₹{item.price.toFixed(0)}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditItem(item)}
                                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
