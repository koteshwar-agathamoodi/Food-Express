import { useNavigate, Link } from 'react-router-dom';
import { Construction, ArrowLeft, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function ComingSoon() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50"></div>

            <div className="bg-white p-2 rounded-3xl shadow-2xl mb-8 relative z-10 border border-gray-100">
                <div className="bg-primary-50 w-24 h-24 rounded-2xl flex items-center justify-center">
                    <Construction className="w-12 h-12 text-primary-600 animate-pulse" />
                </div>
            </div>

            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight z-10">
                Working On It! 🚀
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed z-10">
                We're currently building something amazing for our future partners. We'll be ready to accept new registrations very soon!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 z-10">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 group border-2"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Go Back
                </Button>
                <Link to="/">
                    <Button
                        variant="primary"
                        size="lg"
                        className="flex items-center gap-2 shadow-xl shadow-primary-200/50 hover:scale-105 transition-all text-lg font-bold px-10"
                    >
                        Notify Me
                        <Send className="w-5 h-5" />
                    </Button>
                </Link>
            </div>

            {/* Progress Visualization */}
            <div className="mt-16 w-full max-w-md bg-gray-100 h-2.5 rounded-full overflow-hidden z-10 p-0.5 border border-gray-200">
                <div className="bg-primary-600 h-full rounded-full w-[85%] animate-shimmer relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-fast"></div>
                </div>
            </div>
            <p className="mt-3 text-sm font-bold text-primary-600 uppercase tracking-widest z-10">
                Implementation: 85% Complete
            </p>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer-fast {
                    animation: shimmer 1.5s infinite linear;
                }
            `}} />
        </div>
    );
}
