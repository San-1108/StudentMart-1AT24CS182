const API_URL = "http://localhost:5000";

export const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

export const api = {
    register: (userData) =>
        apiRequest("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(userData),
        }),

    login: (credentials) =>
        apiRequest("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        }),

    adminLogin: (credentials) =>
        apiRequest("/api/auth/admin/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        }),

    getProfile: () =>
        apiRequest("/api/users/profile"),

    updateProfile: (userData) =>
        apiRequest("/api/users/profile", {
            method: "PUT",
            body: JSON.stringify(userData),
        }),

    changePassword: (passwordData) =>
        apiRequest("/api/users/change-password", {
            method: "PATCH",
            body: JSON.stringify(passwordData),
        }),

    // Products
    getProducts: (search = "") =>
        apiRequest(`/api/products${search ? `?search=${encodeURIComponent(search)}` : ""}`),

    getProduct: (id) =>
        apiRequest(`/api/products/${id}`),

    addProduct: (productData) =>
        apiRequest("/api/products", {
            method: "POST",
            body: JSON.stringify(productData),
        }),

    updateProduct: (id, productData) =>
        apiRequest(`/api/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(productData),
        }),

    deleteProduct: (id) =>
        apiRequest(`/api/products/${id}`, {
            method: "DELETE",
        }),

    // Orders
    createOrder: (orderData) =>
        apiRequest("/api/orders", {
            method: "POST",
            body: JSON.stringify(orderData),
        }),

    getMyOrders: () =>
        apiRequest("/api/orders/my-orders"),

    getAllOrders: () =>
        apiRequest("/api/orders"),

    getAdminStats: () =>
        apiRequest("/api/orders/stats"),
};