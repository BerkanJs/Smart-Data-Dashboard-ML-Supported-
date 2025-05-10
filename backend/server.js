const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');  // uploads klasörü yoksa oluşturulacak
}
// Veri yükleme işlemi için route
const dataRoutes = require('./routes/dataRoutes');  
app.use('/api/data', dataRoutes);  // dataRoutes'u '/api/data' yolunda kullan
// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);  // authRoutes'u '/api/auth' yolunda kullan

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);  // userRoutes'u '/api/user' yolunda kullan

// Logout route
app.post('/logout', (req, res) => {
  res.send({ message: 'Çıkış başarılı.' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`));
