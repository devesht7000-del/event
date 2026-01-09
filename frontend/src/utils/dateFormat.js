// Bug Fix #8: Consistent date formatting utilities

/**
 * Format date for display with consistent formatting across the app
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'full', 'short', 'time', 'datetime'
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'full') => {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check for invalid date
    if (isNaN(dateObj.getTime())) return 'Invalid Date';

    const options = {
        full: {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        },
        short: {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        },
        time: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        },
        datetime: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
    };

    try {
        return dateObj.toLocaleString('en-IN', options[format] || options.full);
    } catch (error) {
        console.error('Date formatting error:', error);
        return dateObj.toLocaleDateString();
    }
};

/**
 * Check if an event date has passed
 * @param {string|Date} eventDate - Event date
 * @returns {boolean} True if event has passed
 */
export const isEventPast = (eventDate) => {
    if (!eventDate) return false;
    const dateObj = typeof eventDate === 'string' ? new Date(eventDate) : eventDate;
    return dateObj < new Date();
};

/**
 * Get relative time string (e.g., "2 days ago", "in 3 hours")
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = dateObj - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMs < 0) {
        // Past
        const absDays = Math.abs(diffDays);
        const absHours = Math.abs(diffHours);
        if (absDays > 0) return `${absDays} day${absDays > 1 ? 's' : ''} ago`;
        if (absHours > 0) return `${absHours} hour${absHours > 1 ? 's' : ''} ago`;
        return 'Just now';
    } else {
        // Future
        if (diffDays > 0) return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
        if (diffHours > 0) return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
        if (diffMins > 0) return `in ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
        return 'Very soon';
    }
};
