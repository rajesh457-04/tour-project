import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]); // Initialize bookings as an empty array
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage

            if (!token) {
                alert('Please log in first.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/Tourist/my-bookings', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach token in Authorization header
                    },
                });

                // Check if the response has the bookings property
                if (response.data && response.data.bookings) {
                    setBookings(response.data.bookings); // Set bookings state
                } else {
                    setBookings([]); // Set to empty array if no bookings found
                }
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('Failed to fetch bookings: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchBookings(); // Fetch bookings on component mount
    }, []);

    if (loading) {
        return <div>Loading your bookings...</div>; // Loading message
    }

    if (error) {
        return <div className="error-message">{error}</div>; // Display error message
    }

    if (!bookings.length) {
        return <div className="no-data-message">No bookings found.</div>; // Handle empty bookings
    }

    return (
        <div className="my-bookings-container">
            <h2>My Bookings</h2>
            {bookings.map((booking) => (
                <div key={booking.id} className="booking-details">
                    <h3>Booking Details</h3>
                    <p><strong>Username:</strong> {booking.username}</p>
                    <p><strong>Email:</strong> {booking.email}</p>
                    <p><strong>Destination:</strong> {booking.destination}</p>
                    <p><strong>Travel Companion:</strong> {booking.travelCompanion}</p>
                    <p><strong>Travel Dates:</strong> {new Date(booking.dateFrom).toLocaleDateString()} to {new Date(booking.dateTo).toLocaleDateString()}</p>
                    <p><strong>Preferred Transport:</strong> {booking.preferredModeOfTransport.join(', ')}</p>
                    <p><strong>Language Preferences:</strong> {booking.languagePreferences}</p>
                    <p><strong>Preferred Guide Type:</strong> {booking.preferredGuideType}</p>
                    {booking.assignedGuide ? (
                        <div className="assigned-guide">
                            <h4>Assigned Guide</h4>
                            <p><strong>Guide Name:</strong> {booking.assignedGuide.username}</p>
                            <p><strong>Location:</strong> {booking.assignedGuide.location}</p>
                        </div>
                    ) : (
                        <p>No guide assigned.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MyBookings;