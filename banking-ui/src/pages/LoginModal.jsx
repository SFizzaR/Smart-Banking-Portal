import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Modal.css';
const LoginModal = ({ onClose }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showTick, setShowTick] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setMessage("");
        try {
            if (!username || !password) {
                setMessage("⚠️ Both username and password are required.");
                setShowTick(false);
                return; // ⛔ Stop API call
            }
            const response = await fetch("http://localhost:5202/api/User/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
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
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button style={styles.closeBtn} onClick={onClose}>&times;</button>

                <img
                    src="assets/login.gif"
                    alt="Login Animation"
                    style={{ width: "240px", marginBottom: "5px" }}
                />

                <div style={styles.formGroup}>
                    <label style={styles.label}>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        placeholder="Enter your username"
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        placeholder="Enter your password"
                    />
                </div>
                {message && (
                    <p
                        style={{
                            marginTop: "15px",
                            fontSize: "16px",
                            color: message.toLowerCase().includes("successful") ? "green" : "red"
                        }}
                    >
                        {message}
                    </p>
                )}
                <button onClick={handleLogin} style={styles.loginBtn}>Login</button>

                {showTick && (
                    <img
                        src="https://i.gifer.com/7efs.gif"
                        alt="Success"
                        style={styles.tickGif}
                    />
                )}
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "#fff",
        padding: "40px 30px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
        width: "400px",
        maxWidth: "90%",
        position: "relative",
        textAlign: "center",
        fontSize: "18px",
    },
    closeBtn: {
        position: "absolute",
        top: "10px",
        right: "15px",
        fontSize: "26px",
        border: "none",
        background: "none",
        cursor: "pointer",
    },
    formGroup: {
        textAlign: "left",
        marginBottom: "15px"
    },
    label: {
        display: "block",
        marginBottom: "5px",
        fontWeight: "bold",
        color: "#333"
    },
    input: {
        padding: "10px",
        width: "100%",
        fontSize: "16px",
        borderRadius: "6px",
        border: "1px solid #ccc"
    },
    loginBtn: {
        padding: "12px 25px",
        backgroundColor: "#6a0dad",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "18px",
        marginTop: "10px"
    },
    message: {
        marginTop: "12px",
        fontSize: "16px",
        color: "#333",
        fontWeight: "bold"
    },
    tickGif: {
        marginTop: "14px",
        width: "90px",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto"
    }
};

export default LoginModal;
