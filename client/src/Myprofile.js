import React, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { store } from './App'; // Import context
import ImageCarousel from './components/ImageCarousel'; // Assume you have this
import Footer from './components/Footer'; // Import the Footer component
import './MyProfile.css'; // Import CSS

const MyProfile = () => {
    const [token, setToken] = useContext(store); // Get token from context
    const navigate = useNavigate();

    useEffect(() => {
        // Check for token in localStorage
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken); // Set token in context
        }

        // Redirect to login only if token is not present
        if (!savedToken) {
            navigate('/login');
        }
    }, [setToken, navigate]);

    const handleLogout = () => {
        // Clear the token and redirect to login
        localStorage.removeItem('token');
        setToken(null);
        navigate('/login');
    };

    return (
        <div className="my-profile">
            {/* Gold line shadow below the navbar */}
            <nav className="profile-nav">
                <ul>
                    <li><Link to="/mybookings">My Bookings</Link></li>
                    <li><Link to="/findlocations">Find Locations</Link></li>
                    <li><Link to="/weather">Weather Updates</Link></li>
                    <li><Link to="/profile">Profile Details</Link></li>
                    <li>
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
            <div className="gold-shadow"></div>
            {/* Profile Content */}
            <section className="profile-content">
                <ImageCarousel />
            </section>

            {/* Card Section for Forms */}
            <div className="card-container">
                <div className="card">
                    <h2>Explore Amazing Destinations</h2>
                    <p>Join us as we take you to the best tourist spots around the world.</p>
                    <Link to="/tourist-form">
                        <button>Register as Tourist</button>
                    </Link>
                </div>
                <div className="card">
                    <h2>Become a Guide</h2>
                    <p>Share your knowledge and experience with travelers. Join our team!</p>
                    <Link to="/guide-form">
                        <button>Register as Guide</button>
                    </Link>
                </div>
            </div>

            {/* Footer Section */}
            <Footer />
        </div>
    );
};

export default MyProfile;
