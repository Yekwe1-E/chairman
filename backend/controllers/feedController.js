const { isMockMode, mockDb, supabase } = require('../config/supabase');

const getFeedItems = async (req, res) => {
  try {
    if (isMockMode) {
      return res.status(200).json({ success: true, data: mockDb.feed_inventory });
    } else {
      const { data, error } = await supabase.from('feed_inventory').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createFeedItem = async (req, res) => {
  try {
    const { feed_name, feed_type, unit, quantity_purchased, current_stock, reorder_level, unit_price, supplier_name, expiry_date, storage_location } = req.body;
    if (!feed_name || !feed_type || current_stock === undefined) {
      return res.status(400).json({ success: false, message: 'Feed name, feed type, and current stock are required.' });
    }

    if (isMockMode) {
      const newFeed = {
        id: `fd-${Date.now()}`,
        feed_name,
        feed_type,
        unit: unit || 'bags',
        quantity_purchased: Number(quantity_purchased) || Number(current_stock),
        quantity_consumed: 0,
        current_stock: Number(current_stock),
        reorder_level: Number(reorder_level) || 20,
        unit_price: Number(unit_price) || 0,
        supplier_name: supplier_name || 'Standard Feed Mills',
        expiry_date: expiry_date || '2027-01-01',
        storage_location: storage_location || 'Main Feed Store'
      };

      mockDb.feed_inventory.push(newFeed);
      return res.status(201).json({ success: true, message: 'Feed item added to inventory.', data: newFeed });
    } else {
      const { data, error } = await supabase.from('feed_inventory').insert([{
        feed_name, feed_type, unit, quantity_purchased, current_stock, reorder_level, unit_price, supplier_name, expiry_date, storage_location
      }]).select().single();

      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Feed item added to inventory.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const logFeedConsumption = async (req, res) => {
  try {
    const { feed_id, quantity_consumed_bags } = req.body;
    if (!feed_id || !quantity_consumed_bags) {
      return res.status(400).json({ success: false, message: 'Feed item and consumed quantity are required.' });
    }

    const qty = Number(quantity_consumed_bags);

    if (isMockMode) {
      const item = mockDb.feed_inventory.find(f => f.id === feed_id);
      if (!item) return res.status(404).json({ success: false, message: 'Feed item not found.' });
      if (item.current_stock < qty) {
        return res.status(400).json({ success: false, message: `Insufficient feed stock. Current stock is ${item.current_stock} bags.` });
      }

      item.current_stock -= qty;
      item.quantity_consumed = (item.quantity_consumed || 0) + qty;

      return res.status(200).json({ success: true, message: `Feed consumption of ${qty} bags logged. Updated stock: ${item.current_stock} bags.`, data: item });
    } else {
      const { data: item } = await supabase.from('feed_inventory').select('current_stock, quantity_consumed').eq('id', feed_id).single();
      if (!item || item.current_stock < qty) {
        return res.status(400).json({ success: false, message: 'Insufficient stock or invalid item.' });
      }

      const { data, error } = await supabase.from('feed_inventory').update({
        current_stock: item.current_stock - qty,
        quantity_consumed: (item.quantity_consumed || 0) + qty
      }).eq('id', feed_id).select().single();

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Feed consumption logged.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFeedItems, createFeedItem, logFeedConsumption };
