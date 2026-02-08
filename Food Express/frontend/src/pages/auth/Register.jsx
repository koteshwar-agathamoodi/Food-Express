import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { User, ChefHat, Truck, CheckCircle } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const roles = [
        { id: 'user', label: 'Customer', icon: User, description: 'Order food from restaurants' },
        { id: 'owner', label: 'Restaurant Owner', icon: ChefHat, description: 'List your restaurant & sell food' },
        { id: 'delivery', label: 'Delivery Partner', icon: Truck, description: 'Deliver orders & earn money' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        const result = await register(formData.name, formData.email, formData.password, formData.role);

        if (result.success) {
            // Auto redirect based on role
            if (result.user.role === 'owner') navigate('/owner-dashboard');
            else if (result.user.role === 'delivery') navigate('/delivery');
            else navigate('/dashboard');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-8">
            <Card className="w-full max-w-lg p-8">
                <div className="text-center mb-8">
                    <img src="/logo.png" alt="Food Express" className="h-20 w-auto mx-auto mb-4 object-contain" />
                    <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-1">Join Food Express today</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">I want to join as</label>
                        <div className="grid grid-cols-1 gap-3">
                            {roles.map(role => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: role.id })}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${formData.role === role.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className={`p-3 rounded-xl ${formData.role === role.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                        <role.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{role.label}</p>
                                        <p className="text-sm text-gray-500">{role.description}</p>
                                    </div>
                                    {formData.role === role.id && <CheckCircle className="w-5 h-5 text-primary-600" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
                    <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
                    <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" required />
                    <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required />

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
                </p>
            </Card>
        </div>
    );
}
