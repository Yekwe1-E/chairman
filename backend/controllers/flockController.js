const { isMockMode, mockDb, supabase } = require('../config/supabase');

const calculateFlockAgeInWeeks = (datePlaced) => {
  if (!datePlaced) return 0;
  const placed = new Date(datePlaced);
  const now = new Date();
  const diffTime = Math.abs(now - placed);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
};

const getFlocks = async (req, res) => {
  try {
    if (isMockMode) {
      const enriched = mockDb.flocks.map(f => ({
        ...f,
        age_weeks: calculateFlockAgeInWeeks(f.date_placed)
      }));
      return res.status(200).json({ success: true, data: enriched });
    } else {
      const { data, error } = await supabase.from('flocks').select('*, poultry_houses(house_name)').order('created_at', { ascending: false });
      if (error) throw error;
      const enriched = data.map(f => ({
        ...f,
        poultry_house_name: f.poultry_houses ? f.poultry_houses.house_name : 'Unassigned',
        age_weeks: calculateFlockAgeInWeeks(f.date_placed)
      }));
      return res.status(200).json({ success: true, data: enriched });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createFlock = async (req, res) => {
  try {
    const { batch_number, breed, bird_type, initial_quantity, male_quantity, female_quantity, date_acquired, date_placed, poultry_house_id, supplier_name, cost_per_bird, notes } = req.body;

    if (!batch_number || !bird_type || !initial_quantity || !date_placed) {
      return res.status(400).json({ success: false, message: 'Batch number, bird type, initial quantity, and date placed are required.' });
    }

    const initQty = Number(initial_quantity);
    const cost = Number(cost_per_bird) || 0;
    const totalCost = initQty * cost;

    if (isMockMode) {
      const house = mockDb.poultry_houses.find(h => h.id === poultry_house_id);
      const newFlock = {
        id: `f-${Date.now()}`,
        batch_number,
        breed: breed || 'Standard Breed',
        bird_type,
        initial_quantity: initQty,
        current_quantity: initQty,
        male_quantity: Number(male_quantity) || 0,
        female_quantity: Number(female_quantity) || initQty,
        date_acquired: date_acquired || date_placed,
        date_placed,
        poultry_house_id,
        poultry_house_name: house ? house.house_name : 'Unassigned',
        supplier_name: supplier_name || 'Standard Hatchery',
        cost_per_bird: cost,
        total_acquisition_cost: totalCost,
        status: 'active',
        notes: notes || '',
        created_at: new Date().toISOString()
      };

      mockDb.flocks.push(newFlock);

      if (house) {
        house.current_population = (house.current_population || 0) + initQty;
      }

      return res.status(201).json({ success: true, message: 'Flock record added successfully.', data: newFlock });
    } else {
      const { data, error } = await supabase.from('flocks').insert([{
        batch_number,
        bird_type,
        initial_quantity: initQty,
        current_quantity: initQty,
        male_quantity: Number(male_quantity) || 0,
        female_quantity: Number(female_quantity) || initQty,
        date_acquired: date_acquired || date_placed,
        date_placed,
        poultry_house_id,
        supplier_name,
        cost_per_bird: cost,
        total_acquisition_cost: totalCost,
        status: 'active',
        notes
      }]).select().single();

      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Flock record added successfully.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateFlock = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMockMode) {
      const index = mockDb.flocks.findIndex(f => f.id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Flock not found.' });
      mockDb.flocks[index] = { ...mockDb.flocks[index], ...updates };
      return res.status(200).json({ success: true, message: 'Flock updated successfully.', data: mockDb.flocks[index] });
    } else {
      const { data, error } = await supabase.from('flocks').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Flock updated successfully.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFlock = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMockMode) {
      const index = mockDb.flocks.findIndex(f => f.id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Flock not found.' });
      mockDb.flocks.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Flock deleted successfully.' });
    } else {
      const { error } = await supabase.from('flocks').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Flock deleted successfully.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFlocks, createFlock, updateFlock, deleteFlock };
