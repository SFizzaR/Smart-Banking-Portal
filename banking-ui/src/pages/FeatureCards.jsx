import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TransferModal from "./TransferModal";
import ChangePasswordModal from "./ChangePasswordModal";
import TransactionHistoryModal from "./TransactionHistoryModal";
import { CreditCard, History, Lock, BarChart2 } from "lucide-react";
import "./FeatureCards.css";

const FeatureCards = () => {
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showTransactionHistoryModal, setShowTransactionHistoryModal] = useState(false);
    const navigate = useNavigate();

    const toggleTransferModal = () => setShowTransferModal(!showTransferModal);
    const toggleChangePasswordModal = () => setShowChangePasswordModal(!showChangePasswordModal);
    const toggleTransactionHistoryModal = () => setShowTransactionHistoryModal(!showTransactionHistoryModal);
    const goToCharts = () => navigate("/charts");

    return (
        <div>
            <div className="features-grid">

                {/* Transfer Money Card */}
                <div className="feature-card" onClick={toggleTransferModal}>
                    <div className="feature-icon">
                        <CreditCard size={40} />
                    </div>
                    <h3>Transfer Money</h3>
                    <p>Send funds instantly and securely to other accounts. Track your transfers and never miss a payment again.</p>
                    <ul className="feature-points">
                        <li> Instant and secure transfers</li>
                        <li> Transfer to multiple accounts</li>
                        <li> View transfer status in real-time</li>
                    </ul>
                </div>

                {/* Transaction History Card */}
                <div className="feature-card" onClick={toggleTransactionHistoryModal}>
                    <div className="feature-icon">
                        <History size={40} />
                    </div>
                    <h3>Transaction History</h3>
                    <p>Access your complete transaction history with ease. Filter, search, and review all your past payments and receipts.</p>
                    <ul className="feature-points">
                        <li> View all sent and received transactions</li>
                        <li> Filter by date, category, or amount</li>
                        <li> Export history for personal records</li>
                    </ul>
                </div>

                {/* Change Password Card */}
                <div className="feature-card" onClick={toggleChangePasswordModal}>
                    <div className="feature-icon">
                        <Lock size={40} />
                    </div>
                    <h3>Change Password</h3>
                    <p>Keep your account safe by updating your password regularly. Choose a strong password to protect your funds and data.</p>
                    <ul className="feature-points">
                        <li> Update login credentials easily</li>
                        <li> Enhance account security</li>
                        <li> Receive confirmation notifications</li>
                    </ul>
                </div>

                {/* Transaction Analytics Card */}
                <div className="feature-card" onClick={goToCharts}>
                    <div className="feature-icon">
                        <BarChart2 size={40} />
                    </div>
                    <h3>Transaction Analytics</h3>
                    <p>Get detailed insights, charts, and trends for all your transactions. Make smarter financial decisions with clear analytics.</p>
                    <ul className="feature-points">
                        <li> Visual charts for sent/received transactions</li>
                        <li> Track spending patterns over time</li>
                        <li> Identify highest and lowest transactions</li>
                        <li> Filter insights by categories or time periods</li>
                    </ul>
                </div>
            </div>

            {/* Modals */}
            {showTransferModal && <TransferModal closeModal={toggleTransferModal} />}
            {showTransactionHistoryModal && <TransactionHistoryModal closeModal={toggleTransactionHistoryModal} />}
            {showChangePasswordModal && <ChangePasswordModal closeModal={toggleChangePasswordModal} />}
        </div>
    );
};

export default FeatureCards;
