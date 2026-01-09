-- Create Database
CREATE DATABASE IF NOT EXISTS event_booking;
USE event_booking;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    image VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    num_tickets INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('confirmed', 'cancelled', 'pending') DEFAULT 'confirmed',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    ticket_number VARCHAR(100) UNIQUE NOT NULL,
    qr_code TEXT,
    status ENUM('valid', 'used', 'cancelled') DEFAULT 'valid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@eventbooking.com', '$2a$10$8ZqE5Y5Y5Y5Y5Y5Y5Y5Y5uKX8ZqE5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5', 'admin');
