
import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

function ChangePassword() {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setSuccess(false);

        if (form.newPassword.length < 8) {
            setMessage("Password must be at least 8 characters");
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        if (form.currentPassword === form.newPassword) {
            setMessage("New password must be different");
            return;
        }

        setLoading(true);

        try {
            const data = await api.changePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });

            setSuccess(true);
            setMessage(data.message);

            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

        } catch (error) {
            setMessage(error.message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-card">

            <h1>Change Password</h1>
            <p>Keep your account secure</p>

            <form onSubmit={handleSubmit}>

                <label>Current Password</label>

                <input
                    type="password"
                    name="currentPassword"
                    placeholder="Current password"
                    value={form.currentPassword}
                    onChange={handleChange}
                    required
                />

                <label>New Password</label>

                <input
                    type="password"
                    name="newPassword"
                    placeholder="New password"
                    value={form.newPassword}
                    onChange={handleChange}
                    minLength={8}
                    required
                />

                <label>Confirm New Password</label>

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                </button>

            </form>

            {message && (
                <p className={success ? "success-message" : "error-message"}>
                    {message}
                </p>
            )}

            <Link to="/dashboard/profile" className="back-link">
                Back to Profile
            </Link>

        </div>
    );
}

export default ChangePassword;