const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");


// GET ALL PRODUCTS
// User + Admin
router.get("/", authenticateToken, async (req, res) => {
    try {
        const search = req.query.search || "";

        let query = {};

        if (search.trim() !== "") {
            const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const searchRegex = new RegExp(escaped, "i");

            const conditions = [
                { name: searchRegex },
                { description: searchRegex }
            ];

            const num = Number(search.trim().replace(/[^0-9.]/g, ""));
            if (!isNaN(num) && num > 0) {
                conditions.push({
                    price: { $gte: num * 0.9, $lte: num * 1.1 }
                });
            }

            query = {
                $or: conditions
            };
        }

        const products = await Product.find(query).sort({
            createdAt: -1
        });

        res.status(200).json(products);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch products."
        });
    }
});


// GET SINGLE PRODUCT
// User + Admin
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product."
        });
    }
});


// ADD PRODUCT
// Admin only
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const {
            name,
            image,
            price,
            description
        } = req.body;

        if (!name || !image || price === undefined || !description) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        if (Number(price) < 0) {
            return res.status(400).json({
                message: "Price cannot be negative."
            });
        }

        const product = new Product({
            name,
            image,
            price: Number(price),
            description
        });

        await product.save();

        res.status(201).json({
            message: "Product added successfully.",
            product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to add product."
        });
    }
});


// EDIT PRODUCT
// Admin only
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const {
            name,
            image,
            price,
            description
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        product.name = name;
        product.image = image;
        product.price = Number(price);
        product.description = description;

        await product.save();

        res.status(200).json({
            message: "Product updated successfully.",
            product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update product."
        });
    }
});


// DELETE PRODUCT
// Admin only
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.status(200).json({
            message: "Product deleted successfully."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete product."
        });
    }
});


module.exports = router;