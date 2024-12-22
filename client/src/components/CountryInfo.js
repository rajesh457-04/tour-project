import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CountryInfo = () => {
  return (
    <section className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <h1>Country Info</h1>
          <ul className="list-unstyled">
            <li><strong>Currency:</strong> Indian Rupee (INR)</li>
            <li><strong>Population:</strong> 1.3 Billion</li>
            <li><strong>Time Zone:</strong> UTC+5:30</li>
            <li><strong>Capital:</strong> New Delhi</li>
            <li><strong>Area:</strong> 3.287 million km²</li>
            <li><strong>States:</strong> 28</li>
            <li><strong>Union Territories:</strong> 8</li>
            <li><strong>Country Code:</strong> +91</li>
          </ul>
        </div>
        <div className="col-md-6">
          <h1>About India</h1>
          <p>
            Tourism in India has shown phenomenal growth in the past decade. One of the reasons 
            is that the Ministry of Tourism, India, has realized the immense potential of tourism 
            during vacations. India travel tourism has grown rapidly, attracting tourists from 
            across the globe due to its rich culture, heritage, and natural beauty. India tourism 
            offers foggy hill stations, captivating beaches, historical monuments, golden deserts, 
            serene backwaters, pilgrimage sites, and rich wildlife. The vibrant festivals, lively 
            markets, and traditional Indian hospitality make the experience unforgettable.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CountryInfo;
