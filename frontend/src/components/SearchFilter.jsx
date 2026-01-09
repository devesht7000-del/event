import { useState } from 'react';

const SearchFilter = ({ onSearch }) => {
    const [filters, setFilters] = useState({
        search: '',
        location: '',
        date: '',
        category: ''
    });

    const handleChange = (e) => {
        const newFilters = { ...filters, [e.target.name]: e.target.value };
        setFilters(newFilters);
        onSearch(newFilters);
    };

    return (
        <div className="glass p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">Search & Filter Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                    type="text"
                    name="search"
                    placeholder="Search events..."
                    value={filters.search}
                    onChange={handleChange}
                    className="input-field"
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={filters.location}
                    onChange={handleChange}
                    className="input-field"
                />
                <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleChange}
                    className="input-field"
                />
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                    className="input-field"
                >
                    <option value="">All Categories</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Technology">Technology</option>
                    <option value="Arts">Arts</option>
                    <option value="Food">Food</option>
                    <option value="Business">Business</option>
                </select>
            </div>
        </div>
    );
};

export default SearchFilter;
