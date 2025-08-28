import React from 'react';
import './ProfileSidebar.css';

const ProfileSidebar = ({ username, onLogout, darkMode, toggleDarkMode }) => {
    return (
        <aside className={`profile-sidebar ${darkMode ? "dark-mode" : "light-mode"}`}>
            <h3>Welcome, {username} 👋</h3>
            <button className="toggle-btn" onClick={toggleDarkMode}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button className="logout-btn" onClick={onLogout}>
                Log Out
            </button>
        </aside>
    );
};

export default ProfileSidebar;
