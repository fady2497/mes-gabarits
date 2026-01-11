const express = require('express');
const router = express.Router();

// Route GET pour récupérer tous les gabarits
router.get('/', async (req, res) => {
  try {
    const templates = [
      {
        id: 1,
        name: 'Gabarit Modern',
        price: 29.99,
        category: 'E-commerce',
        preview: '/images/template1.jpg'
      },
      {
        id: 2,
        name: 'Gabarit Business',
        price: 39.99,
        category: 'Corporate',
        preview: '/images/template2.jpg'
      }
    ];
    
    res.json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
