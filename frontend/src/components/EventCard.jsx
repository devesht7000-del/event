import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EventCard = ({ event }) => {
    const imageUrl = event.image
        ? `http://localhost:5000/uploads/${event.image}`
        : null;

    // Generate gradient based on category
    const getGradient = (category) => {
        const gradients = {
            'Music': 'from-purple-600 to-purple-800',
            'Sports': 'from-blue-600 to-blue-800',
            'Technology': 'from-cyan-600 to-cyan-800',
            'Arts': 'from-pink-600 to-pink-800',
            'Food': 'from-orange-600 to-orange-800',
            'Business': 'from-green-600 to-green-800',
        };
        return gradients[category] || 'from-purple-600 to-purple-800';
    };

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="speaker-card"
        >
            <div
                className={`speaker-card-top bg-gradient-to-br ${getGradient(event.category)}`}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-6xl mb-2">🎫</div>
                            <p className="text-sm font-semibold">{event.category || 'Event'}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="speaker-card-bottom">
                <h3 className="text-xl font-bold mb-2 line-clamp-1">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.location}</p>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-purple-400 font-semibold text-lg">${event.price}</span>
                    <span className="text-sm text-gray-500">{event.available_seats} seats</span>
                </div>

                <Link to={`/events/${event.id}`} className="block">
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full transition-all font-semibold">
                        View Details →
                    </button>
                </Link>
            </div>
        </motion.div>
    );
};

export default EventCard;
