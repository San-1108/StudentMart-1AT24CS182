const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// ROUTES
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const User = require("./models/User");
const Product = require("./models/Product");
const bcrypt = require("bcryptjs");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

async function seedInitialData() {
    try {
        // Seed Admin if not exists
        const adminEmail = "admin@studentmart.com";
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin12345", 10);
            await User.create({
                name: "Administrator",
                email: adminEmail,
                password: hashedPassword,
                role: "admin"
            });
            console.log("[DB] Default Admin account initialized (admin@studentmart.com / admin12345)");
        }

        // Seed Sample Products if store is empty
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            const sampleProducts = [
                {
                    name: "Engineering Mathematics Textbook",
                    price: 450,
                    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
                    description: "Standard university edition engineering mathematics textbook. Crisp condition, notes included."
                },
                {
                    name: "Scientific Calculator FX-991EX",
                    price: 899,
                    image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500&auto=format&fit=crop&q=80",
                    description: "Advanced scientific calculator essential for engineering, physics, and statistics courses."
                },
                {
                    name: "Campus Waterproof Laptop Backpack",
                    price: 1200,
                    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
                    description: "Durable black backpack with padded 15.6-inch laptop compartment and anti-theft zipper pocket."
                },
                {
                    name: "Wireless Study Headphones",
                    price: 1850,
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
                    description: "Active noise-cancelling wireless headphones with deep bass and 30-hour battery life for library focus."
                },
                {
                    name: "Engineering Drawing Instrument Set",
                    price: 350,
                    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&auto=format&fit=crop&q=80",
                    description: "Precision compass, dividers, protractor, and ruler set in protective plastic case."
                },
                {
                    name: "Rechargeable LED Desk Lamp",
                    price: 499,
                    image: "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=500&auto=format&fit=crop&q=80",
                    description: "Minimalist black desk lamp with 3 brightness modes, USB rechargeable battery, and flexible neck."
                }
            ];
            await Product.insertMany(sampleProducts);
            console.log("[DB] Initial sample products seeded into MongoDB");
        }
    } catch (err) {
        console.error("Seed error:", err.message);
    }
}

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB connected");
        await seedInitialData();

        app.listen(process.env.PORT || 5000, () => {
            console.log(
                `Server running on port ${process.env.PORT || 5000}`
            );
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });