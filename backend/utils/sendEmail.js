const nodemailer = require('nodemailer');

// Nodemailer transporter oluşturma
const transporter = nodemailer.createTransport({
  service: 'gmail',  // veya 'sendgrid', 'mailgun', vb.
  auth: {
    user: process.env.EMAIL_USER,  // E-posta adresi
    pass: process.env.EMAIL_PASS   // E-posta şifresi
  }
});

// E-posta gönderme fonksiyonu
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,   // Gönderen adres
    to: to,                         // Alıcı adres
    subject: subject,               // Konu
    text: text                       // İçerik
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('E-posta gönderilemedi!', error);
    } else {
      console.log('E-posta gönderildi:', info.response);
    }
  });
};

module.exports = sendEmail;
