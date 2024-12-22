import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpcomingEvents = () => {
  return (
    <section className="UpcomingEvents p-4 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h3>Upcoming Events</h3>
            <div className="marquee p-3 bg-white">
              <p>
                The Great Indian Travel Bazaar (GITB) <br />
                India Tourism Conclave New Delhi <br />
                International Conference on Rural Tourism <br />
                International Tourism Exhibition (ITE) <br />
                Tourism Expo India (TEI Kolkata)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
