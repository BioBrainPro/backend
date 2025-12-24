const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    index: { type: Number, default: 0 },
    name: { type: Map, of: String,  required: true, unique: true },
    path: { type: String, required: true, unique: true },
    seo: {
        title: { type: String, default: '' },  // SEO title
        description: { type: String, default: '' },  // SEO description
        keywords: { type: String, default: '' },  // SEO keywords, changed from 'keyboard' to 'keywords'
    },
    content: { type: mongoose.Schema.Types.Mixed, default: {} }, // This allows any structure
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Page = mongoose.model("Page", pageSchema);

module.exports = Page;
