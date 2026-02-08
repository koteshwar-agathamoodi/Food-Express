import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Store, Image, FileText, Tag, Plus } from 'lucide-react';

export default function AddRestaurant() {
    const { user } = useAuth();
    const { addRestaurant } = useData();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        cuisine: '',
        image: ''
    });

    const [imageUrls, setImageUrls] = useState(['']);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (index, value) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
        // Only join non-empty URLs
        const joined = newUrls.filter(url => url.trim() !== '').join(',');
        setFormData(prev => ({ ...prev, image: joined }));
    };

    const addImageField = () => setImageUrls([...imageUrls, '']);
    const removeImageField = (index) => {
        if (imageUrls.length > 1) {
            const newUrls = imageUrls.filter((_, i) => i !== index);
            setImageUrls(newUrls);
            const joined = newUrls.filter(url => url.trim() !== '').join(',');
            setFormData(prev => ({ ...prev, image: joined }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addRestaurant({ ...formData, ownerId: user.id });
        navigate('/owner-dashboard');
    };

    const cuisineOptions = ['Italian', 'Chinese', 'Indian', 'South Indian', 'Mexican', 'Japanese', 'Thai', 'Fast Food', 'American', 'Mediterranean', 'Street Food', 'Bakery', 'Desserts', 'Healthy', 'Continental'];

    const DEFAULT_IMAGES = [
        { name: 'Indian', url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80' },
        { name: 'South Indian', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80' },
        { name: 'Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80' },
        { name: 'Chinese', url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80' },
        { name: 'Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80' },
        { name: 'Burger', url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80' },
        { name: 'Fast Food', url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&q=80' },
        { name: 'Healthy', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80' },
        { name: 'Cafe', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80' },
        { name: 'Fine Dining', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80' },
        { name: 'Seafood', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80' },
        { name: 'Sushi', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80' },
        { name: 'Steak', url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80' },
        { name: 'Bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80' },
        { name: 'Dessert', url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80' },
    ];

    const selectDefaultImage = (url) => {
        const newUrls = [...imageUrls];
        // If the last one is empty, use it, otherwise add new
        if (newUrls[newUrls.length - 1] === '') {
            newUrls[newUrls.length - 1] = url;
        } else {
            newUrls.push(url);
        }
        setImageUrls(newUrls);
        const joined = newUrls.filter(u => u.trim() !== '').join(',');
        setFormData(prev => ({ ...prev, image: joined }));
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
            </button>

            <Card className="p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br outline-orange-400 bg-yellow-400 mb-4">
                        <Store className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Restaurant</h1>
                    <p className="text-gray-500 mt-1">Fill in the details to list your restaurant</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Store className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                        <Input
                            label="Restaurant Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Tasty Bites"
                            className="pl-10"
                            required
                        />
                    </div>

                    <div className="relative">
                        <FileText className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                        <Input
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of your restaurant"
                            className="pl-10"
                            required
                        />
                    </div>

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
                                        : 'bg-gray-100 text-blue-950 hover:bg-gray-200'
                                        }`}
                                >
                                    {cuisine}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Image className="w-4 h-4" />
                            Select from Default Images
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {DEFAULT_IMAGES.map((img, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => selectDefaultImage(img.url)}
                                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary-500 transition-all group"
                                    title={img.name}
                                >
                                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Plus className="w-4 h-4 text-white" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Image className="w-4 h-4" />
                            Or Provide Custom Image URLs
                        </label>
                        {imageUrls.map((url, index) => (
                            <div key={index} className="flex gap-2">
                                <div className="relative flex-1">
                                    <Image className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                    <Input
                                        value={url}
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="pl-10 h-10"
                                    />
                                </div>
                                {imageUrls.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeImageField(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Tag className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addImageField}
                            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
                        >
                            + Add another image URL
                        </button>
                    </div>

                    {imageUrls.some(u => u.trim() !== '') && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {imageUrls.filter(u => u.trim() !== '').map((url, idx) => (
                                <div key={idx} className="rounded-xl overflow-hidden h-32 border relative group">
                                    <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-xs font-medium">Image {idx + 1}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" className="flex-1" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            Add Restaurant
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
