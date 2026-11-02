const { isMockMode, mockDb, supabase } = require('../config/supabase');

const getSales = async (req, res) => {
  try {
    if (isMockMode) {
      return res.status(200).json({ success: true, data: mockDb.sales });
    } else {
      const { data, error } = await supabase.from('sales').select('*, customers(name)').order('sale_date', { ascending: false });
      if (error) throw error;
      const formatted = data.map(s => ({
        ...s,
        customer_name: s.customers ? s.customers.name : 'Walk-in Customer'
      }));
      return res.status(200).json({ success: true, data: formatted });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createSale = async (req, res) => {
  try {
    const { sale_date, customer_id, sale_type, flock_id, quantity, unit_price, payment_status, payment_method, notes } = req.body;
    if (!sale_type || !quantity || !unit_price) {
      return res.status(400).json({ success: false, message: 'Sale type, quantity, and unit price are required.' });
    }

    const qty = Number(quantity);
    const price = Number(unit_price);
    const total = qty * price;
    const invNo = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    if (isMockMode) {
      const customer = mockDb.customers.find(c => c.id === customer_id);
      const flock = mockDb.flocks.find(f => f.id === flock_id);

      const newSale = {
        id: `sl-${Date.now()}`,
        invoice_number: invNo,
        sale_date: sale_date || new Date().toISOString().split('T')[0],
        customer_id: customer_id || null,
        customer_name: customer ? customer.name : 'Walk-in Customer',
        sale_type,
        flock_id: flock_id || null,
        batch_number: flock ? flock.batch_number : 'N/A',
        quantity: qty,
        unit_price: price,
        total_amount: total,
        payment_status: payment_status || 'Paid',
        payment_method: payment_method || 'Bank Transfer',
        recorded_by_name: req.user ? req.user.full_name : 'Finance Officer',
        notes: notes || ''
      };

      mockDb.sales.unshift(newSale);

      // If birds sold, deduct from flock count
      if (sale_type === 'Birds' && flock) {
        flock.current_quantity = Math.max(0, flock.current_quantity - qty);
        const house = mockDb.poultry_houses.find(h => h.id === flock.poultry_house_id);
        if (house) house.current_population = Math.max(0, house.current_population - qty);
      }

      // If customer had pending balance
      if (customer) {
        customer.total_purchases = (customer.total_purchases || 0) + total;
        if (payment_status === 'Pending') {
          customer.outstanding_balance = (customer.outstanding_balance || 0) + total;
        }
      }

      return res.status(201).json({ success: true, message: 'Sale transaction recorded successfully.', data: newSale });
    } else {
      const { data, error } = await supabase.from('sales').insert([{
        invoice_number: invNo,
        sale_date: sale_date || new Date().toISOString().split('T')[0],
        customer_id, sale_type, flock_id, quantity: qty, unit_price: price, total_amount: total,
        payment_status: payment_status || 'Paid', payment_method, recorded_by: req.user ? req.user.id : null, notes
      }]).select().single();

      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Sale transaction recorded successfully.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSales, createSale };
