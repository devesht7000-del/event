import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const LandingPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [email, setEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async (filters = {}) => {
        try {
            setLoading(true);
            const params = new URLSearchParams(filters).toString();
            const response = await api.get(`/events?${params}`);
            setEvents(response.data.events);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchEvents({ search: searchTerm, category: selectedCategory });
    };

    const handleNewsletter = (e) => {
        e.preventDefault();
        setNewsletterStatus('success');
        setEmail('');
        setTimeout(() => setNewsletterStatus(''), 3000);
    };

    const categories = [
        { name: 'Music', icon: '🎵', color: 'from-purple-600 to-pink-600' },
        { name: 'Sports', icon: '⚽', color: 'from-blue-600 to-cyan-600' },
        { name: 'Technology', icon: '💻', color: 'from-green-600 to-emerald-600' },
        { name: 'Arts', icon: '🎨', color: 'from-orange-600 to-yellow-600' },
        { name: 'Food', icon: '🍕', color: 'from-red-600 to-rose-600' },
        { name: 'Business', icon: '💼', color: 'from-indigo-600 to-purple-600' },
    ];

    const stats = [
        { number: '10K+', label: 'Events Hosted', icon: '🎉' },
        { number: '50K+', label: 'Happy Customers', icon: '😊' },
        { number: '100+', label: 'Cities', icon: '🌍' },
        { number: '4.9/5', label: 'Average Rating', icon: '⭐' },
    ];

    const featuredEvents = events.slice(0, 3);

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section - Enhanced */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background with Particles */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-black animate-gradient-shift"></div>

                    {/* Floating Particles */}
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-particle"></div>
                    <div className="absolute top-40 right-20 w-64 h-64 bg-pink-600/15 rounded-full blur-3xl animate-particle" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-particle" style={{ animationDelay: '4s' }}></div>
                    <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-particle" style={{ animationDelay: '6s' }}></div>

                    {/* Gradient Mesh */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500 to-transparent rounded-full blur-3xl animate-float"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-500 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
                    </div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Glowing Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block mb-6"
                        >
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold animate-glow-pulse">
                                🎉 #1 Event Booking Platform
                            </span>
                        </motion.div>

                        <motion.h1
                            className="text-6xl md:text-8xl font-bold mb-8 gradient-heading text-shadow-glow"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            Discover. Book.<br />
                            Experience.
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Your gateway to unforgettable experiences. From concerts to conferences,
                            find and book amazing events in your city.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Link to="#events" className="btn-pill text-lg px-8 py-4 hover-lift">
                                Explore Events
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link to="/register" className="btn-pill-outline text-lg px-8 py-4 hover-lift glass-card">
                                Sign Up Free
                            </Link>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-400"
                        >
                            <div className="flex items-center gap-2 hover:text-green-400 transition-colors">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Secure Payments</span>
                            </div>
                            <div className="flex items-center gap-2 hover:text-green-400 transition-colors">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Instant Confirmation</span>
                            </div>
                            <div className="flex items-center gap-2 hover:text-green-400 transition-colors">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>24/7 Support</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                >
                    <svg className="w-6 h-6 text-purple-400 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>
            </section>

            {/* Stats Section - Enhanced */}
            <section className="py-20 bg-zinc-950 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/30 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, rotateY: 5 }}
                                className="text-center glass-card rounded-3xl p-8 hover:glow-border transition-all duration-300 perspective-1000"
                            >
                                <motion.div
                                    className="text-4xl mb-2"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    {stat.icon}
                                </motion.div>
                                <div className="text-4xl md:text-5xl font-bold gradient-heading mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-400">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section - Enhanced */}
            <section className="py-24 bg-black relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 left-20 w-64 h-64 bg-pink-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="section-heading gradient-heading">Browse by Category</h2>
                        <p className="section-subheading mx-auto">
                            Discover events that match your interests
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category, index) => (
                            <motion.button
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.1, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setSelectedCategory(category.name);
                                    fetchEvents({ category: category.name });
                                }}
                                className="glass-card text-center p-6 cursor-pointer group rounded-3xl hover:glow-border transition-all duration-300"
                            >
                                <motion.div
                                    className={`text-5xl mb-3`}
                                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {category.icon}
                                </motion.div>
                                <div className="font-semibold group-hover:text-purple-400 transition-colors">{category.name}</div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Events Section - Enhanced */}
            <section id="events" className="py-24 bg-zinc-950 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="section-heading gradient-heading">Featured Events</h2>
                        <p className="section-subheading mx-auto">
                            Handpicked events you don't want to miss
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                        </div>
                    ) : featuredEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featuredEvents.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="glass-card-strong rounded-3xl overflow-hidden group hover:glow-border-strong transition-all duration-300"
                                >
                                    {/* Event Image with Zoom Effect */}
                                    <div className="relative h-48 overflow-hidden rounded-2xl mb-6">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${categories[index % categories.length]?.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                            <div className="text-6xl">{categories[index % categories.length]?.icon}</div>
                                        </div>
                                        {/* Shimmer Effect */}
                                        <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>

                                    <div className="space-y-4 p-6">
                                        <div>
                                            <span className="inline-block bg-purple-600 text-white text-xs px-3 py-1 rounded-full mb-3">
                                                {event.category || 'Event'}
                                            </span>
                                            <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <span>📅</span>
                                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <span>📍</span>
                                                <span className="line-clamp-1">{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <span>🎟️</span>
                                                <span>{event.available_seats} seats left</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-zinc-700">
                                            <span className="text-3xl font-bold text-purple-400">₹{event.price}</span>
                                            <Link to={`/events/${event.id}`}>
                                                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-all transform hover:scale-105 hover-lift">
                                                    Book Now
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🎭</div>
                            <p className="text-xl text-gray-400">No events available yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Search & Filter Section */}
            <section className="py-24 bg-black">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bento-card-dark max-w-4xl mx-auto"
                    >
                        <h3 className="text-3xl font-bold mb-6 text-center gradient-heading">Find Your Perfect Event</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="bg-zinc-800 border border-zinc-700 rounded-full px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 rounded-full px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                                ))}
                            </select>
                            <button onClick={handleSearch} className="btn-pill justify-center">
                                Search
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* All Events Grid */}
            {events.length > 3 && (
                <section className="py-24 bg-zinc-950">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="section-heading gradient-heading">All Upcoming Events</h2>
                            <p className="section-subheading mx-auto">
                                Browse through all our amazing events
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {events.slice(3).map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="speaker-card group"
                                >
                                    <div
                                        className="speaker-card-top"
                                        style={{
                                            background: `linear-gradient(135deg, ${categories[index % categories.length]?.color.split(' ')[0].replace('from-', '#')})`
                                        }}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-6xl">{categories[index % categories.length]?.icon}</div>
                                        </div>
                                    </div>
                                    <div className="speaker-card-bottom">
                                        <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                                            {event.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-3 line-clamp-1">{event.location}</p>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-purple-400 font-semibold">₹{event.price}</span>
                                            <span className="text-xs text-gray-500">{event.available_seats} seats</span>
                                        </div>
                                        <Link to={`/events/${event.id}`}>
                                            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-full transition-all text-sm">
                                                View Details
                                            </button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Newsletter Section - NEW */}
            <section className="py-24 bg-black">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bento-card-dark max-w-2xl mx-auto text-center"
                    >
                        <div className="text-5xl mb-4">📧</div>
                        <h3 className="text-3xl font-bold mb-4 gradient-heading">Stay in the Loop</h3>
                        <p className="text-gray-400 mb-8">
                            Subscribe to our newsletter and never miss out on exclusive events and early bird offers
                        </p>
                        <form onSubmit={handleNewsletter} className="flex gap-4">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-full px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <button type="submit" className="btn-pill px-8">
                                Subscribe
                            </button>
                        </form>
                        {newsletterStatus === 'success' && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-green-400 mt-4"
                            >
                                ✓ Successfully subscribed!
                            </motion.p>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-6xl font-bold mb-6">
                            Ready to Experience<br />Something Amazing?
                        </h2>
                        <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
                            Join thousands of event-goers who trust us to deliver unforgettable experiences
                        </p>
                        <Link to="/register" className="btn-pill text-lg px-10 py-5 bg-white text-purple-900 hover:bg-gray-100">
                            Get Started Now
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-12 border-t border-zinc-900">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h4 className="text-xl font-bold mb-4 gradient-heading">EventHub</h4>
                            <p className="text-gray-400 text-sm">
                                Your gateway to unforgettable experiences.
                            </p>
                        </div>
                        <div>
                            <h5 className="font-semibold mb-4">Quick Links</h5>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link to="/events" className="hover:text-purple-400 transition-colors">Browse Events</Link></li>
                                <li><Link to="/register" className="hover:text-purple-400 transition-colors">Sign Up</Link></li>
                                <li><Link to="/login" className="hover:text-purple-400 transition-colors">Login</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold mb-4">Support</h5>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-purple-400 transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-purple-400 transition-colors">FAQs</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold mb-4">Legal</h5>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-purple-400 transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center text-gray-400 pt-8 border-t border-zinc-900">
                        <p>© 2026 EventHub. All rights reserved. Made with ❤️ for event lovers</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
