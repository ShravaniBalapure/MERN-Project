import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Designed and Developed by Fitsafar Team </p>
      </div>
    </footer>
  );
};

export default Footer;