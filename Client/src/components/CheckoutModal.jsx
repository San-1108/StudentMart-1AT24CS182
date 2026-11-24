import { useState } from "react";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";

function CheckoutModal({ isOpen, onClose, onOrderPlacedSuccess }) {
    const { cart, totalAmount, clearCart } = useCart();

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const [form, setForm] = useState({
        fullName: storedUser.name || "",
        phone: "",
        address: "",
        city: "",
        postalCode: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [orderSuccess, setOrderSuccess] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.fullName || !form.phone || !form.address || !form.city || !form.postalCode) {
            setError("All address fields are required.");
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                items: cart.map((item) => ({
                    product: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.product.image
                })),
                shippingAddress: {
                    fullName: form.fullName.trim(),
                    phone: form.phone.trim(),
                    address: form.address.trim(),
                    city: form.city.trim(),
                    postalCode: form.postalCode.trim()
                },
                totalAmount
            };

            const response = await api.createOrder(orderData);
            clearCart();
            setOrderSuccess(response.order);
            if (onOrderPlacedSuccess) {
                onOrderPlacedSuccess(response.order);
            }
        } catch (err) {
            setError(err.message || "Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOrderSuccess(null);
        setError("");
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {orderSuccess ? (
                    <div className="order-success-view">
                        <div className="success-icon-badge">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h2>Order Placed!</h2>
                        <p className="success-subtitle">
                            Thank you, {orderSuccess.shippingAddress?.fullName}! Your order has been placed successfully.
                        </p>

                        <div className="order-summary-box">
                            <div className="order-summary-row">
                                <span>Order ID</span>
                                <strong>#{orderSuccess._id.slice(-6).toUpperCase()}</strong>
                            </div>
                            <div className="order-summary-row">
                                <span>Total Amount</span>
                                <strong>INR {orderSuccess.totalAmount}</strong>
                            </div>
                            <div className="order-summary-row">
                                <span>Delivery To</span>
                                <span>
                                    {orderSuccess.shippingAddress.address}, {orderSuccess.shippingAddress.city}
                                </span>
                            </div>
                            <div className="order-summary-row">
                                <span>Status</span>
                                <span className="status-pill status-placed">Placed</span>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-primary" onClick={handleClose}>
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="modal-header">
                            <div>
                                <span className="modal-label">CHECKOUT</span>
                                <h2>Delivery Address</h2>
                            </div>
                            <button className="modal-close-btn" onClick={handleClose} aria-label="Close">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="checkout-summary-bar">
                            <span>
                                {cart.length} item{cart.length !== 1 ? "s" : ""} in cart
                            </span>
                            <span className="checkout-price">Total: Rs. {totalAmount}</span>
                        </div>

                        <form onSubmit={handleSubmit} className="checkout-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="e.g. Alex Johnson"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="e.g. 9876543210"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Campus / Hostel / Room Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="e.g. Block C, Room 304, Campus Hostel"
                                    value={form.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="e.g. Bangalore"
                                        value={form.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Postal / PIN Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        placeholder="e.g. 560001"
                                        value={form.postalCode}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="checkout-note">
                                Note: No payment gateway required right now. Simply click Place Order to confirm.
                            </div>

                            {error && <p className="error-message">{error}</p>}

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={handleClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loading || cart.length === 0}
                                >
                                    {loading ? "Placing Order..." : `Place Order (Rs. ${totalAmount})`}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CheckoutModal;
