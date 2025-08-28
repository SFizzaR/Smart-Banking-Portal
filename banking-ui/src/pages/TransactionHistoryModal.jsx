import React, { useState, useEffect } from "react";
import "./TransactionHistoryModal.css";

const TransactionHistoryModal = ({ closeModal }) => {
    const [transactions, setTransactions] = useState({ sent: [], received: [] });
    const [selectedFilter, setSelectedFilter] = useState("last15days");
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `https://localhost:7065/api/User/transactions?filter=${encodeURIComponent(selectedFilter)}`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}` // ✅ assuming you store JWT in localStorage
                    }
                }
            );
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            console.log("API Response:", data); // debug

            setTransactions({
                sent: data.sent || [],
                received: data.received || []
            });
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTransactions();
    }, [selectedFilter]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button
                    className="modal-close-btn"
                    onClick={closeModal}
                    aria-label="Close modal"
                >
                    &times;
                </button>
                <h2>Transaction History</h2>

                {/* Filter Dropdown */}
                <div className="filter-container">
                    <label>Filter: </label>
                    <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        <option value="last15days">Last 15 Days</option>
                        <option value="lastmonth">Last 1 Month</option>
                        <option value="last6months">Last 6 Months</option>
                        <option value="lastyear">Last 1 Year</option>
                        <option value="all">All</option>
                    </select>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                            {/* Sent Transactions */}
                            <h3>Sent Transactions</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>To</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.sent.length > 0 ? (
                                        transactions.sent.map((tx, index) => (
                                            <tr key={index}>
                                                <td>{tx.toFullName} ({tx.toAccountNumber})</td>
                                                <td>{tx.amount}</td>
                                                <td>{new Date(tx.date).toLocaleDateString()}</td>
                                                <td>{tx.category}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">No sent transactions found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Received Transactions */}
                            <h3>Received Transactions</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>From</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.received.length > 0 ? (
                                        transactions.received.map((tx, index) => (
                                            <tr key={index}>
                                                <td>{tx.fromFullName} ({tx.fromAccountNumber})</td>
                                                <td>{tx.amount}</td>
                                                <td>{new Date(tx.date).toLocaleDateString()}</td>
                                                <td>{tx.category}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">No received transactions found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                    </>
            )}

            </div>
        </div>
    );
};

export default TransactionHistoryModal;
