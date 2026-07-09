const express = require('express');
const router = express.Router();

router.post('/predict', async (req, res) => {
  try {
    // Using 127.0.0.1 instead of localhost to prevent IPv6 resolution issues in Node 18+
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
    
    const response = await fetch(`${aiServiceUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ message: 'AI Service Error', error: errorData });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error proxying to AI service:', error);
    res.status(500).json({ message: 'Failed to communicate with AI Service', error: error.message });
  }
});

module.exports = router;
