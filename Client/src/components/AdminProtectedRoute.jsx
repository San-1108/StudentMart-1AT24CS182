import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {
    const token = localStorage.getItem("token");
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        user = null;
    }

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    if (user && user.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default AdminProtectedRoute;
