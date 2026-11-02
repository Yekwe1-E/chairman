const { isMockMode, mockDb, supabase } = require('../config/supabase');

const getVaccinations = async (req, res) => {
  try {
    if (isMockMode) {
      return res.status(200).json({ success: true, data: mockDb.vaccinations });
    } else {
      const { data, error } = await supabase.from('vaccinations').select('*, flocks(batch_number)').order('date_administered', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createVaccination = async (req, res) => {
  try {
    const { vaccine_name, flock_id, date_administered, next_due_date, dosage, administered_by, notes } = req.body;
    if (!vaccine_name || !flock_id || !date_administered) {
      return res.status(400).json({ success: false, message: 'Vaccine name, flock, and administration date are required.' });
    }

    if (isMockMode) {
      const flock = mockDb.flocks.find(f => f.id === flock_id);
      const newVac = {
        id: `v-${Date.now()}`,
        vaccine_name,
        flock_id,
        batch_number: flock ? flock.batch_number : 'N/A',
        date_administered,
        next_due_date: next_due_date || null,
        dosage: dosage || 'Standard Dosage',
        administered_by: administered_by || 'Farm Officer',
        status: next_due_date && new Date(next_due_date) > new Date() ? 'scheduled' : 'completed',
        notes: notes || ''
      };
      mockDb.vaccinations.unshift(newVac);
      return res.status(201).json({ success: true, message: 'Vaccination record saved.', data: newVac });
    } else {
      const { data, error } = await supabase.from('vaccinations').insert([{
        vaccine_name, flock_id, date_administered, next_due_date, dosage, administered_by, notes
      }]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Vaccination record saved.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getVaccinations, createVaccination };
