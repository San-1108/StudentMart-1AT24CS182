import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

function AdminLogin() {
    const [form, setForm] = useState({
        email: "admin@studentmart.com",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const data = await api.adminLogin(form);

            if (!data.token) {
                throw new Error("Admin login response missing token");
            }

            if (data.user.role !== "admin") {
                throw new Error("Access denied: Not an administrator account");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/admin/dashboard");
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container admin-auth-bg">
            <div className="auth-box admin-auth-box">
                <div className="admin-badge-tag">ADMIN PORTAL</div>
                <h1>System Admin</h1>
                <p>Sign in to manage catalog, orders, and users</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Admin Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="admin@studentmart.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter admin password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="admin-demo-hint">
                        <span>Default Credentials:</span>
                        <code>admin@studentmart.com</code> / <code>admin12345</code>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Authenticating..." : "Sign In to Admin Console"}
                    </button>
                </form>

                {message && <p className="error-message">{message}</p>}

                <div className="admin-switch-link">
                    <span>Not an admin?</span>{" "}
                    <Link to="/login">Go to Student Login</Link>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
