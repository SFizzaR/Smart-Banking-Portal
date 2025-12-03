import React, { useState } from 'react';
import axios from 'axios';
import './SignUpModal.css';
import { useNavigate } from 'react-router-dom';

const SignUpModal = ({ onClose }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        cnic: '',
        fullName: '',
        username: '',
        password: '',
        dob: '',
        phoneNumber: ''
    });

    const [message, setMessage] = useState('');
    const [showTick, setShowTick] = useState(false);
    const [errors, setErrors] = useState({ dob: "" });

    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    const maxDate = today.toISOString().split("T")[0];


    const handleChange = (e) => {
        const { name, value } = e.target;

        // DOB validation
        if (name === "dob") {
            const dob = new Date(value);
            const cutoff = new Date();
            cutoff.setFullYear(cutoff.getFullYear() - 18);

            if (dob > cutoff) {
                setErrors(prev => ({ ...prev, dob: "You must be at least 18 years old." }));
            } else {
                setErrors(prev => ({ ...prev, dob: "" }));
            }
        }

        // Update form state
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setShowTick(false);

        try {
            const response = await axios.post('http://localhost:5202/api/User/register', formData);
            setMessage(response.data);

            if (response.data === 'User registered successfully.') {
                setShowTick(true);
                setTimeout(async () => {
                    onClose();
                    setMessage("");
                    try {
                        const response = await fetch("http://localhost:5202/api/User/login", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ username: formData.username, password: formData.password }),
                        });

                        const data = await response.json();

                        if (response.ok && data.token) {
                            localStorage.setItem("token", data.token);
                            setMessage("Login successful!");
                            setShowTick(true);
                            setTimeout(() => {
                                navigate("/dashboard");
                            }, 1500);
                        } else {
                            setMessage("❌ Login failed. Check your credentials.");
                            setShowTick(false);
                        }
                    } catch (error) {
                        console.error("Error:", error);
                        setMessage("⚠️ Invalid Username or Password. Try again.");
                        setShowTick(false);
                    }
                }, 1500);
            }
        } catch (error) {
            setMessage(error.response?.data || '❌ Registration failed.');
            setShowTick(false);
        }
    };

    return (
        <div className="signup-modal-overlay">
            <div className="signup-modal-content">
                <button className="signup-close-btn" onClick={onClose}>&times;</button>

                <img
                    src="assets/sign-up.gif"
                    alt="Sign Up"
                    className="signup-gif"
                />

                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-group">
                        <label>CNIC:</label>
                        <input type="text" name="cnic" value={formData.cnic} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Full Name:</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Username:</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" name="password" placeholder="At least 8 characters" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Date of Birth:</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required max={maxDate} />
                    </div>
                    <div className="form-group">
                        <label>Phone Number:</label>
                        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="signup-submit-btn">Register</button>
                </form>

                {message && <p className="signup-message">{message}</p>}

                {showTick && (
                    <img
                        src="https://i.gifer.com/7efs.gif"
                        alt="Success Tick"
                        className="signup-tick-gif"
                    />
                )}
            </div>
        </div>
    );
};

export default SignUpModal;
