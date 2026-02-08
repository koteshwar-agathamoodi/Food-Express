import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
    UtensilsCrossed,
    Truck,
    Clock,
    Shield,
    Star,
    Users,
    ChefHat,
    Smartphone,
    Award,
    Heart
} from 'lucide-react';

export default function About() {
    const stats = [
        { number: '10K+', label: 'Active Users' },
        { number: '500+', label: 'Restaurants' },
        { number: '50K+', label: 'Orders Delivered' },
        { number: '4.8', label: 'App Rating' }
    ];

    const features = [
        { icon: Truck, title: 'Fast Delivery', description: 'Get your food delivered in 30 minutes or less' },
        { icon: Shield, title: 'Safe & Secure', description: 'Your payments and data are always protected' },
        { icon: Clock, title: '24/7 Service', description: 'Order anytime, we never close' },
        { icon: Star, title: 'Best Quality', description: 'Partnered with top-rated restaurants only' }
    ];

    const team = [
        { name: 'John Smith', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
        { name: 'Sarah Johnson', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
        { name: 'Michael Chen', role: 'CTO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
        { name: 'Emily Davis', role: 'Head of Marketing', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' }
    ];

    return (
        <div className="space-y-16 py-8">
            {/* Hero Section */}
            <section className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 mb-6">
                    <UtensilsCrossed className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    About <span className="text-primary-600">Food Express</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    We're on a mission to deliver happiness, one meal at a time. Connecting hungry people
                    with the best local restaurants since 2020.
                </p>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6 text-center bg-gradient-to-br from-primary-50 to-white">
                        <p className="text-3xl md:text-4xl font-bold text-primary-600">{stat.number}</p>
                        <p className="text-gray-500 mt-1">{stat.label}</p>
                    </Card>
                ))}
            </section>

            {/* Our Story */}
            <section className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                    <div className="space-y-4 text-gray-600">
                        <p>
                            Food Express was born from a simple idea: everyone deserves access to great food,
                            delivered fast and fresh. What started in a small kitchen in 2020 has grown into
                            a platform serving thousands of happy customers daily.
                        </p>
                        <p>
                            We partner with the best local restaurants to bring you authentic flavors from
                            around the world. From quick bites to gourmet dining, we've got something for
                            every craving.
                        </p>
                        <p>
                            Our commitment to quality, speed, and customer satisfaction has made us the
                            preferred food delivery platform in the region.
                        </p>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <Link to="/register">
                            <Button>Join Us Today</Button>
                        </Link>
                        <Link to="/dashboard">
                            <Button variant="secondary">Browse Restaurants</Button>
                        </Link>
                    </div>
                </div>
                <div className="relative">
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"
                        alt="Delicious Food"
                        className="rounded-2xl shadow-xl"
                    />
                    <div className="absolute -bottom-4 -left-4 p-4 bg-white rounded-xl shadow-lg">
                        <div className="flex items-center gap-2">
                            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                            <span className="font-semibold">Made with Love</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Choose Us?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <Card key={i} className="p-6 text-center hover:shadow-lg transition-shadow">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-100 text-primary-600 mb-4">
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                            <p className="text-gray-500 text-sm">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Team */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Meet Our Team</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {team.map((member, i) => (
                        <Card key={i} className="p-6 text-center hover:shadow-lg transition-shadow">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                            />
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-gray-500 text-sm">{member.role}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="text-center bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl p-12 text-white">
                <ChefHat className="w-16 h-16 mx-auto mb-4 opacity-80" />
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                    Join thousands of happy customers and restaurant partners. Your next favorite meal is just a click away!
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/register">
                        <Button className="bg-white text-primary-600 hover:bg-gray-100">
                            <Users className="w-5 h-5" />
                            Create Account
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="ghost" className="text-white border border-white/30 hover:bg-white/10">
                            <ChefHat className="w-5 h-5" />
                            Partner With Us
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
