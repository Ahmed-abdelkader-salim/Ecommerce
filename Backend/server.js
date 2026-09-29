import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDb from "./config/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from './routes/cartRoutes.js'
import adminRouter from "./routes/adminRoutes.js";

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter)

app.use("/api/admin", adminRouter);

app.post("/test", (req, res) => {
    console.log("TEST BODY:", req.body);
  
    res.json({
      success: true,
      body: req.body,
    });
  });

// Test route
app.get("/", (req, res) => {
  res.send("Api is Working Success");
});

// Start server
app.listen(PORT, async () => {
  try {
    await connectDb();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Database connection error:", error);
  }
});