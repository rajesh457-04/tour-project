// MyBookings.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [touristDetails, setTouristDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTouristDetails = async () => {
      const token = localStorage.getItem('token');  // Get token from localStorage

      if (!token) {
        alert('Please log in first');
        return;
      }

      try {
        // Make GET request with the token in the header
        const { data } = await axios.get('http://localhost:5000/api/Tourist/tourist-details', {
          headers: {
            'x-token': token,  // Send token in header
          },
        });

        // Set tourist details to state
        setTouristDetails(data);
      } catch (err) {
        console.error('Error fetching tourist details:', err);
        setError('Error fetching tourist details: ' + (err.response?.data?.message || err.message));
      }
    };

    fetchTouristDetails();  // Fetch tourist details on component mount
  }, []);

  // Render tourist details
  if (error) {
    return <div>{error}</div>;
  }

  if (!touristDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-bookings-container">
      <h2>My Bookings</h2>
      <div className="tourist-details">
        <h3>Tourist Details</h3>
        <p><strong>Username:</strong> {touristDetails.username}</p>
        <p><strong>Destination:</strong> {touristDetails.destination}</p>
        <p><strong>Travel Dates:</strong> {touristDetails.dateFrom} to {touristDetails.dateTo}</p>
        <p><strong>Preferred Transport:</strong> {touristDetails.preferredModeOfTransport}</p>
        <p><strong>Travel Companion:</strong> {touristDetails.travelCompanion}</p>
        <p><strong>Languages:</strong> {touristDetails.languagePreferences}</p>
        <p><strong>Preferred Guide Type:</strong> {touristDetails.preferredGuideType}</p>

        {/* Display guide details if available */}
        {touristDetails.assignedGuide ? (
          <div>
            <h4>Assigned Guide</h4>
            <p><strong>Guide Name:</strong> {touristDetails.assignedGuide.username}</p>
            <p><strong>Location:</strong> {touristDetails.assignedGuide.location}</p>
          </div>
        ) : (
          <p>No guide assigned for your destination.</p>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
