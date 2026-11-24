import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await api.getMyOrders();
            setOrders(data);
        } catch (err) {
            setError(err.message || "Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="orders-view">
            <div className="view-header">
                <div>
                    <span className="eyebrow">PURCHASE HISTORY</span>
                    <h1 className="view-title">My Orders ({orders.length})</h1>
                    <p className="marketplace-subtitle">
                        Track your past campus orders and delivery addresses.
                    </p>
                </div>

                <div className="view-actions">
                    <Link to="/dashboard" className="btn-secondary btn-sm">
                        Back to Browse
                    </Link>
                </div>
            </div>

            {error && <div className="error-banner">{error}</div>}

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="empty-state-box">
                    <h3>No orders yet</h3>
                    <p>You haven't placed any orders yet. Discover items in the marketplace.</p>
                    <Link to="/dashboard" className="btn-primary btn-sm">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="user-order-card">
                            <div className="user-order-header">
                                <div className="user-order-meta">
                                    <span className="order-id-label">ORDER</span>
                                    <strong>#{order._id.slice(-6).toUpperCase()}</strong>
                                    <span className="order-date-label">
                                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="user-order-status-group">
                                    <span className="status-pill status-placed">
                                        {order.status || "Placed"}
                                    </span>
                                    <span className="order-total-highlight">
                                        Rs. {order.totalAmount}
                                    </span>
                                </div>
                            </div>

                            <div className="user-order-items">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="order-item-row">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="order-item-img"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100";
                                            }}
                                        />
                                        <div className="order-item-details">
                                            <strong>{item.name}</strong>
                                            <span>
                                                Qty: {item.quantity} x Rs. {item.price}
                                            </span>
                                        </div>
                                        <div className="order-item-subtotal">
                                            Rs. {item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="user-order-footer">
                                <span className="address-label">Delivery Address:</span>
                                <span className="address-val">
                                    {order.shippingAddress?.fullName} ({order.shippingAddress?.phone}) - {order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.postalCode}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrders;
