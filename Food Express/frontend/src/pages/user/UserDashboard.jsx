import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Search, Star, Clock, MapPin, Filter, X } from 'lucide-react';

const CUISINES = ['All', 'North Indian', 'South Indian', 'Street Food', 'Biryani', 'Gujarati', 'Bengali', 'Chinese', 'Fast Food'];

export default function UserDashboard() {
    const { restaurants, loading } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    const filteredRestaurants = (restaurants || []).filter(restaurant => {
        const name = restaurant?.name || '';
        const cuisine = restaurant?.cuisine || '';
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cuisine.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCuisine = selectedCuisine === 'All' || cuisine === selectedCuisine;
        return matchesSearch && matchesCuisine;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    What would you like to eat?
                </h1>
                <p className="text-gray-500">Order delicious food from the best restaurants near you</p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for restaurants or dishes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    )}
                </div>
                <Button
                    variant="secondary"
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden"
                >
                    <Filter className="w-5 h-5" />
                    Filters
                </Button>
            </div>

            {/* Cuisine Chips */}
            <div className={`flex flex-wrap gap-2 ${!showFilters && 'hidden md:flex'}`}>
                {CUISINES.map(cuisine => (
                    <button
                        key={cuisine}
                        onClick={() => setSelectedCuisine(cuisine)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCuisine === cuisine
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:shadow'
                            }`}
                    >
                        {cuisine}
                    </button>
                ))}
            </div>

            {/* Results Count */}
            <p className="text-gray-500">
                {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
            </p>

            {/* Restaurant Grid */}
            {filteredRestaurants.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-gray-500">No restaurants found matching your criteria.</p>
                    <Button
                        variant="secondary"
                        className="mt-4"
                        onClick={() => { setSearchQuery(''); setSelectedCuisine('All'); }}
                    >
                        Clear Filters
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRestaurants.map(restaurant => (
                        <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
                            <Card className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer h-full">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={restaurant.image.split(',')[0]}
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        {restaurant.rating}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                        <span className="text-white/80 text-sm">{restaurant.cuisine}</span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{restaurant.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {restaurant.deliveryTime || '30-40'} min
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            2.5 km
                                        </span>
                                        <span>{restaurant.menu?.length || 0} items</span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
