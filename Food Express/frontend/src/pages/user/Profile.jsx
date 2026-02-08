import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Mail, Lock, Camera, CheckCircle } from 'lucide-react';

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        const result = await updateProfile({
            name: formData.name,
            email: formData.email,
            password: formData.password || undefined
        });

        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setFormData({ ...formData, password: '', confirmPassword: '' });
        } else {
            setMessage({ type: 'error', text: result.error });
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

            <div className="grid gap-8">
                {/* Profile Header */}
                <Card className="p-6">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                <User className="w-12 h-12" />
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-primary-600 transition-colors">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{user?.name}</h2>
                            <p className="text-gray-500 capitalize">{user?.role === 'user' ? 'Customer' : user?.role} Account</p>
                            <p className="text-xs text-gray-400 mt-1">Member since Feb 2024</p>
                        </div>
                    </div>
                </Card>

                {/* Profile Form */}
                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {message.text && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-primary-50 text-primary-700 border border-primary-200' : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
                                <p className="text-sm">{message.text}</p>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                label="Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                icon={User}
                                required
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                icon={Mail}
                                required
                            />
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Change Password
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <Input
                                    label="New Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Leave blank to keep current"
                                />
                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="Leave blank to keep current"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="secondary">Cancel</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving Changes...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
