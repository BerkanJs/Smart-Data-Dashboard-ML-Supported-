const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },    // Şifre sıfırlama token'ı
  resetPasswordExpire: { type: Date },     // Token'ın süresi
});

const User = mongoose.model('User', userSchema);

module.exports = User;
