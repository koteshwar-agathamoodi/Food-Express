import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2, MessageSquare, ShoppingBag, Truck, Info, Clock, ChefHat, IndianRupee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export default function ChatBot() {
    const { user } = useAuth();
    const { orders } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: getInitialMessage() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    function getInitialMessage() {
        const name = user?.name || 'there';
        if (user?.role === 'admin') return `Welcome back, Admin ${name}! 🛡️ Ready to review pending requests or check system stats?`;
        if (user?.role === 'owner') return `Hello ${name}! 👨‍🍳 Need help with your menu or checking your active orders?`;
        if (user?.role === 'delivery') return `Hi ${name}! 🛵 Stay safe. Need to check your earnings or verify a delivery?`;
        return `Hi ${name}! 👋 I'm your FoodExpress assistant. How can I help you today?`;
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response delay
        setTimeout(() => {
            const botResponse = getBotResponse(input);
            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: botResponse }]);
            setIsTyping(false);
        }, 800);
    };

    const getBotResponse = (query) => {
        const q = query.toLowerCase();
        const role = user?.role;

        // Admin Specific
        if (role === 'admin') {
            if (q.includes('pending') || q.includes('approve') || q.includes('request')) {
                return "You can manage pending owner and agent requests in the 'Pending Approvals' tab of your dashboard.";
            }
            if (q.includes('user') || q.includes('delete')) {
                return "Use the 'All Users' tab to view or delete user accounts. Deleting an owner will also remove their restaurant.";
            }
        }

        // Owner Specific
        if (role === 'owner') {
            if (q.includes('menu') || q.includes('food') || q.includes('price')) {
                return "Manage your food items and prices in your dashboard. You can also toggle items as 'Sold Out'.";
            }
            if (q.includes('order') || q.includes('incoming')) {
                return "All active customer orders appear in your 'Orders' tab for real-time management.";
            }
        }

        // Delivery Specific
        if (role === 'delivery') {
            if (q.includes('earn') || q.includes('payout')) {
                return "Payouts are tracked per delivery. Check your earnings summary on the main dashboard.";
            }
            if (q.includes('verify') || q.includes('code') || q.includes('qr')) {
                return "Once at the customer's location, click 'Verify & Deliver' and enter their 6-digit code or scan their QR.";
            }
        }

        // General/User
        if (q.includes('order') || q.includes('status') || q.includes('where')) {
            const userOrders = orders && orders.length > 0 ? orders : [];
            const latestOrder = userOrders[userOrders.length - 1];

            if (!latestOrder) {
                return "I couldn't find any recent orders for you. Try our delicious food! 🍕";
            }

            const statusMap = {
                'PLACED': 'is being reviewed',
                'ACCEPTED': 'is being prepared',
                'ON_THE_WAY': 'is out for delivery! 🛵',
                'DELIVERED': 'was successfully delivered! 😋'
            };

            return `Your latest order #${latestOrder.id} ${statusMap[latestOrder.status] || 'is being processed'}. Check the tracking page for details.`;
        }

        if (q.includes('contact') || q.includes('help') || q.includes('support')) {
            return "Email: kagathamoodi@gmail.com | Helpline: 9415849521.";
        }

        return "I'm here to help! Ask about your dashboard, orders, or how to use the app features. 😊";
    };

    function getSuggestionChips() {
        if (user?.role === 'admin') return [
            { icon: <Clock size={14} />, label: 'Pending Requests' },
            { icon: <User size={14} />, label: 'Manage Users' },
            { icon: <Info size={14} />, label: 'Stats' }
        ];
        if (user?.role === 'owner') return [
            { icon: <ChefHat size={14} />, label: 'Menu' },
            { icon: <ShoppingBag size={14} />, label: 'Active Orders' },
            { icon: <MessageSquare size={14} />, label: 'Support' }
        ];
        if (user?.role === 'delivery') return [
            { icon: <IndianRupee size={14} />, label: 'Earnings' },
            { icon: <Truck size={14} />, label: 'Verify Delivery' },
            { icon: <MessageSquare size={14} />, label: 'Support' }
        ];
        return [
            { icon: <Truck size={14} />, label: 'Order Status' },
            { icon: <Info size={14} />, label: 'Delivery Fee' },
            { icon: <MessageSquare size={14} />, label: 'Contact Help' }
        ];
    }

    if (!user) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {/* Chat Bubble */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-primary-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-primary-700 hover:scale-110 transition-all duration-300 group"
                >
                    <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-primary-500 border-2 border-white"></span>
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[380px] h-[550px] flex flex-col shadow-2xl border-primary-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="p-4 bg-primary-600 text-white flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold">FoodExpress Butler</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] text-primary-100 font-medium">Online & Ready to Help</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-end gap-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.type === 'user' ? 'bg-primary-100 text-primary-600' : 'bg-white text-gray-400 border border-gray-100'
                                        }`}>
                                        {msg.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl shadow-sm text-sm ${msg.type === 'user'
                                        ? 'bg-primary-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex items-end gap-2">
                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestion Chips */}
                    <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t bg-white">
                        {getSuggestionChips().map(chip => (
                            <button
                                key={chip.label}
                                onClick={() => setInput(chip.label)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-primary-50 text-gray-600 hover:text-primary-600 border border-gray-100 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                            >
                                {chip.icon}
                                {chip.label}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-gray-50 border-none focus:ring-2 focus:ring-primary-500 rounded-xl px-4 py-2 text-sm outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition-all shadow-sm"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </Card>
            )}
        </div>
    );
}
