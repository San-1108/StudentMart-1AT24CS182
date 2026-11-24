import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem("studentmart_cart");
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (e) {
            console.error("Failed to load cart from localStorage", e);
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem("studentmart_cart", JSON.stringify(cart));
        } catch (e) {
            console.error("Failed to save cart to localStorage", e);
        }
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex(
                (item) => item.product._id === product._id
            );
            if (existingIndex > -1) {
                const updated = [...prevCart];
                updated[existingIndex].quantity += 1;
                return updated;
            } else {
                return [...prevCart, { product, quantity: 1 }];
            }
        });
    };

    const updateQuantity = (productId, delta) => {
        setCart((prevCart) => {
            return prevCart
                .map((item) => {
                    if (item.product._id === productId) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean);
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) =>
            prevCart.filter((item) => item.product._id !== productId)
        );
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("studentmart_cart");
    };

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const totalAmount = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                totalCount,
                totalAmount,
                isCartOpen,
                setIsCartOpen,
                openCart: () => setIsCartOpen(true),
                closeCart: () => setIsCartOpen(false)
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
