import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(formData.email, formData.password);

            // Check if user is admin
            if (result.user.role !== 'admin') {
                setError('Access denied. Admin credentials required.');
                setLoading(false);
                return;
            }

            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid admin credentials');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black py-32">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md px-6"
            >
                <div className="bento-card-dark">
                    {/* Admin Badge */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-2 rounded-full">
                            <span className="text-sm font-bold">🔐 ADMIN ACCESS</span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-center mb-2 gradient-heading">
                        Admin Login
                    </h1>
                    <p className="text-center text-gray-400 mb-8">
                        Authorized personnel only
                    </p>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-2xl mb-6"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="admin@eventhub.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-pill w-full justify-center text-lg"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Access Admin Panel
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                        <p className="text-sm text-gray-400">
                            Regular user?{' '}
                            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                                User Login
                            </Link>
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            <Link to="/" className="hover:text-gray-400">
                                ← Back to Home
                            </Link>
                        </p>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
                        <p className="text-xs text-yellow-200 text-center">
                            ⚠️ This area is restricted to authorized administrators only. All access attempts are logged.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
