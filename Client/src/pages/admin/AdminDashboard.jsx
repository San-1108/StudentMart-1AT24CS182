import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

function AdminDashboard() {
    const [stats, setStats] = useState({
        orderCount: 0,
        userCount: 0,
        productCount: 0,
        totalRevenue: 0,
        recentOrders: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchStats = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await api.getAdminStats();
            setStats(data);
        } catch (err) {
            setError(err.message || "Failed to load statistics.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="admin-dashboard-view">
            <div className="view-header">
                <div>
                    <span className="view-eyebrow">METRICS & OVERVIEW</span>
                    <h1 className="view-title">Platform Statistics</h1>
                </div>

                <div className="view-actions">
                    <button onClick={fetchStats} className="btn-secondary btn-sm">
                        Refresh Data
                    </button>
                    <Link to="/admin/products" className="btn-primary btn-sm">
                        + Manage Products
                    </Link>
                </div>
            </div>

            {error && <div className="error-banner">{error}</div>}

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Fetching platform metrics...</p>
                </div>
            ) : (
                <>
                    {/* STAT CARDS */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <span className="stat-label">TOTAL ORDERS</span>
                            </div>
                            <div className="stat-number">{stats.orderCount}</div>
                            <span className="stat-subtext">Placed across campus</span>
                        </div>

                        <div className="stat-card">
                            <div className="stat-card-header">
                                <span className="stat-label">REGISTERED USERS</span>
                            </div>
                            <div className="stat-number">{stats.userCount}</div>
                            <span className="stat-subtext">Students & accounts</span>
                        </div>

                        <div className="stat-card">
                            <div className="stat-card-header">
                                <span className="stat-label">TOTAL PRODUCTS</span>
                            </div>
                            <div className="stat-number">{stats.productCount}</div>
                            <span className="stat-subtext">Listed in marketplace</span>
                        </div>

                        <div className="stat-card">
                            <div className="stat-card-header">
                                <span className="stat-label">TOTAL REVENUE</span>
                            </div>
                            <div className="stat-number">Rs. {stats.totalRevenue.toLocaleString()}</div>
                            <span className="stat-subtext">Gross order value</span>
                        </div>
                    </div>

                    {/* RECENT ORDERS TABLE */}
                    <div className="admin-section-box">
                        <div className="section-box-header">
                            <div>
                                <h3>Recent Orders</h3>
                                <p>Latest purchases placed by campus students</p>
                            </div>
                        </div>

                        {stats.recentOrders && stats.recentOrders.length > 0 ? (
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Address</th>
                                            <th>Items</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentOrders.map((order) => (
                                            <tr key={order._id}>
                                                <td>
                                                    <code className="order-id-badge">
                                                        #{order._id.slice(-6).toUpperCase()}
                                                    </code>
                                                </td>
                                                <td>
                                                    <div className="customer-cell">
                                                        <strong>{order.shippingAddress?.fullName || order.user?.name || "Student"}</strong>
                                                        <span className="customer-email">{order.shippingAddress?.phone || order.user?.email}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="address-text">
                                                        {order.shippingAddress?.address}, {order.shippingAddress?.city}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="items-summary-text">
                                                        {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                                                        {" "}({order.items?.map(i => i.name).join(", ").slice(0, 30)}{order.items?.map(i => i.name).join(", ").length > 30 ? "..." : ""})
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong>Rs. {order.totalAmount}</strong>
                                                </td>
                                                <td>
                                                    <span className="date-text">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="status-pill status-placed">
                                                        {order.status || "Placed"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-table-state">
                                <p>No orders have been placed yet.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminDashboard;
