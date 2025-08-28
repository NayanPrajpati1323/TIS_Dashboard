import { Router } from "express";
import { DatabaseService } from "../services/DatabaseService.js";

const router = Router();

// Get all quotations
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const search = (req.query.search as string) || "";

    const result = await DatabaseService.getQuotations(page, limit, search);
    res.json(result);
  } catch (error) {
    console.error("Error in GET /api/quotations:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch quotations",
    });
  }
});

// Get quotation by ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid quotation ID",
      });
    }

    const result = await DatabaseService.getQuotationById(id);
    res.json(result);
  } catch (error) {
    console.error(`Error in GET /api/quotations/${req.params.id}:`, error);
    if (error instanceof Error && error.message === "Quotation not found") {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to fetch quotation",
      });
    }
  }
});

// Create new quotation
router.post("/", async (req, res) => {
  try {
    const { quotation, items } = req.body;

    if (!quotation || !items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: "Quotation data and items are required",
      });
    }

    const result = await DatabaseService.createQuotation(quotation, items);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in POST /api/quotations:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create quotation",
    });
  }
});

// Update quotation
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid quotation ID",
      });
    }

    const { quotation, items } = req.body;

    const result = await DatabaseService.updateQuotation(id, quotation, items);
    res.json(result);
  } catch (error) {
    console.error(`Error in PUT /api/quotations/${req.params.id}:`, error);
    if (error instanceof Error && error.message === "Quotation not found") {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to update quotation",
      });
    }
  }
});

// Delete quotation
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid quotation ID",
      });
    }

    const result = await DatabaseService.deleteQuotation(id);
    res.json(result);
  } catch (error) {
    console.error(`Error in DELETE /api/quotations/${req.params.id}:`, error);
    if (error instanceof Error && error.message === "Quotation not found") {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to delete quotation",
      });
    }
  }
});

export default router;
