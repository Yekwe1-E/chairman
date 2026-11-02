const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isMockMode, mockDb, supabase } = require('../config/supabase');

const register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide full name, email, and password.' });
    }

    const assignedRole = role || 'worker';
    const password_hash = await bcrypt.hash(password, 10);

    if (isMockMode) {
      const existing = mockDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(409).json({ success: false, message: 'User with this email address already exists.' });
      }

      const newUser = {
        id: `u-${Date.now()}`,
        full_name,
        email,
        password_hash,
        phone: phone || '',
        role: assignedRole,
        status: 'active',
        created_at: new Date().toISOString()
      };

      mockDb.users.push(newUser);

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role, full_name: newUser.full_name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'User account registered successfully.',
        token,
        user: { id: newUser.id, full_name: newUser.full_name, email: newUser.email, role: newUser.role, phone: newUser.phone }
      });
    } else {
      const { data: existing } = await supabase.from('users').select('id').eq('email', email).single();
      if (existing) {
        return res.status(409).json({ success: false, message: 'User with this email address already exists.' });
      }

      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{ full_name, email, password_hash, phone, role: assignedRole, status: 'active' }])
        .select()
        .single();

      if (error) throw error;

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: assignedRole, full_name: newUser.full_name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'User account registered successfully.',
        token,
        user: { id: newUser.id, full_name: newUser.full_name, email: newUser.email, role: assignedRole }
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    let user = null;

    if (isMockMode) {
      user = mockDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    } else {
      const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
      if (!error && data) user = data;
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    if (user.status && user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Account is disabled or suspended. Contact administrator.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role || 'admin', full_name: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role || 'admin',
        phone: user.phone || ''
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    if (isMockMode) {
      const sanitized = mockDb.users.map(({ password_hash, ...u }) => u);
      return res.status(200).json({ success: true, data: sanitized });
    } else {
      const { data, error } = await supabase.from('users').select('id, full_name, email, phone, role, status, created_at');
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe, getAllUsers };
