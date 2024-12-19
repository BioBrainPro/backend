const express = require("express");
const router = express.Router();
const Page = require("../models/page");

// Create a new page
router.post("/create", async (req, res) => {
  try {
    const { name, path, content } = req.body;

    if (!name || !path || !content.length) {
      return res.status(400).json({ message: "Page name is required." });
    }

    const newPage = new Page({ name, path, content });
    await newPage.save();

    res.status(201).json({ message: "Page created successfully.", page: newPage });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Page name must be unique." });
    }
    res.status(500).json({ message: "Error creating page.", error: error.message });
  }
});

// Edit page name or content
router.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content, seo } = req.body;
    const updatedPage = await Page.findByIdAndUpdate(
      id,
      { ...(name && { name }), ...(content && { content }), ...(seo && { seo }) },
      { new: true },
    );

    if (!updatedPage) {
      return res.status(404).json({ message: "Page not found." });
    }

    res.status(200).json({ message: "Page updated successfully.", page: updatedPage });
  } catch (error) {
    res.status(500).json({ message: "Error updating page.", error: error.message });
  }
});

// Delete a page
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPage = await Page.findByIdAndDelete(id);

    if (!deletedPage) {
      return res.status(404).json({ message: "Page not found." });
    }

    res.status(200).json({ message: "Page deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting page.", error: error.message });
  }
});

// Get all pages (optional)
router.get("/list", async (req, res) => {
  try {
    const pages = await Page.find();
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving pages.", error: error.message });
  }
});

module.exports = router;
