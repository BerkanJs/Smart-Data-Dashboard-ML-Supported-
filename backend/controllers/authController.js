const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');  // sendEmail fonksiyonunu import ettik

// Kullanıcı kayıt işlemi
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json({ message: 'Kullanıcı zaten var.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Kayıt başarılı!' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Kullanıcı giriş işlemi
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Şifre yanlış.' });

    const token = jwt.sign({ 
      userId: user._id,  // Kullanıcı ID'si
      email: user.email  // Kullanıcı email'i
    }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      token,
      user: {
        id: user._id,
        email: user.email,
      
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Şifre sıfırlama talebi
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
    }

    // Şifre sıfırlama token'ı oluştur
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Token'ı veritabanına kaydet
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // Token 1 saat geçerli olacak
    await user.save();

    // E-posta gönderme
    const resetUrl = `http://localhost:5000/resetPassword/${resetToken}`;
    const mailOptions = {
      to: user.email,
      subject: 'Şifre sıfırlama talebi',
      text: `Şifrenizi sıfırlamak için aşağıdaki linke tıklayın: \n\n ${resetUrl}`,
    };

    sendEmail(user.email, mailOptions.subject, mailOptions.text);  // sendEmail fonksiyonunu burada çağırıyoruz

    res.status(200).json({ message: 'E-posta gönderildi.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Bir hata oluştu' });
  }
};

// Şifreyi sıfırlama işlemi
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Token ile kullanıcıyı bul
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Geçersiz veya süresi dolmuş token' });
    }

    // Yeni şifreyi hash'le
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Token'ı ve süresini sıfırla
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.status(200).json({ message: 'Şifre başarıyla sıfırlandı' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Bir hata oluştu' });
  }
};
