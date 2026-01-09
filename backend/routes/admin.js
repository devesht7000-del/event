import express from 'express';
import { db } from '../config/db.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', authenticate, isAdmin, (req, res) => {
    try {
        const totalEvents = db.prepare('SELECT COUNT(*) as count FROM events').get().count;
        const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
        const totalRevenue = db.prepare('SELECT SUM(total_price) as total FROM bookings').get().total || 0;
        const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

        res.json({
            stats: {
                totalEvents,
                totalBookings,
                totalRevenue,
                totalUsers
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all bookings
router.get('/bookings', authenticate, isAdmin, (req, res) => {
    try {
        const bookings = db.prepare(`
      SELECT b.*, u.name, u.email, e.title
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN events e ON b.event_id = e.id
      ORDER BY b.booking_date DESC
    `).all();

        res.json({ bookings });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update booking status
router.put('/bookings/:id/status', authenticate, isAdmin, (req, res) => {
    try {
        const { status } = req.body;

        if (!['confirmed', 'pending', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const result = db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({ message: 'Booking status updated successfully' });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
