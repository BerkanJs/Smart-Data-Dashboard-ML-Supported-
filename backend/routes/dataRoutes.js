const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Veri yükleme endpoint'i
router.post('/upload', dataController.uploadData);
router.get('/get/:userId', dataController.getData); 

router.delete("/delete/:userId", dataController.deleteUserData);
module.exports = router;