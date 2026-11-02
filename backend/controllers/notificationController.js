const { isMockMode, mockDb, supabase } = require('../config/supabase');

const getNotifications = async (req, res) => {
  try {
    if (isMockMode) {
      return res.status(200).json({ success: true, data: mockDb.notifications });
    } else {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMockMode) {
      const notif = mockDb.notifications.find(n => n.id === id);
      if (notif) notif.is_read = true;
      return res.status(200).json({ success: true, message: 'Notification marked as read.' });
    } else {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Notification marked as read.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getNotifications, markAsRead };
