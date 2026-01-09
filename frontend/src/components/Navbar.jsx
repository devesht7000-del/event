import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion as Motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <Motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-zinc-900"
        >
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                            <span className="text-xl">🎫</span>
                        </div>
                        <span className="text-2xl font-bold gradient-heading">EventHub</span>
                    </Link>

                    {/* Contact Info (Desktop) */}
                    <div className="hidden lg:flex items-center space-x-6 text-sm text-gray-400">
                        <a href="tel:7000590370" className="hover:text-purple-400 transition-colors">
                            📞 7000590370
                        </a>
                        <a href="mailto:info@eventhub.com" className="hover:text-purple-400 transition-colors">
                            ✉️ info@eventhub.com
                        </a>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="hover:text-purple-400 transition-colors">
                                    My Bookings
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link to="/admin" className="hover:text-purple-400 transition-colors">
                                        Admin
                                    </Link>
                                )}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-400">Hi, {user.name}</span>
                                    <button
                                        onClick={logout}
                                        className="btn-pill-outline text-sm py-2 px-4"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/admin/login" className="text-purple-400 hover:text-purple-300 transition-colors font-semibold">
                                    Admin Login
                                </Link>
                                <Link to="/login" className="btn-pill-outline text-sm py-2 px-4">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-pill text-sm py-2 px-4">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Motion.nav>
    );
};

export default Navbar;
