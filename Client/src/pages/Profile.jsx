
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

function Profile() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api.getProfile();

                setUser(data.user);

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

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

    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (!user) {
        return <div>{message || "Profile unavailable"}</div>;
    }

    return (
        <div className="profile-card">

            <div className="profile-header">
                <div className="avatar">
                    {user.name.charAt(0).toUpperCase()}
                </div>

                <h1>My Profile</h1>
                <p>Manage your StudentMart account</p>
            </div>

            <div className="profile-details">

                <div className="detail">
                    <span>Full Name</span>
                    <strong>{user.name}</strong>
                </div>

                <div className="detail">
                    <span>Email Address</span>
                    <strong>{user.email}</strong>
                </div>

                <div className="detail">
                    <span>Account ID</span>
                    <strong>{user._id}</strong>
                </div>

                <div className="detail">
                    <span>Joined On</span>
                    <strong>
                        {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "Not available"}
                    </strong>
                </div>

            </div>

            <div className="profile-actions">

                <Link
                    to="/dashboard/profile/edit"
                    className="btn-primary"
                >
                    Edit Profile
                </Link>

                <Link
                    to="/dashboard/profile/change-password"
                    className="btn-secondary"
                >
                    Change Password
                </Link>

            </div>

        </div>
    );
}

export default Profile;