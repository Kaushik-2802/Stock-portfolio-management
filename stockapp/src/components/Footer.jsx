import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white text-center py-3">
      <p>&copy; 2025 StockTracker. All Rights Reserved.</p>
      <p>
        <a href="/about" className="text-white">
          About Us
        </a>{" "}
        |{" "}
        <a href="/contact" className="text-white">
          Contact
        </a>
      </p>
    </footer>
  );
};

export default Footer;
