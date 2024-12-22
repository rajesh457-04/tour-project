import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom'; // useLocation to get the current route
import { store } from './App';
import './style5.css'; // Import the consolidated CSS file

const Nav = () => {
  const [token] = useContext(store);
  const location = useLocation(); // Get the current route

  const isLoginOrRegisterPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div>
      {/* Navbar */}
      <div className="nav-bar">
        <div className="navlinks">
          {!token ? (
            <>
              <Link className="navlink" to="/register">Register</Link>
              <Link className="navlink" to="/login">Login</Link>
            </>
          ) : null}
        </div>
      </div>

      {/* Display images only if user is not logged in and not on login/register pages */}
      {!token && !isLoginOrRegisterPage && (
        <div className="image-container">
          <div className="image-wrapper left-image">
            <img src="/images/img-1.jpg" alt="Scenic view on the left" />
          </div>
          <div className="image-wrapper right-image">
            <img src="/images/img-2.jpg" alt="Scenic view on the right" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Nav;