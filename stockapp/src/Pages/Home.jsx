import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Home.css";

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            StockTracker
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a href="/login" class="btn btn-primary">Login</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero d-flex align-items-center justify-content-center text-center">
        <div className="hero-content">
          <h1 className="display-4 fw-bold text-white">Welcome to StockTracker</h1>
          <p className="lead text-white mt-3">
            Manage your stock portfolio effortlessly. Track your investments,
            analyze trends, and predict stock prices with ease!
          </p>
          <ul className="text-white mt-4">
            <li>💼 Build and track your personalized portfolio.</li>
            <li>📈 Get real-time stock price updates.</li>
            <li>⭐ Add your favorite stocks to the watchlist.</li>
            <li>🔮 Predict stock trends with our advanced algorithms.</li>
          </ul>
          <button className="btn btn-success btn-lg mt-4">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
