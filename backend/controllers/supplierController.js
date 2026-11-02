const { isMockMode, mockDb, supabase } = require('../config/supabase');

const getSuppliers = async (req, res) => {
  try {
    if (isMockMode) {
      return res.status(200).json({ success: true, data: mockDb.suppliers });
    } else {
      const { data, error } = await supabase.from('suppliers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const { company_name, contact_person, phone, email, address, products_supplied } = req.body;
    if (!company_name || !phone) {
      return res.status(400).json({ success: false, message: 'Company name and phone number are required.' });
    }

    if (isMockMode) {
      const newSup = {
        id: `s-${Date.now()}`,
        company_name,
        contact_person: contact_person || '',
        phone,
        email: email || '',
        address: address || '',
        products_supplied: products_supplied || 'Farm Inputs',
        total_purchases: 0
      };
      mockDb.suppliers.push(newSup);
      return res.status(201).json({ success: true, message: 'Supplier profile created.', data: newSup });
    } else {
      const { data, error } = await supabase.from('suppliers').insert([{ company_name, contact_person, phone, email, address, products_supplied }]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Supplier profile created.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSuppliers, createSupplier };
