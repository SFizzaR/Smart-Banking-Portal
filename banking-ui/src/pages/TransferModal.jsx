import React, { useState } from "react";
import './UserModal.css';

const categories = [
    "Food",
    "Transport",
    "Utilities",
    "Entertainment",
    "FeePayment",
    "ElectricityBill",
    "GasBill",
    "MaintenanceBill",
    "Groceries",
    "Other"
];

const TransferModal = ({ closeModal }) => {
    const [accountNumber, setAccountNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Other");
    const [isSalaryCredit, setIsSalaryCredit] = useState(false);

    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTransfer = async () => {
        setMessage("");
        if (!accountNumber.trim()) {
            setIsSuccess(false);
            setMessage("Receiver Account Number is required.");
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            setIsSuccess(false);
            setMessage("Please enter a valid amount greater than zero.");
            return;
        }
        if (category === "Other" && description.trim() === "") {
            setIsSuccess(false);
            setMessage("Description is required when category is 'Other'.");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5202/api/user/transfer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    toAccountNumber: accountNumber,
                    amount: parseFloat(amount),
                    description,
                    category,
                    isSalaryCredit
                })
            });

            const resultText = await res.text();
            let result;
            try {
                result = JSON.parse(resultText);
            } catch {
                result = resultText;
            }

            if (!res.ok) {
                setIsSuccess(false);
                if (result && result.error) setMessage(result.error);
                else setMessage(typeof result === "string" ? result : "Transfer failed.");
            } else {
                setIsSuccess(true);
                setMessage(typeof result === "string" ? result : "Transfer successful.");
                // Reset form
                setAccountNumber("");
                setAmount("");
                setDescription("");
                setCategory("Other");
                setIsSalaryCredit(false);
            }
        } catch (err) {
            console.error(err);
            setIsSuccess(false);
            setMessage("Error connecting to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <button
                    className="modal-close-btn"
                    onClick={closeModal}
                    aria-label="Close modal"
                >
                    &times;
                </button>

                <h2>Transfer Money</h2>
                <div className="form-group">
                    <label htmlFor="accountNumber">Receiver Account Number</label>
                    <input
                        type="text"
                        placeholder="Receiver Account Number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        disabled={loading}
                        className="form-input"
                    />
                </div>
                <div className="form-group">

                    <label htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={loading}
                        className="form-input"

                    />
                </div>
                <div className="form-group">

                    <label htmlFor="category">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={loading}
                        className="form-input"

                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">

                    <label htmlFor="description">
                        Description {category === "Other" && <span style={{ color: "red" }}>*</span>}
                    </label>
                    <input
                        type="text"
                        placeholder="Description (required if Other)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                        className="form-input"

                    />
                </div>
                <div className="checkbox-group">
                    <span>Is Salary Credit?</span>
                    <input
                        type="checkbox"
                        checked={isSalaryCredit}
                        onChange={(e) => setIsSalaryCredit(e.target.checked)}
                        disabled={loading}
                    />
                </div>


                <div className="modal-buttons">
                    <button onClick={handleTransfer} disabled={loading}>
                        {loading ? "Sending..." : "Send"}
                    </button>
                    <button onClick={closeModal} disabled={loading}>Cancel</button>
                </div>


                {message && (
                    <p style={{ color: isSuccess ? "green" : "red", marginTop: "1rem" }}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default TransferModal;
