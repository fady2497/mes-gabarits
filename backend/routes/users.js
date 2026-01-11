// backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users → liste tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt']
    });

    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Erreur GET /api/users :', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
