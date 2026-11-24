import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Browse from "./pages/Browse";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import { CartProvider } from "./context/CartContext";

import "./App.css";

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    {/* PUBLIC ROUTES */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* AUTHENTICATED STUDENT ROUTES */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />}>
                            <Route index element={<Browse />} />
                            <Route path="orders" element={<MyOrders />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="profile/edit" element={<EditProfile />} />
                            <Route
                                path="profile/change-password"
                                element={<ChangePassword />}
                            />
                        </Route>
                    </Route>

                    {/* AUTHENTICATED ADMIN ROUTES */}
                    <Route element={<AdminProtectedRoute />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="products" element={<AdminProducts />} />
                        </Route>
                    </Route>

                    {/* UNKNOWN ROUTES */}
                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
}

export default App;
