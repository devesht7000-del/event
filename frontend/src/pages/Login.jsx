import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-32 bg-black">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bento-card-dark max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-heading mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Login to your account</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-2xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 w-full focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 w-full focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-pill w-full justify-center"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold">
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
