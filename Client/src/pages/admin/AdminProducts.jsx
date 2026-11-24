import { useEffect, useState, useMemo } from "react";
import { api } from "../../services/api";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Search query state
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProductId, setDeletingProductId] = useState(null);

    // Form state
    const [form, setForm] = useState({
        name: "",
        image: "",
        price: "",
        description: ""
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState("");

    const fetchProducts = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await api.getProducts();
            setProducts(data);
        } catch (err) {
            setError(err.message || "Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products based on keywords matching name, price, or description
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products;
        const q = searchQuery.toLowerCase().trim();
        return products.filter((p) => {
            const nameMatch = p.name?.toLowerCase().includes(q);
            const descMatch = p.description?.toLowerCase().includes(q);
            const priceMatch = p.price?.toString().includes(q);
            return nameMatch || descMatch || priceMatch;
        });
    }, [products, searchQuery]);

    const openAddModal = () => {
        setEditingProduct(null);
        setForm({
            name: "",
            image: "",
            price: "",
            description: ""
        });
        setFormError("");
        setIsAddModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            image: product.image,
            price: product.price,
            description: product.description
        });
        setFormError("");
        setIsAddModalOpen(true);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setEditingProduct(null);
        setFormError("");
    };

    const handleFormChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!form.name || !form.image || form.price === "" || !form.description) {
            setFormError("All fields (Name, Image URL, Price, Description) are required.");
            return;
        }

        if (Number(form.price) < 0) {
            setFormError("Price cannot be negative.");
            return;
        }

        setFormLoading(true);

        try {
            const payload = {
                name: form.name.trim(),
                image: form.image.trim(),
                price: Number(form.price),
                description: form.description.trim()
            };

            if (editingProduct) {
                await api.updateProduct(editingProduct._id, payload);
                setSuccessMessage("Product updated successfully!");
            } else {
                await api.addProduct(payload);
                setSuccessMessage("New product created successfully!");
            }

            closeModal();
            fetchProducts();
            setTimeout(() => setSuccessMessage(""), 4000);
        } catch (err) {
            setFormError(err.message || "Operation failed.");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this product?")) {
            return;
        }

        setDeletingProductId(id);
        try {
            await api.deleteProduct(id);
            setProducts(products.filter((p) => p._id !== id));
            setSuccessMessage("Product deleted successfully.");
            setTimeout(() => setSuccessMessage(""), 4000);
        } catch (err) {
            setError(err.message || "Failed to delete product.");
        } finally {
            setDeletingProductId(null);
        }
    };

    return (
        <div className="admin-products-view">
            <div className="view-header">
                <div>
                    <span className="view-eyebrow">CATALOG MANAGEMENT</span>
                    <h1 className="view-title">Products ({products.length})</h1>
                </div>

                <div className="view-actions">
                    <button className="btn-primary" onClick={openAddModal}>
                        + Add Product
                    </button>
                </div>
            </div>

            {successMessage && (
                <div className="success-banner">{successMessage}</div>
            )}
            {error && <div className="error-banner">{error}</div>}

            {/* SEARCH BAR */}
            <div className="search-filter-bar">
                <div className="search-input-wrapper">
                    <span className="search-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search products by name, price, or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-field"
                    />
                    {searchQuery && (
                        <button
                            className="clear-search-btn"
                            onClick={() => setSearchQuery("")}
                            aria-label="Clear search"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* PRODUCTS LIST */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading catalog items...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="empty-state-box">
                    <h3>No products found</h3>
                    <p>
                        {searchQuery
                            ? `No products matched "${searchQuery}". Try different keywords.`
                            : "Your product catalog is empty. Click '+ Add Product' to create one."}
                    </p>
                    {searchQuery && (
                        <button
                            className="btn-secondary btn-sm"
                            onClick={() => setSearchQuery("")}
                        >
                            Clear Search Filter
                        </button>
                    )}
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Description</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((p) => (
                                <tr key={p._id}>
                                    <td style={{ width: "80px" }}>
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="product-thumbnail"
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120";
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <strong className="product-table-name">
                                            {p.name}
                                        </strong>
                                    </td>
                                    <td>
                                        <span className="product-table-price">
                                            Rs. {p.price}
                                        </span>
                                    </td>
                                    <td>
                                        <p className="product-table-desc">
                                            {p.description}
                                        </p>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <div className="action-buttons-cell">
                                            <button
                                                className="btn-secondary btn-xs"
                                                onClick={() => openEditModal(p)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn-danger btn-xs"
                                                onClick={() => handleDelete(p._id)}
                                                disabled={deletingProductId === p._id}
                                            >
                                                {deletingProductId === p._id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ADD / EDIT MODAL */}
            {isAddModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div
                        className="modal-content product-form-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <div>
                                <span className="modal-label">
                                    {editingProduct ? "MODIFY PRODUCT" : "NEW PRODUCT"}
                                </span>
                                <h2>
                                    {editingProduct ? "Edit Product" : "Add Product to Store"}
                                </h2>
                            </div>
                            <button className="modal-close-btn" onClick={closeModal} aria-label="Close">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="checkout-form">
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Engineering Mathematics Volume 1"
                                    value={form.name}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="url"
                                    name="image"
                                    placeholder="https://example.com/image.jpg"
                                    value={form.image}
                                    onChange={handleFormChange}
                                    required
                                />
                                {form.image && (
                                    <div className="image-preview-box">
                                        <span>Preview:</span>
                                        <img
                                            src={form.image}
                                            alt="Preview"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                            }}
                                            onLoad={(e) => {
                                                e.target.style.display = "block";
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Price (INR)</label>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="e.g. 450"
                                    min="0"
                                    step="1"
                                    value={form.price}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    placeholder="Enter detailed description of the product, its condition, and relevant specifications..."
                                    value={form.description}
                                    onChange={handleFormChange}
                                    className="form-textarea"
                                    required
                                />
                            </div>

                            {formError && (
                                <p className="error-message">{formError}</p>
                            )}

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={closeModal}
                                    disabled={formLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={formLoading}
                                >
                                    {formLoading
                                        ? "Saving..."
                                        : editingProduct
                                        ? "Save Changes"
                                        : "Create Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;
