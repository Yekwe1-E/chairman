const { isMockMode, mockDb, supabase } = require('../config/supabase');

const getHouses = async (req, res) => {
  try {
    if (isMockMode) {
      return res.status(200).json({ success: true, data: mockDb.poultry_houses });
    } else {
      const { data, error } = await supabase.from('poultry_houses').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createHouse = async (req, res) => {
  try {
    const { house_name, location, capacity, house_type, status, description } = req.body;
    if (!house_name || !location || !capacity || !house_type) {
      return res.status(400).json({ success: false, message: 'House name, location, capacity, and house type are required.' });
    }

    if (isMockMode) {
      const newHouse = {
        id: `h-${Date.now()}`,
        house_name,
        location,
        capacity: Number(capacity),
        current_population: 0,
        house_type,
        status: status || 'active',
        description: description || '',
        created_at: new Date().toISOString()
      };
      mockDb.poultry_houses.push(newHouse);
      return res.status(201).json({ success: true, message: 'Poultry house added successfully.', data: newHouse });
    } else {
      const { data, error } = await supabase.from('poultry_houses').insert([{ house_name, location, capacity, house_type, status, description }]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Poultry house added successfully.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMockMode) {
      const index = mockDb.poultry_houses.findIndex(h => h.id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Poultry house not found.' });
      mockDb.poultry_houses[index] = { ...mockDb.poultry_houses[index], ...updates };
      return res.status(200).json({ success: true, message: 'Poultry house updated successfully.', data: mockDb.poultry_houses[index] });
    } else {
      const { data, error } = await supabase.from('poultry_houses').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Poultry house updated successfully.', data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteHouse = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMockMode) {
      const index = mockDb.poultry_houses.findIndex(h => h.id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Poultry house not found.' });
      mockDb.poultry_houses.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Poultry house deleted successfully.' });
    } else {
      const { error } = await supabase.from('poultry_houses').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Poultry house deleted successfully.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getHouses, createHouse, updateHouse, deleteHouse };
