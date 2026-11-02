const { isMockMode, mockDb, supabase } = require('../config/supabase');

const getEggs = async (req, res) => {
  try {
    if (isMockMode) {
      return res.status(200).json({ success: true, data: mockDb.egg_production });
    } else {
      const { data, error } = await supabase.from('egg_production').select('*, flocks(batch_number)').order('production_date', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createEggRecord = async (req, res) => {
  try {
    const { production_date, flock_id, total_eggs, broken_eggs, damaged_eggs, cracked_eggs, remarks } = req.body;
    if (!flock_id || total_eggs === undefined) {
      return res.status(400).json({ success: false, message: 'Flock selection and total eggs count are required.' });
    }

    const total = Number(total_eggs);
    const broken = Number(broken_eggs) || 0;
    const damaged = Number(damaged_eggs) || 0;
    const cracked = Number(cracked_eggs) || 0;
    const good = Math.max(0, total - (broken + damaged + cracked));
    const marketable = Math.max(0, total - (broken + damaged));

    if (isMockMode) {
      const flock = mockDb.flocks.find(f => f.id === flock_id);

      const newRecord = {
        id: `e-${Date.now()}`,
        production_date: production_date || new Date().toISOString().split('T')[0],
        flock_id,
        batch_number: flock ? flock.batch_number : 'N/A',
        total_eggs: total,
        good_eggs: good,
        broken_eggs: broken,
        damaged_eggs: damaged,
        cracked_eggs: cracked,
        marketable_eggs: marketable,
        remarks: remarks || '',
        recorded_by_name: req.user ? req.user.full_name : 'Staff'
      };

      mockDb.egg_production.unshift(newRecord);
      return res.status(201).json({ success: true, message: 'Egg production record logged successfully.', data: newRecord });
    } else {
      const { data, error } = await supabase.from('egg_production').insert([{
        production_date: production_date || new Date().toISOString().split('T')[0],
        flock_id,
        total_eggs: total,
        good_eggs: good,
        broken_eggs: broken,
        damaged_eggs: damaged,
        cracked_eggs: cracked,
        remarks,
        recorded_by: req.user ? req.user.id : null
      }]).select().single();

      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Egg production record logged successfully.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getEggs, createEggRecord };
