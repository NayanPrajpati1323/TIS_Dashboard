import { Router } from "express";
import { DatabaseService } from "../services/DatabaseService.js";

const router = Router();

// Get all invoices
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const search = (req.query.search as string) || "";

    const result = await DatabaseService.getInvoices(page, limit, search);
    res.json(result);
  } catch (error) {
    console.error("Error in GET /api/invoices:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch invoices",
    });
  }
});

// Get invoice by ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid invoice ID",
      });
    }

    const result = await DatabaseService.getInvoiceById(id);
    res.json(result);
  } catch (error) {
    console.error(`Error in GET /api/invoices/${req.params.id}:`, error);
    if (error instanceof Error && error.message === "Invoice not found") {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to fetch invoice",
      });
    }
  }
});

// Create new invoice
router.post("/", async (req, res) => {
  try {
    const { invoice, items } = req.body;

    if (!invoice || !items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: "Invoice data and items are required",
      });
    }

    const result = await DatabaseService.createInvoice(invoice, items);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in POST /api/invoices:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create invoice",
    });
  }
});

// Update invoice
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid invoice ID",
      });
    }

    const { invoice, items } = req.body;

    const result = await DatabaseService.updateInvoice(id, invoice, items);
    res.json(result);
  } catch (error) {
    console.error(`Error in PUT /api/invoices/${req.params.id}:`, error);
    if (error instanceof Error && error.message === "Invoice not found") {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to update invoice",
      });
    }
  }
});

// Delete invoice
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid invoice ID",
      });
    }

    const result = await DatabaseService.deleteInvoice(id);
    res.json(result);
  } catch (error) {
    console.error(`Error in DELETE /api/invoices/${req.params.id}:`, error);
    if (error instanceof Error && error.message === "Invoice not found") {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to delete invoice",
      });
    }
  }
});

export default router;
