import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { initializeDatabase, testConnection } from "./config/database";
import { DatabaseService } from "./services/DatabaseService";
import {
  getDashboardStats,
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getUnits,
  createUnit,
  updateUnit,
  deleteUnit,
  healthCheck,
  getProfile,
  updateProfile,
} from "./routes/api";
import invoiceRoutes from "./routes/invoices.js";
import quotationRoutes from "./routes/quotations.js";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/health", healthCheck);

  // Legacy routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);

  // register routes
  app.post("/api/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }
    const user = await DatabaseService.registerUser({ name, email, password });
    if (user.success) {
      return res.status(201).json(user);
    } else {    
      return res.status(400).json({ error: user.error });
    }
  });

  // Login route
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    const user = await DatabaseService.loginUser(email, password);
    if (user.success) {
      return res.status(200).json(user);
    } else {
      return res.status(400).json({ error: user.error });
    }
  });

// Logout route
  app.post("/api/logout", (req, res) => {
    // Handle logout logic here
    res.status(200).json({ message: "Logged out successfully" });
  }); 

  // Profile routes
  app.get("/api/profile/:userId", getProfile);
  app.post("/api/profile/:userId", updateProfile);

  // Dashboard routes
  app.get("/api/dashboard/stats", getDashboardStats);

  // Customer routes
  app.get("/api/customers", getCustomers);
  app.post("/api/customers", createCustomer);
  app.put("/api/customers/:id", updateCustomer);
  app.delete("/api/customers/:id", deleteCustomer);

  // Product routes
  app.get("/api/products", getProducts);
  app.post("/api/products", createProduct);
  app.put("/api/products/:id", updateProduct);
  app.delete("/api/products/:id", deleteProduct);

  // Category routes
  app.get("/api/categories", getCategories);
  app.post("/api/categories", createCategory);
  app.put("/api/categories/:id", updateCategory);
  app.delete("/api/categories/:id", deleteCategory);

  // Units routes
  app.get("/api/units", getUnits);
  app.post("/api/units", createUnit);
  app.put("/api/units/:id", updateUnit);
  app.delete("/api/units/:id", deleteUnit);

  // Invoice routes
  app.use("/api/invoices", invoiceRoutes);

  // Quotation routes
  app.use("/api/quotations", quotationRoutes);

  // Initialize database
  initializeDatabase()
    .then(async () => {
      console.log('🚀 Database initialized successfully');
      // Seed sample data
      // await DatabaseService.seedSampleData();
    })
    .catch((error) => {
      console.error('❌ Database initialization failed:', error);
    });

  return app;
}
