const itemModule = require("../modules/itemModule");

module.exports = {

  // GET (all items)
  getItems: async (req, res) => {
    try {
      const data = await itemModule.getAllItems();
      res.json(data);
    } catch (err) {
      console.error("❌ GET ERROR:", err);
      res.status(500).json({ error: "Failed to load items" });
    }
  },

  // INSERT (ID = 0 → insert)
  addItem: async (req, res) => {
    try {
      await itemModule.setItem(req.body);
      res.json({ message: "Item saved successfully" });
    } catch (err) {
      console.error("❌ SAVE ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // UPDATE (ID > 0 → update)
  updateItem: async (req, res) => {
    try {
      await itemModule.setItem({
        ...req.body,
        ID: parseInt(req.params.id)
      });
      res.json({ message: "Item updated successfully" });
    } catch (err) {
      console.error("❌ UPDATE ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE (unchanged)
  deleteItem: async (req, res) => {
    try {
      await itemModule.deleteItem(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      console.error("❌ DELETE ERROR:", err);
      res.status(500).json({ error: "Failed to delete" });
    }
  }
};
