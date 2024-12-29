import React, { useState } from 'react';
import axios from 'axios';

const FindLocations = () => {
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const fetchLocationImages = async () => {
    const UNSPLASH_ACCESS_KEY = 'TwBuYtRXYTyHdgF6xdyXKdxvpS6MSwz6otWBDEp2APM'; // Your Unsplash Access Key
    if (!location) {
      setError('Please enter a location.');
      return;
    }

    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos`, 
        {
          params: {
            query: location,
            client_id: UNSPLASH_ACCESS_KEY,  // Use the access key in the API request
            per_page: 10, // Number of images to fetch
          }
        }
      );
      setImages(response.data.results); // Set the fetched images in state
      setError(null); // Reset any previous error
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to fetch images. Please try again later.');
    }
  };

  return (
    <div className="find-locations-container">
      <h2>Find Locations</h2>
      <div className="search-location">
        <input 
          type="text" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          placeholder="Enter a location"
        />
        <button onClick={fetchLocationImages}>Search</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="location-images">
        {images.length > 0 ? (
          images.map((image) => (
            <div key={image.id} className="image-container">
              <img src={image.urls.small} alt={image.alt_description} />
              <p>{image.alt_description}</p>
            </div>
          ))
        ) : (
          <div>No images found for this location.</div>
        )}
      </div>
    </div>
  );
};

export default FindLocations;
