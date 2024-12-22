import React from 'react';
// Make sure to create this CSS file

const Footer = () => {
  return (
    <footer className="footer py-4" style={{ background: 'none' }}>
      <div className="footer-image-container">
        <img src="/images/bottom.png" alt="Footer Image" className="footer-image" />
        <div className="footer-text">
          <h5 className="mn">Explore the World with Travel Tour Guide</h5>
          <p>Connecting you with the best guides and experiences.</p>
          <ul className="list-inline social-icons">
            <li className="list-inline-item">
              <a href="#" className="text-light">
                <span className="icon">🌐</span> {/* Custom icon */}
              </a>
            </li>
            <li className="list-inline-item">
              <a href="#" className="text-light">
                <span className="icon">📧</span> {/* Custom icon */}
              </a>
            </li>
            <li className="list-inline-item">
              <a href="#" className="text-light">
                <span className="icon">📱</span> {/* Custom icon */}
              </a>
            </li>
          </ul>
          <p>&copy; 2024 Travel Tour Guide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;