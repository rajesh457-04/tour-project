import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Assuming you have a method to get the JWT token for the logged-in user
        const token = localStorage.getItem('token');
        
        axios.get('http://localhost:5000/api/my-bookings', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then((response) => {
            setBookings(response.data);
            setLoading(false);
        })
        .catch((err) => {
            setError('Error fetching bookings');
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <p>Loading your bookings...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
                <p>You have no bookings yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Guide Name</th>
                            <th>Destination</th>
                            <th>Dates</th>
                            <th>Status</th>
                            <th>Total Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.guide.username}</td>
                                <td>{booking.location}</td>
                                <td>{new Date(booking.dateFrom).toLocaleDateString()} - {new Date(booking.dateTo).toLocaleDateString()}</td>
                                <td>{booking.status}</td>
                                <td>${booking.totalCost}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyBookings;
