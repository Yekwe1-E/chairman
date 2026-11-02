const { isMockMode, mockDb, supabase } = require('../config/supabase');

const getMortality = async (req, res) => {
  try {
    if (isMockMode) {
      const enriched = mockDb.mortality_records.map(m => {
        const flock = mockDb.flocks.find(f => f.id === m.flock_id);
        const initial = flock ? flock.initial_quantity : 1000;
        const rate = ((m.quantity / initial) * 100).toFixed(2);
        return { ...m, mortality_rate_pct: rate };
      });
      return res.status(200).json({ success: true, data: enriched });
    } else {
      const { data, error } = await supabase.from('mortality_records').select('*, flocks(batch_number, initial_quantity)').order('record_date', { ascending: false });
      if (error) throw error;
      const enriched = data.map(m => {
        const initial = m.flocks ? m.flocks.initial_quantity : 1000;
        return {
          ...m,
          batch_number: m.flocks ? m.flocks.batch_number : 'N/A',
          mortality_rate_pct: ((m.quantity / initial) * 100).toFixed(2)
        };
      });
      return res.status(200).json({ success: true, data: enriched });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createMortality = async (req, res) => {
  try {
    const { record_date, flock_id, quantity, cause_of_death, remarks } = req.body;
    if (!flock_id || !quantity || !cause_of_death) {
      return res.status(400).json({ success: false, message: 'Flock, quantity, and cause of death are required.' });
    }

    const qty = Number(quantity);

    if (isMockMode) {
      const flock = mockDb.flocks.find(f => f.id === flock_id);
      if (!flock) return res.status(404).json({ success: false, message: 'Flock not found.' });

      const newRecord = {
        id: `m-${Date.now()}`,
        record_date: record_date || new Date().toISOString().split('T')[0],
        flock_id,
        batch_number: flock.batch_number,
        poultry_house_name: flock.poultry_house_name || 'Pen 1',
        quantity: qty,
        cause_of_death,
        remarks: remarks || '',
        recorded_by_name: req.user ? req.user.full_name : 'Staff'
      };

      mockDb.mortality_records.unshift(newRecord);

      // Deduct quantity from flock & house
      flock.current_quantity = Math.max(0, flock.current_quantity - qty);
      const house = mockDb.poultry_houses.find(h => h.id === flock.poultry_house_id);
      if (house) house.current_population = Math.max(0, house.current_population - qty);

      return res.status(201).json({ success: true, message: 'Mortality record logged successfully. Flock bird count updated.', data: newRecord });
    } else {
      const { data, error } = await supabase.from('mortality_records').insert([{
        record_date: record_date || new Date().toISOString().split('T')[0],
        flock_id,
        quantity: qty,
        cause_of_death,
        remarks,
        recorded_by: req.user ? req.user.id : null
      }]).select().single();

      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Mortality record logged successfully.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMortality, createMortality };
