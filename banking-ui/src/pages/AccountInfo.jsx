import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AccountInfo.css";

const AccountInfo = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [accountInfo, setAccountInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAccountInfo = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("User not logged in");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("https://localhost:7065/api/User/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAccountInfo(response.data);
            } catch (err) {
                setError("Failed to fetch account info");
            } finally {
                setLoading(false);
            }
        };

        fetchAccountInfo();
    }, []);

    return (
        <div className="account-info-container">
            <div
                className="account-info-header"
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                tabIndex={0}
                onKeyPress={() => setIsOpen(!isOpen)}
            >
                <h3>Account Info</h3>
                <span className={`arrow ${isOpen ? "open" : ""}`}>▶</span>
            </div>

            {isOpen && (
                <div className="account-details">
                    {loading ? (
                        <p className="loading">Loading...</p>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : (
                        <>
                            <p><strong>Account Holder:</strong> {accountInfo?.username}</p>
                            <p><strong>Account Number:</strong> {accountInfo?.accountNumber}</p>
                            <p><strong>Phone:</strong> {accountInfo?.phoneNumber}</p>
                            <p><strong>CNIC:</strong> {accountInfo?.cnic}</p>
                            <p><strong>DOB:</strong> {new Date(accountInfo?.dob).toLocaleDateString()}</p>
                            <p><strong>Current Balance:</strong> ${accountInfo?.balance}</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AccountInfo; //is ke andar alag card banao for balance show bara bara proper dashboard feel ke lie 