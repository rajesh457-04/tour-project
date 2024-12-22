import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AboutIndia = () => {
  return (
    <section className="AboutIndia bg-light p-4">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h2 className="mb-4">About India</h2>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <p>
              Tourism in India has shown phenomenal growth in the past decade. India travel tourism has grown rapidly with a great influx of tourists
              from across the globe who have been irresistibly attracted to its rich culture, heritage, and incredible natural beauty.
            </p>
            <p>
              India tourism with its foggy hill stations, captivating beaches, historical monuments, golden deserts, serene backwaters, and much more captures the heart of every tourist.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutIndia;
