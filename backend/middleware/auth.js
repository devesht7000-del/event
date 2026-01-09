import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

export const authenticate = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        // Get user from database
        const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};
