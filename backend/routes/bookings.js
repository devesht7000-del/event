import express from 'express';
import QRCode from 'qrcode';
import { db } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create booking
router.post('/', authenticate, async (req, res) => {
    try {
        const { event_id, num_tickets } = req.body;
        const user_id = req.user.id;

        // Bug Fix #1: Add input validation for maximum tickets
        if (!event_id || !num_tickets || num_tickets < 1) {
            return res.status(400).json({ message: 'Invalid booking details' });
        }

        // Bug Fix #6: Limit maximum tickets per booking
        if (num_tickets > 10) {
            return res.status(400).json({ message: 'Maximum 10 tickets allowed per booking' });
        }

        // Bug Fix #1: Wrap database operations in a transaction (must be synchronous)
        let booking_id, total_price;
        
        const createBookingTransaction = db.transaction(() => {
            // Get event details
            const event = db.prepare('SELECT * FROM events WHERE id = ?').get(event_id);

            if (!event) {
                throw new Error('Event not found');
            }

            // Check seat availability (critical for race condition prevention)
            if (event.available_seats < num_tickets) {
                throw new Error('Not enough seats available');
            }

            // Calculate total price
            total_price = event.price * num_tickets;

            // Create booking
            const bookingResult = db.prepare(
                'INSERT INTO bookings (user_id, event_id, num_tickets, total_price) VALUES (?, ?, ?, ?)'
            ).run(user_id, event_id, num_tickets, total_price);

            booking_id = bookingResult.lastInsertRowid;

            // Update available seats (within transaction)
            const updateResult = db.prepare('UPDATE events SET available_seats = available_seats - ? WHERE id = ?')
                .run(num_tickets, event_id);

            if (updateResult.changes === 0) {
                throw new Error('Failed to update seat availability');
            }
        });

        // Execute transaction
        createBookingTransaction();

        // Generate QR codes AFTER transaction (async operation)
        const tickets = [];
        const event = db.prepare('SELECT * FROM events WHERE id = ?').get(event_id);
        
        for (let i = 0; i < num_tickets; i++) {
            const ticket_number = `TKT-${booking_id}-${Date.now()}-${i + 1}`;
            const qr_data = JSON.stringify({
                ticket_number,
                booking_id,
                event_id,
                user_id,
                event_title: event.title,
                event_date: event.date,
                event_time: event.time,
                event_location: event.location
            });

            const qr_code = await QRCode.toDataURL(qr_data, { errorCorrectionLevel: 'H' });

            db.prepare('INSERT INTO tickets (booking_id, ticket_number, qr_code) VALUES (?, ?, ?)')
                .run(booking_id, ticket_number, qr_code);

            tickets.push({ ticket_number, qr_code });
        }

        const result = { booking_id, tickets, total_price };

        res.status(201).json({
            message: 'Booking created successfully',
            booking: {
                id: result.booking_id,
                event_id,
                num_tickets,
                total_price: result.total_price,
                tickets: result.tickets
            }
        });
    } catch (error) {
        console.error('Create booking error:', error);

        // Better error messaging
        if (error.message === 'Event not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Not enough seats available') {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: error.message || 'Server error' });
    }
});

// Get user bookings
router.get('/user/:userId', authenticate, (req, res) => {
    try {
        const bookings = db.prepare(`
      SELECT b.*, e.title, e.date, e.time, e.location, e.image 
      FROM bookings b 
      JOIN events e ON b.event_id = e.id 
      WHERE b.user_id = ? 
      ORDER BY b.booking_date DESC
    `).all(req.params.userId);

        res.json({ bookings });
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get booking tickets
router.get('/:id/tickets', authenticate, (req, res) => {
    try {
        const tickets = db.prepare('SELECT * FROM tickets WHERE booking_id = ?').all(req.params.id);
        res.json({ tickets });
    } catch (error) {
        console.error('Get tickets error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
