const { isMockMode, mockDb, supabase } = require('../config/supabase');

const getInventory = async (req, res) => {
  try {
    if (isMockMode) {
      return res.status(200).json({ success: true, data: mockDb.inventory });
    } else {
      const { data, error } = await supabase.from('inventory').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createInventoryItem = async (req, res) => {
  try {
    const { item_name, category, quantity, unit, min_threshold, unit_price, location } = req.body;
    if (!item_name || !category || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Item name, category, and quantity are required.' });
    }

    const qty = Number(quantity);
    const minT = Number(min_threshold) || 10;
    const status = qty <= 0 ? 'out_of_stock' : qty <= minT ? 'low_stock' : 'in_stock';

    if (isMockMode) {
      const newItem = {
        id: `inv-${Date.now()}`,
        item_name,
        category,
        quantity: qty,
        unit: unit || 'pcs',
        min_threshold: minT,
        unit_price: Number(unit_price) || 0,
        location: location || 'Main Warehouse',
        status
      };
      mockDb.inventory.push(newItem);
      return res.status(201).json({ success: true, message: 'Inventory item added.', data: newItem });
    } else {
      const { data, error } = await supabase.from('inventory').insert([{ item_name, category, quantity: qty, unit, min_threshold: minT, unit_price, location, status }]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Inventory item added.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getInventory, createInventoryItem };
