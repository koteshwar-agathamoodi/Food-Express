import { Link } from 'react-router-dom';
import { Github, Linkedin, Globe, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <img
                            src="/logo.png"
                            alt="Food Express"
                            className="h-16 w-auto mb-4 object-contain bg-white rounded-lg p-2"
                        />
                        <p className="text-sm text-gray-400 mb-4">
                            Delivering happiness to your doorstep since 2026. Order from the best restaurants in your city.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors" title="GitHub">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors" title="LinkedIn">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors" title="Portfolio">
                                <Globe className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
                            <li><Link to="/dashboard" className="hover:text-primary-400 transition-colors">Browse Restaurants</Link></li>
                            <li><Link to="/partner" className="hover:text-primary-400 transition-colors">Become a Partner</Link></li>
                            <li><Link to="/partner" className="hover:text-primary-400 transition-colors">Become a Delivery Partner</Link></li>
                            <li><Link to="/developers" className="hover:text-primary-400 transition-colors font-bold text-primary-400">Our Developers</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/refund" className="hover:text-primary-400 transition-colors">Refund Policy</Link></li>
                            <li><Link to="/cookie" className="hover:text-primary-400 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary-400" />
                                <span>12-2-707 Cyber tower hyderabad</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary-400" />
                                <span>+91 94158 49521</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary-400" />
                                <span>kagathamoodi@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
                    <p>© 2026 Food Express. All rights reserved. Made with ❤️ in India</p>
                </div>
            </div>
        </footer>
    );
}
