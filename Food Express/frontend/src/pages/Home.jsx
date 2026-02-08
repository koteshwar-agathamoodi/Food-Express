import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
    UtensilsCrossed,
    ArrowRight,
    Star,
    Clock,
    Truck,
    Shield,
    ChefHat,
    Users,
    Smartphone
} from 'lucide-react';

export default function Home() {
    const { user } = useAuth();
    const { restaurants } = useData();
    const [currentSlide, setCurrentSlide] = useState(0);

    const heroSlides = [
        {
            title: 'Delicious Food Delivered Fast',
            subtitle: 'Order from the best local restaurants with easy, on-demand delivery.',
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80'
        },
        {
            title: 'Fresh & Tasty Every Time',
            subtitle: 'Quality ingredients, amazing taste, delivered to your doorstep.',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80'
        },
        {
            title: 'Explore World Cuisines',
            subtitle: 'From Italian to Japanese, discover flavors from around the world.',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const features = [
        { icon: Truck, title: 'Fast Delivery', description: '30 min or less guaranteed' },
        { icon: Shield, title: 'Secure Payment', description: 'Your data is always safe' },
        { icon: Clock, title: '24/7 Service', description: 'Order anytime, anywhere' },
        { icon: Star, title: 'Top Rated', description: 'Best restaurants only' }
    ];

    const popularRestaurants = restaurants.slice(0, 3);

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative -mx-4 -mt-8 overflow-hidden">
                <div className="relative h-[500px] md:h-[600px]">
                    {heroSlides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                        </div>
                    ))}

                    <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-4">
                            <div className="max-w-xl text-white">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                                    {heroSlides[currentSlide].title}
                                </h1>
                                <p className="text-lg md:text-xl text-white/80 mb-8">
                                    {heroSlides[currentSlide].subtitle}
                                </p>
                                <div className="flex gap-4">
                                    {user ? (
                                        <Link to={user.role === 'owner' ? '/owner-dashboard' : '/dashboard'}>
                                            <Button size="lg">
                                                Go to Dashboard
                                                <ArrowRight className="w-5 h-5" />
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link to="/register">
                                                <Button size="lg">
                                                    Get Started
                                                    <ArrowRight className="w-5 h-5" />
                                                </Button>
                                            </Link>
                                            <Link to="/login">
                                                <Button size="lg" variant="secondary" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                                                    Sign In
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {heroSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-white' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {features.map((feature, i) => (
                    <Card key={i} className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 text-primary-600 mb-3">
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                        <p className="text-sm text-gray-500">{feature.description}</p>
                    </Card>
                ))}
            </section>

            {/* Popular Restaurants */}
            {popularRestaurants.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold">Popular Restaurants</h2>
                        <Link to={user ? '/dashboard' : '/login'} className="text-primary-600 hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {popularRestaurants.map(restaurant => (
                            <Card key={restaurant.id} className="overflow-hidden hover:shadow-xl transition-all group">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={restaurant.image}
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        {restaurant.rating || 4.5}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                                    <p className="text-gray-500 text-sm">{restaurant.cuisine}</p>
                                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {restaurant.deliveryTime || '25-35'} min
                                        </span>
                                        <span>{restaurant.menu.length} items</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* How It Works */}
            <section className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold">
                            1
                        </div>
                        <h3 className="font-semibold text-lg">Choose Restaurant</h3>
                        <p className="text-gray-500">Browse from hundreds of restaurants and cuisines</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-secondary-500/20 text-secondary-500 flex items-center justify-center text-2xl font-bold">
                            2
                        </div>
                        <h3 className="font-semibold text-lg">Place Your Order</h3>
                        <p className="text-gray-500">Select your favorite dishes and checkout</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold">
                            3
                        </div>
                        <h3 className="font-semibold text-lg">Enjoy Your Food</h3>
                        <p className="text-gray-500">Get fast delivery right to your doorstep</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!user && (
                <section className="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl p-8 md:p-12 text-white text-center">
                    <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Order?</h2>
                    <p className="text-white/80 mb-6 max-w-xl mx-auto">
                        Join Food Express today and discover amazing food from the best restaurants in your area.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link to="/register">
                            <Button className="bg-white text-primary-600 hover:bg-gray-100">
                                <Users className="w-5 h-5" />
                                Create Account
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="ghost" className="text-white border border-white/30 hover:bg-white/10">
                                <ChefHat className="w-5 h-5" />
                                Become a Partner
                            </Button>
                        </Link>
                    </div>
                </section>
            )}

            {/* App Download */}
            <section className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Get the App</h2>
                    <p className="text-gray-600 mb-6">
                        Download our mobile app for a better experience. Get exclusive offers,
                        real-time tracking, and faster checkout.
                    </p>
                    <div className="flex gap-4">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/200px-Download_on_the_App_Store_Badge.svg.png"
                            alt="App Store"
                            className="h-12 cursor-pointer hover:opacity-80 transition-opacity"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/200px-Google_Play_Store_badge_EN.svg.png"
                            alt="Google Play"
                            className="h-12 cursor-pointer hover:opacity-80 transition-opacity"
                        />
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-64 h-[500px] bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl flex items-center justify-center">
                            <Smartphone className="w-32 h-32 text-primary-300" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
