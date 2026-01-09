import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const response = await api.get(`/events/${id}`);
            setEvent(response.data.event);
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate(`/booking/${id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <p className="text-2xl mb-4">Event not found</p>
                    <Link to="/" className="btn-pill">
                        Browse Events
                    </Link>
                </div>
            </div>
        );
    }

    const imageUrl = event.image
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${event.image}`
        : null;

    const getGradient = (category) => {
        const gradients = {
            'Music': 'from-purple-600 to-purple-800',
            'Sports': 'from-blue-600 to-blue-800',
            'Technology': 'from-cyan-600 to-cyan-800',
            'Arts': 'from-pink-600 to-pink-800',
            'Food': 'from-orange-600 to-orange-800',
            'Business': 'from-green-600 to-green-800',
        };
        return gradients[event.category] || 'from-purple-600 to-purple-800';
    };

    return (
        <div className="min-h-screen bg-black pb-20 pt-24">
            {/* Hero Image */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-96 overflow-hidden mb-12"
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getGradient(event.category)} flex items-center justify-center`}>
                        <div className="text-center">
                            <div className="text-9xl mb-4">🎫</div>
                            <p className="text-2xl font-semibold">{event.category || 'Event'}</p>
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            </motion.div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Event Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bento-card-dark"
                        >
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="inline-block bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                    {event.category}
                                </span>
                                <span className="inline-block bg-zinc-800 text-white px-4 py-2 rounded-full text-sm">
                                    🎟️ {event.available_seats} seats left
                                </span>
                            </div>

                            <h1 className="text-5xl font-bold mb-6 gradient-heading">{event.title}</h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center gap-3 text-lg">
                                    <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center">
                                        <span className="text-2xl">📅</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Date</p>
                                        <p className="font-semibold">{new Date(event.date).toLocaleDateString('en-US', {
                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                        })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-lg">
                                    <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center">
                                        <span className="text-2xl">⏰</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Time</p>
                                        <p className="font-semibold">{event.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-lg md:col-span-2">
                                    <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center">
                                        <span className="text-2xl">📍</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Location</p>
                                        <p className="font-semibold">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-zinc-800 pt-6">
                                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                                <p className="text-gray-300 leading-relaxed text-lg">{event.description}</p>
                            </div>
                        </motion.div>

                        {/* Map Section */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bento-card-dark"
                        >
                            <h2 className="text-2xl font-bold mb-4">Event Location</h2>
                            <div className="h-80 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                                {/* Google Maps Placeholder */}
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">🗺️</div>
                                        <p className="text-xl font-semibold mb-2">{event.location}</p>
                                        <p className="text-gray-400 text-sm mb-4">Google Maps integration</p>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-pill-outline text-sm py-2 px-6"
                                        >
                                            Open in Google Maps
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Booking Card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bento-card sticky top-24"
                        >
                            <div className="text-center mb-6">
                                <p className="text-gray-400 mb-2">Ticket Price</p>
                                <p className="text-6xl font-bold gradient-heading">₹{event.price}</p>
                            </div>

                            <div className="space-y-3 mb-6 p-4 bg-zinc-900 rounded-2xl">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Available Seats</span>
                                    <span className="font-semibold text-green-400">{event.available_seats}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Total Seats</span>
                                    <span className="font-semibold">{event.total_seats}</span>
                                </div>
                                <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all"
                                        style={{ width: `${(event.available_seats / event.total_seats) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <button
                                onClick={handleBookNow}
                                disabled={event.available_seats === 0}
                                className={`w-full ${event.available_seats === 0
                                    ? 'bg-zinc-700 cursor-not-allowed text-gray-400'
                                    : 'btn-pill'
                                    } justify-center text-lg`}
                            >
                                {event.available_seats === 0 ? (
                                    '🔒 Sold Out'
                                ) : (
                                    <>
                                        Book Now
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            {!user && (
                                <p className="text-xs text-center text-gray-400 mt-4">
                                    Please <Link to="/login" className="text-purple-400 hover:text-purple-300">login</Link> to book tickets
                                </p>
                            )}

                            <div className="mt-6 pt-6 border-t border-zinc-800">
                                <h3 className="font-semibold mb-3">What's Included:</h3>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Event entry ticket
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Digital QR code ticket
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Email confirmation
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
