
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

function EditProfile() {
    const [form, setForm] = useState({
        name: "",
        email: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api.getProfile();

                setForm({
                    name: data.user.name,
                    email: data.user.email,
                });

            } catch (error) {
                setMessage(error.message);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");

            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!form.name.trim() || !form.email.trim()) {
            setMessage("All fields are required");
            return;
        }

        setSaving(true);

        try {
            const data = await api.updateProfile({
                name: form.name.trim(),
                email: form.email.trim(),
            });

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            navigate("/dashboard/profile");

        } catch (error) {
            setMessage(error.message);

        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="page-container">Loading...</div>;
    }

    return (
        <div className="form-card">

            <h1>Edit Profile</h1>
            <p>Update your personal information</p>

            <form onSubmit={handleSubmit}>

                <label>Full Name</label>

                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <label>Email Address</label>

                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>

            </form>

            {message && (
                <p className="error-message">{message}</p>
            )}

            <Link to="/dashboard/profile" className="back-link">
                Back to Profile
            </Link>

        </div>
    );
}

export default EditProfile;