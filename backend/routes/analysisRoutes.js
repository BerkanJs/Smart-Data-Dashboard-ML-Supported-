const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

// Segmentasyon analizi
router.get('/segment', analysisController.segmentAnalysis);

// Anomali tespiti
router.get('/anomaly', analysisController.anomalyDetection);

module.exports = router;
