import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyBookings.css'; // Create this CSS file for styling

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to view your bookings');
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:5000/api/Tourist/my-bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setBookings(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setError(error.response?.data?.message || 'Failed to fetch bookings');
            setLoading(false);
        }
    };

    const cancelBooking = async (bookingId, reason = "Cancelled by user") => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/Tourist/cancel-booking/${bookingId}`, 
                { reason },
                { headers: { 'Authorization': `Bearer ${token}` }}
            );
            
            // Update the local state instead of refetching
            setBookings(prevBookings => 
                prevBookings.map(booking => 
                    booking.id === bookingId 
                        ? { ...booking, status: 'cancelled' }
                        : booking
                )
            );
            
            alert('Booking cancelled successfully');
        } catch (error) {
            console.error("Error cancelling booking:", error);
            alert(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="loading">Loading bookings...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="bookings-container">
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
                <div className="no-bookings">
                    <p>No bookings found.</p>
                    <p>Make your first booking to get started!</p>
                </div>
            ) : (
                <div className="bookings-grid">
                    {bookings.map(booking => (
                        <div key={booking.id} className={`booking-card ${booking.status}`}>
                            <div className="booking-header">
                                <h3>Booking Details</h3>
                                <span className={`status-badge ${booking.status}`}>
                                    {booking.status}
                                </span>
                            </div>
                            
                            <div className="booking-details">
                                {booking.guide && (
                                    <div className="guide-info">
                                        <h4>Guide Information</h4>
                                        <p>Name: {booking.guide.username}</p>
                                        <p>Contact: {booking.guide.phone}</p>
                                        <p>Experience: {booking.guide.guideExperience}</p>
                                        <p>Languages: {booking.guide.languagesSpoken}</p>
                                    </div>
                                )}

                                <div className="trip-info">
                                    <h4>Trip Details</h4>
                                    <p>Location: {booking.location}</p>
                                    <p>From: {formatDate(booking.dateFrom)}</p>
                                    <p>To: {formatDate(booking.dateTo)}</p>
                                    <p>Total Cost: ₹{booking.totalCost}</p>
                                </div>
                            </div>

                            {booking.status === 'pending' && (
                                <div className="booking-actions">
                                    <button 
                                        className="cancel-button"
                                        onClick={() => cancelBooking(booking.id)}
                                    >
                                        Cancel Booking
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;