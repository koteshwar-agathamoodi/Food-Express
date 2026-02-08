import { useState, useRef, useEffect } from 'react';
import { Bell, Info, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';

export default function NotificationCenter() {
    const { notifications } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const unreadCount = (notifications || []).filter(n => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-primary-500" />;
            case 'WARNING': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            case 'ERROR': return <AlertCircle className="w-4 h-4 text-red-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    const getTypeStyles = (type) => {
        switch (type) {
            case 'SUCCESS': return 'bg-primary-50 text-primary-700 border-primary-100';
            case 'WARNING': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'ERROR': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-blue-50 text-blue-700 border-blue-100';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 z-50">
                    <Card className="overflow-hidden shadow-xl border-none ring-1 ring-black/5">
                        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center bg-white">
                                    <Bell className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                                    <p className="text-gray-500 text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 transition-colors hover:bg-gray-50 ${!notification.isRead ? 'bg-primary-50/30' : 'bg-white'}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="mt-1">{getTypeIcon(notification.type)}</div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                                                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                                            {new Date(notification.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
