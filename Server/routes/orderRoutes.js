const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

// PLACE ORDER (User)
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { items, shippingAddress, totalAmount } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Cart items are required to place an order."
            });
        }

        if (
            !shippingAddress ||
            !shippingAddress.fullName ||
            !shippingAddress.phone ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.postalCode
        ) {
            return res.status(400).json({
                message: "Complete shipping address is required."
            });
        }

        if (totalAmount === undefined || Number(totalAmount) < 0) {
            return res.status(400).json({
                message: "Valid total amount is required."
            });
        }

        const order = new Order({
            user: req.userId,
            items: items.map((item) => ({
                product: item.product || item._id,
                name: item.name,
                price: Number(item.price),
                quantity: Number(item.quantity) || 1,
                image: item.image || ""
            })),
            shippingAddress: {
                fullName: shippingAddress.fullName.trim(),
                phone: shippingAddress.phone.trim(),
                address: shippingAddress.address.trim(),
                city: shippingAddress.city.trim(),
                postalCode: shippingAddress.postalCode.trim()
            },
            totalAmount: Number(totalAmount),
            status: "Placed"
        });

        await order.save();

        res.status(201).json({
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        console.error("Order placement error:", error);
        res.status(500).json({
            message: "Failed to place order."
        });
    }
});

// GET USER'S ORDERS (User)
router.get("/my-orders", authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId }).sort({
            createdAt: -1
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetch user orders error:", error);
        res.status(500).json({
            message: "Failed to fetch orders."
        });
    }
});

// GET ADMIN DASHBOARD STATS (Admin)
router.get("/stats", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [orderCount, userCount, productCount, revenueAgg, recentOrders] =
            await Promise.all([
                Order.countDocuments(),
                User.countDocuments(),
                Product.countDocuments(),
                Order.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: "$totalAmount" }
                        }
                    }
                ]),
                Order.find()
                    .populate("user", "name email")
                    .sort({ createdAt: -1 })
                    .limit(8)
            ]);

        const totalRevenue =
            revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

        res.status(200).json({
            orderCount,
            userCount,
            productCount,
            totalRevenue,
            recentOrders
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        res.status(500).json({
            message: "Failed to fetch dashboard statistics."
        });
    }
});

// GET ALL ORDERS (Admin)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetch all orders error:", error);
        res.status(500).json({
            message: "Failed to fetch orders."
        });
    }
});

module.exports = router;
