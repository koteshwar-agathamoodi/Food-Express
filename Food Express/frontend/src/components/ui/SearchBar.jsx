import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Search, X, Store, UtensilsCrossed } from 'lucide-react';

export default function SearchBar() {
    const { restaurants } = useData();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState({ restaurants: [], items: [] });
    const searchRef = useRef(null);

    useEffect(() => {
        if (query.length > 1) {
            const searchTerm = query.toLowerCase();

            // Search restaurants
            const matchedRestaurants = restaurants.filter(r =>
                r.name.toLowerCase().includes(searchTerm) ||
                r.cuisine.toLowerCase().includes(searchTerm)
            ).slice(0, 3);

            // Search menu items across all restaurants
            const matchedItems = [];
            restaurants.forEach(restaurant => {
                restaurant.menu.forEach(item => {
                    if (item.name.toLowerCase().includes(searchTerm)) {
                        matchedItems.push({ ...item, restaurantId: restaurant.id, restaurantName: restaurant.name });
                    }
                });
            });

            setResults({
                restaurants: matchedRestaurants,
                items: matchedItems.slice(0, 5)
            });
            setIsOpen(true);
        } else {
            setResults({ restaurants: [], items: [] });
            setIsOpen(false);
        }
    }, [query, restaurants]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const clearSearch = () => {
        setQuery('');
        setIsOpen(false);
    };

    const hasResults = results.restaurants.length > 0 || results.items.length > 0;

    return (
        <div ref={searchRef} className="relative w-full max-w-xl">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search restaurants, dishes..."
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white shadow-sm"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isOpen && (
                <Card className="absolute top-full left-0 right-0 mt-2 py-2 max-h-96 overflow-y-auto z-50 shadow-lg">
                    {!hasResults ? (
                        <p className="px-4 py-3 text-gray-500 text-sm text-center">
                            No results found for "{query}"
                        </p>
                    ) : (
                        <>
                            {/* Restaurant Results */}
                            {results.restaurants.length > 0 && (
                                <div className="px-3 pb-2">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                                        Restaurants
                                    </p>
                                    {results.restaurants.map(restaurant => (
                                        <Link
                                            key={restaurant.id}
                                            to={`/restaurant/${restaurant.id}`}
                                            onClick={clearSearch}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{restaurant.name}</p>
                                                <p className="text-xs text-gray-500">{restaurant.cuisine} • {restaurant.menu.length} items</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Divider */}
                            {results.restaurants.length > 0 && results.items.length > 0 && (
                                <div className="border-t my-2" />
                            )}

                            {/* Menu Item Results */}
                            {results.items.length > 0 && (
                                <div className="px-3 pt-2">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                                        Menu Items
                                    </p>
                                    {results.items.map((item, i) => (
                                        <Link
                                            key={`${item.id}-${i}`}
                                            to={`/restaurant/${item.restaurantId}`}
                                            onClick={clearSearch}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-xs text-gray-500 truncate">from {item.restaurantName}</p>
                                            </div>
                                            <span className="text-sm font-semibold text-primary-600">${item.price.toFixed(2)}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </Card>
            )}
        </div>
    );
}
