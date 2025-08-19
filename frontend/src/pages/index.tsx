import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the Price Tracker App</h1>
            <p>Track your wishlist items and get notified when prices drop!</p>
            <Link to="/wishlist">Go to Wishlist</Link>
            <Link to="/price-tracking">Track Prices</Link>
            <Link to="/referrals">Referral Program</Link>
        </div>
    );
};

export default HomePage;