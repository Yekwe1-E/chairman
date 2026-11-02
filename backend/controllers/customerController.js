const { isMockMode, mockDb, supabase } = require('../config/supabase');

const getCustomers = async (req, res) => {
  try {
    if (isMockMode) {
      return res.status(200).json({ success: true, data: mockDb.customers });
    } else {
      const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, address, customer_type, notes } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Customer name and phone number are required.' });
    }

    if (isMockMode) {
      const newCust = {
        id: `c-${Date.now()}`,
        name,
        phone,
        email: email || '',
        address: address || '',
        customer_type: customer_type || 'Wholesale',
        total_purchases: 0,
        outstanding_balance: 0,
        notes: notes || ''
      };
      mockDb.customers.push(newCust);
      return res.status(201).json({ success: true, message: 'Customer profile registered.', data: newCust });
    } else {
      const { data, error } = await supabase.from('customers').insert([{ name, phone, email, address, customer_type, notes }]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Customer profile registered.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCustomers, createCustomer };
