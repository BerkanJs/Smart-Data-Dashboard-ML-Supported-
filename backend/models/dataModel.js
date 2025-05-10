const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // ObjectId kullanıyoruz
    ref: 'User', // Referans olarak User modeline bağlıyoruz
    required: true,
  },
  data: Array,
  fileName: { type: String, required: true }
});

module.exports = mongoose.model('Data', DataSchema);