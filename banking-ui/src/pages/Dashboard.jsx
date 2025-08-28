import React, { useState, useEffect } from "react";
import Sidebar from "./ProfileSideBar";
import AccountInfo from "./AccountInfo";
import FeatureCards from "./FeatureCards";
import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Sun, Moon, LogOut } from "lucide-react"; // modern icons
import { BarChart2 } from "lucide-react";


const Dashboard = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [username, setUsername] = useState("");
    const [loadingUser, setLoadingUser] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsername = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setUsername("Guest");
                setLoadingUser(false);
                return;
            }
            try {
                const res = await axios.get("https://localhost:7065/api/User/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsername(res.data.username || "User");
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setUsername("User");
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUsername();
    }, []);

    const toggleDarkMode = () => setDarkMode(prev => !prev);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");  // Redirect to landing page after logout
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    if (loadingUser) return <p>Loading...</p>;

    return (
        <nav className={`dashboard-container  ${darkMode ? "dark-mode" : "light-mode"}`}>
            {/* Navbar */}
            <nav className="navbar sticky">
                <div className="logo-with-image">
                    <img src="assets/logo.png" alt="Bank Alfalah" className="bank-logo" />
                    <span className="bank-name">ALFALAH SMART PORTAL</span>
                </div>
                <div class="nav-buttons">
                    <button onClick={() => navigate("/charts")} className="nav-btn">
                        Analytics
                    </button>
                    <button onClick={toggleDarkMode} className="nav-btn">
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={handleLogout} className="nav-btn">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
                </nav>
                
            
            {/* Dashboard Content */}
            <div className="dashboard-main">
                <div className="dashboard-content">
                    <div className="welcome-card">
                        <h1>{getGreeting()}, {username} 👋</h1>
                        <p>Here’s an overview of your account and features.</p>
                    </div>
                    <div className="content-grid">

                        <AccountInfo />
                     
                        <FeatureCards />
                    </div>
                    
                </div>

            </div>
              </nav>
    );
};

export default Dashboard;
