import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";

function Dashboard() {
    const navigate = useNavigate();
    const { totalCount, openCart } = useCart();

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const initial = user.name
        ? user.name.charAt(0).toUpperCase()
        : "U";

    return (
        <div className="dashboard-layout">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <span className="brand-mark">S</span>
                    <span>StudentMart</span>
                </div>

                <div className="sidebar-section">
                    <span className="sidebar-label">MAIN MENU</span>

                    <NavLink
                        to="/dashboard"
                        end
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="sidebar-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                            </svg>
                        </span>
                        <span>Browse Products</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/orders"
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="sidebar-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                        </span>
                        <span>My Orders</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/profile"
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="sidebar-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </span>
                        <span>Profile</span>
                    </NavLink>
                </div>

                {user.role === "admin" && (
                    <div className="sidebar-section" style={{ marginTop: "15px" }}>
                        <span className="sidebar-label">ADMINISTRATION</span>
                        <NavLink
                            to="/admin/dashboard"
                            className="sidebar-link admin-navlink"
                        >
                            <span className="sidebar-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                </svg>
                            </span>
                            <span>Admin Console</span>
                        </NavLink>
                    </div>
                )}

                {/* USER SECTION */}
                <div className="sidebar-bottom">
                    <div className="sidebar-user">
                        <div className="sidebar-avatar">
                            {initial}
                        </div>

                        <div className="sidebar-user-info">
                            <strong>{user.name || "Student"}</strong>
                            <span>{user.role === "admin" ? "Admin Account" : "Student Account"}</span>
                        </div>
                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN AREA */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div>
                        <span className="header-label">
                            STUDENTMART / CAMPUS
                        </span>
                        <h2>Marketplace</h2>
                    </div>

                    <div className="header-user">
                        {/* CART BUTTON */}
                        <button
                            className="cart-trigger-btn"
                            onClick={openCart}
                            title="Open Shopping Cart"
                        >
                            <span className="cart-trigger-icon">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                            </span>
                            <span className="cart-trigger-text">Cart</span>
                            {totalCount > 0 && (
                                <span className="cart-badge-count">{totalCount}</span>
                            )}
                        </button>

                        <div className="header-divider"></div>

                        <span>{user.name || "Student"}</span>

                        <div className="sidebar-avatar">
                            {initial}
                        </div>
                    </div>
                </header>

                {/* CHILD PAGES RENDER HERE */}
                <section className="dashboard-content">
                    <Outlet />
                </section>
            </main>

            {/* SLIDE-OVER CART DRAWER */}
            <CartDrawer />
        </div>
    );
}

export default Dashboard;
