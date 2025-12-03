import React, { useState } from 'react';
import axios from 'axios';
import "./passwordmodal.css"
const ChangePasswordModal = ({ closeModal }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errors, setErrors] = useState([]); // for new password & confirm validations
    const [error, setError] = useState('');   // for old password mismatch from backend
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const validateNewPasswords = () => {
        const validationErrors = [];

        if (newPassword.length < 8) {
            validationErrors.push('New password must be at least 8 characters long.');
        }

        if (newPassword !== confirmNewPassword) {
            validationErrors.push('Confirm password does not match new password.');
        }

        return validationErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setError('');
        setSuccessMsg('');
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('You are not logged in. Please login first.');
            setLoading(false);
            return;
        }

        try {
            if (oldPassword == newPassword) {
                setError('New password should not be same as old password');
                return

            }
            // 1. Call backend with old and new password
            const response = await axios.post(
                'https://localhost:7065/api/user/changepassword',
                {
                    OldPassword: oldPassword,
                    NewPassword: newPassword,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // 2. Backend accepted old password, now validate new passwords client side
            const clientErrors = validateNewPasswords();
            if (clientErrors.length > 0) {
                setErrors(clientErrors);
                setLoading(false);
                return;
            }

            // 3. If all good, success
            setSuccessMsg(response.data);
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Unauthorized: Please login again.');
            } else if (err.response && err.response.data) {
                const data = err.response.data;
                if (typeof data === 'string') {
                    // assume string error is old password mismatch or other backend error
                    setError(data);
                    // Skip client validations since old password is invalid
                    setErrors([]);
                } else if (data.message) {
                    setError(data.message);
                    setErrors([]);
                } else {
                    setError('Failed to change password');
                }
            } else if (err.message) {
                setError(err.message);
            } else {
                setError('Failed to change password');
            }
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

                <h2>Change Password</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Old Password:
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        New Password:
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Confirm New Password:
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                    </label>

                    {/* Show client validation errors */}
                    {errors.length > 0 && (
                        <div className="error-container">
                            {errors.map((err, idx) => (
                                <p key={idx} className="error-msg">
                                    Error: {err}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Show old password mismatch error */}
                    {error && <p className="error-msg">Error: {error}</p>}

                    {successMsg && <p className="success-msg">{successMsg}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="change-password-btn"
                    >
                        {loading ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
