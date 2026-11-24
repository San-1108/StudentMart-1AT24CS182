import { useEffect, useState, useMemo } from "react";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";

function Browse() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [addedIds, setAddedIds] = useState({});

    const { addToCart, openCart } = useCart();

    const fetchProducts = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await api.getProducts();
            setProducts(data);
        } catch (err) {
            setError(err.message || "Failed to load marketplace products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Search filter across name, price, and description
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

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedIds((prev) => ({ ...prev, [product._id]: true }));
        setTimeout(() => {
            setAddedIds((prev) => ({ ...prev, [product._id]: false }));
        }, 1200);
    };

    return (
        <div className="marketplace-view">
            {/* HERO / HEADER SECTION */}
            <div className="marketplace-header">
                <div>
                    <span className="eyebrow">CAMPUS MARKETPLACE</span>
                    <h1 className="marketplace-title">Discover & Buy</h1>
                    <p className="marketplace-subtitle">
                        Find textbooks, calculators, electronics, and study gear from fellow students.
                    </p>
                </div>
            </div>

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
                        placeholder="Search products by keyword in name, price, or description..."
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

                <div className="search-stats">
                    <span>
                        {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} available
                    </span>
                </div>
            </div>

            {error && <div className="error-banner">{error}</div>}

            {/* PRODUCT GRID */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading marketplace items...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="empty-state-box">
                    <h3>No items found</h3>
                    <p>
                        {searchQuery
                            ? `No items matched your search for "${searchQuery}".`
                            : "There are currently no items listed in the marketplace."}
                    </p>
                    {searchQuery && (
                        <button
                            className="btn-secondary btn-sm"
                            onClick={() => setSearchQuery("")}
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            ) : (
                <div className="products-grid">
                    {filteredProducts.map((product) => {
                        const isAdded = addedIds[product._id];
                        return (
                            <div key={product._id} className="product-card">
                                <div className="product-card-media">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-card-img"
                                        onError={(e) => {
                                            e.target.src =
                                                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400";
                                        }}
                                    />
                                    <span className="product-price-badge">
                                        Rs. {product.price}
                                    </span>
                                </div>

                                <div className="product-card-body">
                                    <h3 className="product-card-title">
                                        {product.name}
                                    </h3>
                                    <p className="product-card-description">
                                        {product.description}
                                    </p>

                                    <div className="product-card-footer">
                                        <div className="product-card-price-display">
                                            <span className="price-label">Price</span>
                                            <span className="price-value">
                                                Rs. {product.price}
                                            </span>
                                        </div>

                                        <button
                                            className={`btn-add-cart ${isAdded ? "added" : ""}`}
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            {isAdded ? "Added" : "+ Add to Cart"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Browse;
