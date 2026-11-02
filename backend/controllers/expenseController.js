const { isMockMode, mockDb, supabase } = require('../config/supabase');

const getExpenses = async (req, res) => {
  try {
    if (isMockMode) {
      return res.status(200).json({ success: true, data: mockDb.expenses });
    } else {
      const { data, error } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const { expense_date, category, description, amount, payment_method, receipt_number, supplier_name } = req.body;
    if (!category || !description || !amount) {
      return res.status(400).json({ success: false, message: 'Expense category, description, and amount are required.' });
    }

    const amt = Number(amount);

    if (isMockMode) {
      const newExp = {
        id: `ex-${Date.now()}`,
        expense_date: expense_date || new Date().toISOString().split('T')[0],
        category,
        description,
        amount: amt,
        payment_method: payment_method || 'Bank Transfer',
        receipt_number: receipt_number || `REC-${Math.floor(1000 + Math.random() * 9000)}`,
        supplier_name: supplier_name || 'N/A',
        recorded_by_name: req.user ? req.user.full_name : 'Finance Officer'
      };
      mockDb.expenses.unshift(newExp);
      return res.status(201).json({ success: true, message: 'Expense recorded successfully.', data: newExp });
    } else {
      const { data, error } = await supabase.from('expenses').insert([{
        expense_date: expense_date || new Date().toISOString().split('T')[0],
        category, description, amount: amt, payment_method, receipt_number,
        recorded_by: req.user ? req.user.id : null
      }]).select().single();

      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Expense recorded successfully.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getExpenses, createExpense };
