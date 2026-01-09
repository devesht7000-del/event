import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const BookingFlow = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [numTickets, setNumTickets] = useState(1);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    const fetchEvent = async () => {
        try {
            const response = await api.get(`/events/${eventId}`);
            setEvent(response.data.event);
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        setError('');
        setBooking(true);

        try {
            const response = await api.post('/bookings', {
                event_id: eventId,
                num_tickets: numTickets
            });

            // Success animation
            setSuccess(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#7c3aed', '#a855f7', '#c084fc']
            });

            // Bug Fix #10: Store timeout reference for cleanup
            const redirectTimeout = setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

            // Return cleanup function
            return () => clearTimeout(redirectTimeout);
        } catch (error) {
            setError(error.response?.data?.message || 'Booking failed');
            setBooking(false);
        }
    };

    const incrementTickets = () => {
        if (numTickets < event.available_seats) {
            setNumTickets(numTickets + 1);
        }
    };

    const decrementTickets = () => {
        if (numTickets > 1) {
            setNumTickets(numTickets - 1);
        }
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
                <p className="text-xl">Event not found</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center"
                >
                    <div className="text-8xl mb-6">🎉</div>
                    <h1 className="text-5xl font-bold gradient-heading mb-4">Booking Successful!</h1>
                    <p className="text-xl text-gray-400">Redirecting to your dashboard...</p>
                </motion.div>
            </div>
        );
    }

    const totalPrice = event.price * numTickets;

    return (
        <div className="min-h-screen py-32 bg-black">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto"
                >
                    <h1 className="text-5xl font-bold gradient-heading mb-12">Complete Your Booking</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Event Summary */}
                        <div className="bento-card-dark">
                            <h2 className="text-2xl font-bold mb-6">Event Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Event</p>
                                    <p className="text-xl font-semibold">{event.title}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Date</p>
                                        <div className="flex items-center gap-2">
                                            <span>📅</span>
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Time</p>
                                        <div className="flex items-center gap-2">
                                            <span>⏰</span>
                                            <span>{event.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Location</p>
                                    <div className="flex items-center gap-2">
                                        <span>📍</span>
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Form */}
                        <div className="bento-card-dark">
                            <h2 className="text-2xl font-bold mb-6">Ticket Selection</h2>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-2xl mb-6"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-3">
                                        Number of Tickets
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={decrementTickets}
                                            disabled={numTickets <= 1}
                                            className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:cursor-not-allowed flex items-center justify-center text-2xl transition-all"
                                        >
                                            −
                                        </button>
                                        <motion.div
                                            key={numTickets}
                                            initial={{ scale: 1.2 }}
                                            animate={{ scale: 1 }}
                                            className="flex-1 text-center"
                                        >
                                            <span className="text-6xl font-bold gradient-heading">{numTickets}</span>
                                        </motion.div>
                                        <button
                                            onClick={incrementTickets}
                                            disabled={numTickets >= event.available_seats}
                                            className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:cursor-not-allowed flex items-center justify-center text-2xl transition-all"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 text-center">
                                        {event.available_seats} seats available
                                    </p>
                                </div>

                                <div className="border-t border-zinc-800 pt-6">
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Price per ticket</span>
                                            <span className="font-semibold">₹{event.price}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Number of tickets</span>
                                            <span className="font-semibold">{numTickets}</span>
                                        </div>
                                        <div className="flex justify-between text-2xl font-bold pt-3 border-t border-zinc-800">
                                            <span>Total</span>
                                            <span className="gradient-heading">₹{totalPrice}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleBooking}
                                        disabled={booking || numTickets < 1 || numTickets > event.available_seats}
                                        className="btn-pill w-full justify-center text-lg"
                                    >
                                        {booking ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Confirm Booking
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </>
                                        )}
                                    </button>

                                    <p className="text-xs text-center text-gray-400 mt-4">
                                        🎫 You will receive QR code tickets after booking
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BookingFlow;
