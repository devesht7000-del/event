import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [activeTab, setActiveTab] = useState('events'); // 'events' or 'bookings'
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        category: '',
        price: '',
        total_seats: '',
        helpline: '',
        image: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        fetchEvents();
        fetchBookings();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/admin/dashboard');
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data.events);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchBookings = async () => {
        try {
            const response = await api.get('/admin/bookings');
            setBookings(response.data.bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('location', formData.location);
            submitData.append('date', formData.date);
            submitData.append('time', formData.time);
            submitData.append('category', formData.category);
            submitData.append('price', formData.price);
            submitData.append('total_seats', formData.total_seats);
            submitData.append('helpline', formData.helpline);
            if (formData.image) {
                submitData.append('image', formData.image);
            }

            await api.post('/events', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setShowCreateForm(false);
            setFormData({
                title: '',
                description: '',
                location: '',
                date: '',
                time: '',
                category: '',
                price: '',
                total_seats: '',
                helpline: '',
                image: null
            });
            fetchEvents();
            fetchDashboardData();
            alert('Event created successfully!');
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchEvents();
                fetchDashboardData();
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event');
            }
        }
    };

    const handleUpdateBookingStatus = async (bookingId, newStatus) => {
        try {
            await api.put(`/admin/bookings/${bookingId}/status`, { status: newStatus });
            fetchBookings();
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Failed to update booking status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-32 bg-black">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-5xl font-bold gradient-heading">Admin Dashboard</h1>
                        {activeTab === 'events' && (
                            <button
                                onClick={() => setShowCreateForm(!showCreateForm)}
                                className="btn-pill"
                            >
                                {showCreateForm ? 'Cancel' : '+ Create Event'}
                            </button>
                        )}
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            <div className="bento-card text-center">
                                <p className="text-gray-400 mb-2">Total Events</p>
                                <p className="text-5xl font-bold gradient-heading">{stats.totalEvents}</p>
                            </div>
                            <div className="bento-card text-center">
                                <p className="text-gray-400 mb-2">Total Bookings</p>
                                <p className="text-5xl font-bold gradient-heading">{stats.totalBookings}</p>
                            </div>
                            <div className="bento-card text-center">
                                <p className="text-gray-400 mb-2">Total Revenue</p>
                                <p className="text-5xl font-bold gradient-heading">₹{stats.totalRevenue}</p>
                            </div>
                            <div className="bento-card text-center">
                                <p className="text-gray-400 mb-2">Total Users</p>
                                <p className="text-5xl font-bold gradient-heading">{stats.totalUsers}</p>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setActiveTab('events')}
                            className={`px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'events'
                                ? 'bg-purple-600 text-white'
                                : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
                                }`}
                        >
                            Events Management
                        </button>
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'bookings'
                                ? 'bg-purple-600 text-white'
                                : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
                                }`}
                        >
                            Bookings Management
                        </button>
                    </div>

                    {/* Create Event Form */}
                    {showCreateForm && activeTab === 'events' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bento-card-dark mb-8"
                        >
                            <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
                            <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Event Title"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                                <input
                                    type="time"
                                    required
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Music">Music</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Arts">Arts</option>
                                    <option value="Food">Food</option>
                                    <option value="Business">Business</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="Price"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                                <input
                                    type="number"
                                    placeholder="Total Seats"
                                    required
                                    min="1"
                                    value={formData.total_seats}
                                    onChange={(e) => setFormData({ ...formData, total_seats: e.target.value })}
                                    className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                                />

                                {/* NEW: Helpline Number */}
                                <input
                                    type="tel"
                                    placeholder="Helpline Number (e.g., +1-800-123-4567)"
                                    required
                                    value={formData.helpline}
                                    onChange={(e) => setFormData({ ...formData, helpline: e.target.value })}
                                    className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                                />

                                {/* NEW: Image Upload */}
                                <div className="relative">
                                    <label className="block">
                                        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 cursor-pointer hover:border-purple-500 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-gray-400">
                                                    {formData.image ? formData.image.name : 'Upload Event Image'}
                                                </span>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <textarea
                                    placeholder="Event Description"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors md:col-span-2"
                                    rows="3"
                                />

                                <button type="submit" className="btn-pill md:col-span-2 justify-center">
                                    Create Event
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* Events List */}
                    {activeTab === 'events' && (
                        <div className="bento-card-dark">
                            <h2 className="text-2xl font-bold mb-6">Manage Events</h2>
                            <div className="space-y-4">
                                {events.length === 0 ? (
                                    <p className="text-center text-gray-400 py-8">No events yet. Create your first event!</p>
                                ) : (
                                    events.map((event) => (
                                        <div
                                            key={event.id}
                                            className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex justify-between items-center hover:border-purple-500 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                                                    <span>📍 {event.location}</span>
                                                    <span>💰 ₹{event.price}</span>
                                                    <span>🎟️ {event.available_seats}/{event.total_seats} seats</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteEvent(event.id)}
                                                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-3 rounded-full transition-colors font-semibold"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Bookings List */}
                    {activeTab === 'bookings' && (
                        <div className="bento-card-dark">
                            <h2 className="text-2xl font-bold mb-6">Manage Bookings</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-zinc-800">
                                            <th className="text-left py-4 px-4">Booking ID</th>
                                            <th className="text-left py-4 px-4">User</th>
                                            <th className="text-left py-4 px-4">Event</th>
                                            <th className="text-left py-4 px-4">Tickets</th>
                                            <th className="text-left py-4 px-4">Total</th>
                                            <th className="text-left py-4 px-4">Status</th>
                                            <th className="text-left py-4 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-8 text-gray-400">
                                                    No bookings yet
                                                </td>
                                            </tr>
                                        ) : (
                                            bookings.map((booking) => (
                                                <tr key={booking.id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                                                    <td className="py-4 px-4">#{booking.id}</td>
                                                    <td className="py-4 px-4">
                                                        <div>
                                                            <p className="font-semibold">{booking.name}</p>
                                                            <p className="text-sm text-gray-400">{booking.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">{booking.title}</td>
                                                    <td className="py-4 px-4">{booking.num_tickets}</td>
                                                    <td className="py-4 px-4">₹{booking.total_price}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-300' :
                                                            booking.status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                                                                'bg-yellow-500/20 text-yellow-300'
                                                            }`}>
                                                            {booking.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <select
                                                            value={booking.status}
                                                            onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                                                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                                                        >
                                                            <option value="confirmed">Confirmed</option>
                                                            <option value="pending">Pending</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
