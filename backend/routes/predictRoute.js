// predictRoute.js

const express = require('express');
const router = express.Router();
const axios = require('axios');

// Prediction endpointi
router.post('/predict', async (req, res) => {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({ message: 'Dosya adı eksik' });
    }

    // Flask server'a dosya adını gönderiyoruz
    const flaskResponse = await axios.post('http://127.0.0.1:5000/predict', {
      fileName: fileName,
    });

    res.status(200).json({
      message: 'Tahmin başarılı!',
      predictions: flaskResponse.data,
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Tahmin sırasında hata oluştu' });
  }
});

module.exports = router;
