import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/myprofile">My Profile</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/myprofile">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/bookings">My Bookings</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/weather">Weather</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/location">Find Location</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
