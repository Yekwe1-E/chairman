const { isMockMode, mockDb, supabase } = require('../config/supabase');

const getMedications = async (req, res) => {
  try {
    if (isMockMode) {
      return res.status(200).json({ success: true, data: mockDb.medications });
    } else {
      const { data, error } = await supabase.from('medications').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createMedication = async (req, res) => {
  try {
    const { name, type, current_stock, unit, minimum_stock, unit_cost, supplier, expiry_date, description } = req.body;
    if (!name || !type || current_stock === undefined || !expiry_date) {
      return res.status(400).json({ success: false, message: 'Name, type, stock, and expiry date are required.' });
    }

    if (isMockMode) {
      const newMed = {
        id: `md-${Date.now()}`,
        name,
        type,
        current_stock: Number(current_stock),
        unit: unit || 'units',
        minimum_stock: Number(minimum_stock) || 5,
        unit_cost: Number(unit_cost) || 0,
        supplier: supplier || 'Vet Supplier',
        expiry_date,
        description: description || ''
      };
      mockDb.medications.push(newMed);
      return res.status(201).json({ success: true, message: 'Medication added successfully.', data: newMed });
    } else {
      const { data, error } = await supabase.from('medications').insert([{ name, type, current_stock, unit, minimum_stock, unit_cost, supplier, expiry_date, description }]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Medication added successfully.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMedications, createMedication };
