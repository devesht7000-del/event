import express from 'express';
import multer from 'multer';
import path from 'path';
import { db } from '../config/db.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Get all events (with search/filter)
router.get('/', (req, res) => {
    try {
        const { search, location, date, category } = req.query;

        let query = 'SELECT * FROM events WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (title LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (location) {
            query += ' AND location LIKE ?';
            params.push(`%${location}%`);
        }

        if (date) {
            query += ' AND date = ?';
            params.push(date);
        }

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        query += ' ORDER BY date ASC';

        const events = db.prepare(query).all(...params);
        res.json({ events });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single event
router.get('/:id', (req, res) => {
    try {
        const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ event });
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create event (admin only)
router.post('/', authenticate, isAdmin, upload.single('image'), (req, res) => {
    try {
        const { title, description, location, date, time, category, price, total_seats, helpline } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!title || !location || !date || !time || !price || !total_seats) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const result = db.prepare(`
      INSERT INTO events (title, description, location, date, time, category, price, total_seats, available_seats, image, helpline, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
            title,
            description || '',
            location,
            date,
            time,
            category || 'General',
            parseFloat(price),
            parseInt(total_seats),
            parseInt(total_seats),
            image,
            helpline || '',
            req.user.id
        );

        const event = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json({
            message: 'Event created successfully',
            event
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Update event (admin only)
router.put('/:id', authenticate, isAdmin, (req, res) => {
    try {
        const { title, description, location, date, time, category, price, total_seats } = req.body;

        const result = db.prepare(`
      UPDATE events 
      SET title = ?, description = ?, location = ?, date = ?, time = ?, category = ?, price = ?, total_seats = ?
      WHERE id = ?
    `).run(
            title,
            description,
            location,
            date,
            time,
            category,
            parseFloat(price),
            parseInt(total_seats),
            req.params.id
        );

        if (result.changes === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);

        res.json({
            message: 'Event updated successfully',
            event
        });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete event (admin only)
// Delete event (admin only)
router.delete('/:id', authenticate, isAdmin, (req, res) => {
    try {
        const eventId = req.params.id;

        // Use a transaction to ensure integrity
        const deleteEventTransaction = db.transaction(() => {
            // 1. Get all bookings for this event
            const bookings = db.prepare('SELECT id FROM bookings WHERE event_id = ?').all(eventId);

            if (bookings.length > 0) {
                const bookingIds = bookings.map(b => b.id);

                // 2. Delete all tickets for these bookings
                const deleteTicketsStmt = db.prepare(`DELETE FROM tickets WHERE booking_id IN (${bookingIds.map(() => '?').join(',')})`);
                deleteTicketsStmt.run(...bookingIds);

                // 3. Delete the bookings
                const deleteBookingsStmt = db.prepare('DELETE FROM bookings WHERE event_id = ?');
                deleteBookingsStmt.run(eventId);
            }

            // 4. Delete the event
            const result = db.prepare('DELETE FROM events WHERE id = ?').run(eventId);

            if (result.changes === 0) {
                throw new Error('Event not found');
            }
        });

        // Execute the transaction
        deleteEventTransaction();

        res.json({ message: 'Event and associated bookings deleted successfully' });
    } catch (error) {
        console.error('Delete event error:', error);
        if (error.message === 'Event not found') {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

export default router;
