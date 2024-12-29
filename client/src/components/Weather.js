import React, { useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const handleFetchWeather = async () => {
    // Ensure the location is entered
    if (!location) {
      setError('Please enter a location');
      return;
    }

    const apiKey = 'fc9612990001eda22e10d230e8b576f0'; // Direct API key (for now)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(url);
      setWeather(response.data); // Set weather data
      setError(''); // Clear previous errors if any
    } catch (err) {
      // Handle error
      console.error('Error fetching weather:', err);
      setError('Unable to fetch weather data. Please try again.');
      setWeather(null); // Clear weather data if there's an error
    }
  };

  return (
    <div className="weather-container">
      <h2>Weather Updates</h2>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location"
      />
      <button onClick={handleFetchWeather}>Get Weather</button>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-info">
          <h3>{weather.name}</h3>
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
          />
        </div>
      )}
    </div>
  );
};

export default Weather;
