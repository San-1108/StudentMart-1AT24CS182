import { useState } from "react";
import { useCart } from "../context/CartContext";
import CheckoutModal from "./CheckoutModal";

function CartDrawer() {
    const {
        cart,
        isCartOpen,
        closeCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalAmount
    } = useCart();

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    if (!isCartOpen) return null;

    const handleProceedToCheckout = () => {
        closeCart();
        setIsCheckoutOpen(true);
    };

    return (
        <>
            <div className="cart-backdrop" onClick={closeCart}>
                <aside
                    className="cart-drawer"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="cart-header">
                        <div className="cart-title-wrap">
                            <span className="cart-eyebrow">YOUR CART</span>
                            <h3>
                                Cart Items ({cart.reduce((acc, i) => acc + i.quantity, 0)})
                            </h3>
                        </div>
                        <button className="cart-close-btn" onClick={closeCart} aria-label="Close">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <div className="cart-body">
                        {cart.length === 0 ? (
                            <div className="cart-empty-state">
                                <h4>Your cart is empty</h4>
                                <p>Explore campus marketplace products and add them to your cart.</p>
                                <button className="btn-secondary" onClick={closeCart}>
                                    Browse Marketplace
                                </button>
                            </div>
                        ) : (
                            <div className="cart-items-list">
                                {cart.map((item) => (
                                    <div
                                        key={item.product._id}
                                        className="cart-item-card"
                                    >
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="cart-item-thumb"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200";
                                            }}
                                        />
                                        <div className="cart-item-info">
                                            <h5 className="cart-item-title">
                                                {item.product.name}
                                            </h5>
                                            <div className="cart-item-price">
                                                Rs. {item.product.price}
                                            </div>
                                            <div className="cart-item-controls">
                                                <div className="qty-picker">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.product._id, -1)
                                                        }
                                                        title="Decrease"
                                                    >
                                                        -
                                                    </button>
                                                    <span>{item.quantity}</span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.product._id, 1)
                                                        }
                                                        title="Increase"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    className="cart-item-remove"
                                                    onClick={() =>
                                                        removeFromCart(item.product._id)
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="cart-footer">
                            <div className="cart-subtotal-row">
                                <span>Subtotal</span>
                                <strong>Rs. {totalAmount}</strong>
                            </div>
                            <div className="cart-subtotal-row shipping-row">
                                <span>Campus Delivery</span>
                                <span className="free-badge">FREE</span>
                            </div>
                            <div className="cart-total-divider"></div>
                            <div className="cart-total-row">
                                <span>Total</span>
                                <strong>Rs. {totalAmount}</strong>
                            </div>

                            <button
                                className="btn-primary cart-checkout-btn"
                                onClick={handleProceedToCheckout}
                            >
                                Proceed to Checkout
                            </button>

                            <button
                                className="cart-clear-link"
                                onClick={clearCart}
                            >
                                Clear all items
                            </button>
                        </div>
                    )}
                </aside>
            </div>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
            />
        </>
    );
}

export default CartDrawer;
