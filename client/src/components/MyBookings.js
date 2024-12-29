import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [tourists, setTourists] = useState([]);  // State to store tourists assigned to guides
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTouristDetails = async () => {
      const token = localStorage.getItem('token');  // Get token from localStorage

      if (!token) {
        alert('Please log in first');
        return;
      }

      try {
        // Make GET request to fetch tourists assigned to guides
        const { data } = await axios.get('http://localhost:5000/api/Tourist/tourists-with-guides', {
          headers: {
            'x-token': token,  // Send token in header
          },
        });

        // Set tourists assigned to guides to state
        setTourists(data);
      } catch (err) {
        console.error('Error fetching tourists with guides:', err);
        setError('Error fetching tourists with guides: ' + (err.response?.data?.message || err.message));
      }
    };

    fetchTouristDetails();  // Fetch tourists assigned to guides on component mount
  }, []);

  // Render error or loading message
  if (error) {
    return <div>{error}</div>;
  }

  if (!tourists.length) {
    return <div>No tourists assigned to guides.</div>;
  }

  return (
    <div className="my-bookings-container">
      <h2>Tourists Assigned to Guides</h2>

      {/* Display tourists assigned to guides */}
      {tourists.map((tourist) => (
        <div key={tourist._id} className="tourist-details">
          <h3>Tourist Details</h3>
          <p><strong>Username:</strong> {tourist.username}</p>
          <p><strong>Destination:</strong> {tourist.destination}</p>
          <p><strong>Travel Dates:</strong> {tourist.dateFrom} to {tourist.dateTo}</p>
          <p><strong>Preferred Transport:</strong> {tourist.preferredModeOfTransport}</p>
          <p><strong>Travel Companion:</strong> {tourist.travelCompanion}</p>
          <p><strong>Languages:</strong> {tourist.languagePreferences}</p>
          <p><strong>Preferred Guide Type:</strong> {tourist.preferredGuideType}</p>

          {/* Display guide details */}
          {tourist.assignedGuide ? (
            <div>
              <h4>Assigned Guide</h4>
              <p><strong>Guide Name:</strong> {tourist.assignedGuide.username}</p>
              <p><strong>Location:</strong> {tourist.assignedGuide.location}</p>
            </div>
          ) : (
            <p>No guide assigned for this tourist.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
