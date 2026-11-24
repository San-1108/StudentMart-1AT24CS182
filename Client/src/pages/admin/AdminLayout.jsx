import { NavLink, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
    const navigate = useNavigate();

    let user = { name: "Administrator", email: "admin@studentmart.com" };
    try {
        const stored = localStorage.getItem("user");
        if (stored) user = JSON.parse(stored);
    } catch (e) {
        console.error(e);
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/admin/login");
    };

    return (
        <div className="dashboard-layout">
            {/* ADMIN SIDEBAR */}
            <aside className="sidebar admin-sidebar">
                <div className="sidebar-brand">
                    <span className="brand-mark">S</span>
                    <div className="admin-brand-text">
                        <span>StudentMart</span>
                        <span className="admin-pill">ADMIN</span>
                    </div>
                </div>

                <div className="sidebar-section">
                    <span className="sidebar-label">MANAGEMENT</span>

                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="sidebar-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10" />
                                <line x1="12" y1="20" x2="12" y2="4" />
                                <line x1="6" y1="20" x2="6" y2="14" />
                            </svg>
                        </span>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="sidebar-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                        </span>
                        <span>Products</span>
                    </NavLink>
                </div>

                <div className="sidebar-section" style={{ marginTop: "20px" }}>
                    <span className="sidebar-label">LINKS</span>
                    <NavLink
                        to="/dashboard"
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                        </span>
                        <span>View Storefront</span>
                    </NavLink>
                </div>

                <div className="sidebar-bottom">
                    <div className="sidebar-user">
                        <div className="sidebar-avatar admin-avatar">
                            A
                        </div>
                        <div className="sidebar-user-info">
                            <strong>{user.name || "Administrator"}</strong>
                            <span>{user.email}</span>
                        </div>
                    </div>

                    <button className="logout-button" onClick={handleLogout}>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN ADMIN AREA */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div>
                        <span className="header-label">
                            ADMIN CONSOLE / CONTROL PANEL
                        </span>
                        <h2>Administrator Workspace</h2>
                    </div>

                    <div className="header-user">
                        <span className="admin-status-indicator">
                            <span className="status-dot-active"></span> Admin Mode
                        </span>
                        <span>{user.name}</span>
                        <div className="sidebar-avatar admin-avatar">A</div>
                    </div>
                </header>

                <section className="dashboard-content">
                    <Outlet />
                </section>
            </main>
        </div>
    );
}

export default AdminLayout;
