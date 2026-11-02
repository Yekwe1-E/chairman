const { isMockMode, mockDb, supabase } = require('../config/supabase');

const getEquipment = async (req, res) => {
  try {
    if (isMockMode) {
      return res.status(200).json({ success: true, data: mockDb.equipment });
    } else {
      const { data, error } = await supabase.from('equipment').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createEquipment = async (req, res) => {
  try {
    const { name, category, quantity, purchase_date, purchase_price, condition, location, last_maintenance_date, next_maintenance_date, status, description } = req.body;
    if (!name || !category || !quantity) {
      return res.status(400).json({ success: false, message: 'Equipment name, category, and quantity are required.' });
    }

    if (isMockMode) {
      const newEq = {
        id: `eq-${Date.now()}`,
        name,
        category,
        quantity: Number(quantity),
        purchase_date: purchase_date || new Date().toISOString().split('T')[0],
        purchase_price: Number(purchase_price) || 0,
        condition: condition || 'Good',
        location: location || 'Farm Pen',
        last_maintenance_date: last_maintenance_date || null,
        next_maintenance_date: next_maintenance_date || null,
        status: status || 'Operational',
        description: description || ''
      };
      mockDb.equipment.push(newEq);
      return res.status(201).json({ success: true, message: 'Equipment registered successfully.', data: newEq });
    } else {
      const { data, error } = await supabase.from('equipment').insert([{ name, category, quantity, purchase_date, purchase_price, condition, location, last_maintenance_date, next_maintenance_date, status, description }]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Equipment registered successfully.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getEquipment, createEquipment };
