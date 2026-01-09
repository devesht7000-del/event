import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import TicketQR from '../components/TicketQR';

const UserDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            const response = await api.get(`/bookings/user/${user.id}`);
            setBookings(response.data.bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const viewTickets = async (bookingId) => {
        try {
            const response = await api.get(`/bookings/${bookingId}/tickets`);
            setTickets(response.data.tickets);
            setSelectedBooking(bookingId);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

                    {bookings.length === 0 ? (
                        <div className="glass p-12 rounded-xl text-center">
                            <p className="text-xl text-gray-400 mb-4">No bookings yet</p>
                            <a href="/" className="btn-primary inline-block">
                                Browse Events
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {bookings.map((booking) => (
                                <motion.div
                                    key={booking.id}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="glass p-6 rounded-xl"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold mb-2">{booking.title}</h3>
                                            <div className="space-y-2 text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <span>📅</span>
                                                    <span>{new Date(booking.date).toLocaleDateString('en-IN', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>⏰</span>
                                                    <span>{booking.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>📍</span>
                                                    <span>{booking.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>🎟️</span>
                                                    <span>{booking.num_tickets} ticket(s)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>📅</span>
                                                    <span className="text-sm text-gray-400">
                                                        Booked on: {new Date(booking.booking_date).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-2xl font-semibold text-purple-400 mt-2">
                                                    Total: ₹{booking.total_price}
                                                </p>
                                            </div>
                                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-300' :
                                                booking.status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                                                    'bg-yellow-500/20 text-yellow-300'
                                                }`}>
                                                {booking.status.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="mt-4 md:mt-0">
                                            <button
                                                onClick={() => viewTickets(booking.id)}
                                                className="btn-primary"
                                            >
                                                View Tickets
                                            </button>
                                        </div>
                                    </div>

                                    {selectedBooking === booking.id && tickets.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-6 pt-6 border-t border-white/10"
                                        >
                                            <h4 className="text-xl font-bold mb-4">Your Tickets</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {tickets.map((ticket) => (
                                                    <TicketQR key={ticket.id} ticket={ticket} />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default UserDashboard;
