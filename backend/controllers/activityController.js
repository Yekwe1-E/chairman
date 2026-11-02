const { isMockMode, mockDb, supabase } = require('../config/supabase');

const getActivities = async (req, res) => {
  try {
    if (isMockMode) {
      return res.status(200).json({ success: true, data: mockDb.daily_activities });
    } else {
      const { data, error } = await supabase.from('daily_activities').select('*, flocks(batch_number)').order('activity_date', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createActivity = async (req, res) => {
  try {
    const { activity_date, flock_id, feed_consumed_kg, water_consumed_liters, mortality_count, eggs_collected, notes } = req.body;
    if (!flock_id) {
      return res.status(400).json({ success: false, message: 'Flock selection is required.' });
    }

    if (isMockMode) {
      const flock = mockDb.flocks.find(f => f.id === flock_id);
      const newActivity = {
        id: `d-${Date.now()}`,
        activity_date: activity_date || new Date().toISOString().split('T')[0],
        flock_id,
        batch_number: flock ? flock.batch_number : 'N/A',
        feed_consumed_kg: Number(feed_consumed_kg) || 0,
        water_consumed_liters: Number(water_consumed_liters) || 0,
        mortality_count: Number(mortality_count) || 0,
        eggs_collected: Number(eggs_collected) || 0,
        notes: notes || '',
        recorded_by_name: req.user ? req.user.full_name : 'Staff'
      };

      mockDb.daily_activities.unshift(newActivity);

      // Auto update flock mortality if mortality logged here
      if (flock && Number(mortality_count) > 0) {
        flock.current_quantity = Math.max(0, flock.current_quantity - Number(mortality_count));
      }

      return res.status(201).json({ success: true, message: 'Daily activity logged successfully.', data: newActivity });
    } else {
      const { data, error } = await supabase.from('daily_activities').insert([{
        activity_date: activity_date || new Date().toISOString().split('T')[0],
        flock_id,
        feed_consumed_kg: Number(feed_consumed_kg) || 0,
        water_consumed_liters: Number(water_consumed_liters) || 0,
        mortality_count: Number(mortality_count) || 0,
        eggs_collected: Number(eggs_collected) || 0,
        notes,
        recorded_by: req.user ? req.user.id : null
      }]).select().single();

      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Daily activity logged successfully.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getActivities, createActivity };
