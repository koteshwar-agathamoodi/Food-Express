import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <div className="relative mb-8">
                <div className="text-[150px] font-black text-gray-100 select-none">404</div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center animate-bounce shadow-xl">
                        <Search className="w-12 h-12 text-primary-600" />
                    </div>
                </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                Oops! Page Not Found
            </h1>
            <p className="text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" size="lg" onClick={() => window.history.back()} className="flex items-center gap-2 px-8">
                    <ArrowLeft className="w-5 h-5" />
                    Go Back
                </Button>
                <Link to="/">
                    <Button variant="primary" size="lg" className="flex items-center gap-2 shadow-lg shadow-primary-200 px-8">
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Button>
                </Link>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
        </div>
    );
}
