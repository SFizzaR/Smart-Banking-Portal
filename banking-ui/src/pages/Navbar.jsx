import React from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css";
const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/">Landing Page</Link>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact</Link>
            </div>
        </nav>
    );
};

export default Navbar;
