const multer = require('multer');
const path = require('path');
const csvtojson = require('csvtojson');
const Data = require('../models/dataModel');
const User = require('../models/User');  
const fs = require('fs');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv') {
      return cb(new Error('Sadece CSV dosyaları kabul edilir'), false);
    }
    cb(null, true);
  }
}).single('csvFile'); 

exports.uploadData = async (req, res) => {
  try {
    console.log("Yükleme işlemi başlatıldı");

    // Multer işlemini bekle
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          console.log("Multer hata:", err); 
          reject(err);
        }
        resolve();
      });
    });

    // email parametresini req.body'den alıyoruz
    let { email } = req.body; 
    console.log("Gelen email:", email); // Gelen email'i logladık

    // Eğer email veya dosya eksikse, hata döndürülüyor
    if (!email || !req.file) {
      console.log("Eksik veri veya dosya");
      return res.status(400).json({ message: "Eksik veri veya dosya" });
    }

    // Kullanıcıyı email ile buluyoruz
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Kullanıcı bulunamadı");
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // userId'yi veritabanından alınan kullanıcıdan alıyoruz
    const userId = user._id;

    // Veritabanındaki eski veriyi siliyoruz
    await Data.deleteOne({ userId });

    const jsonData = await csvtojson().fromFile(req.file.path);

    // Yeni veriyi kaydediyoruz
    const newData = new Data({
      userId,
      data: jsonData,
      fileName: req.file.filename
    });

    await newData.save();

    res.status(200).json({
      message: "Veri başarıyla yüklendi!",
      fileName: req.file.filename
    });
  } catch (err) {
    console.error("Veri yükleme hatası:", err);
    res.status(500).json({ message: err.message || "Bir hata oluştu" });
  }
};




exports.getData = async (req, res) => {
  try {
    const { userId } = req.params; 

    if (!userId) {
      return res.status(400).json({ message: 'userId parametresi eksik' });
    }

    const allData = await Data.find({ userId: userId });

    if (allData.length === 0) {
      return res.status(404).json({ message: 'Veri bulunamadı' });
    }

    const allJsonData = allData.flatMap(item => item.data);
    res.status(200).json(allJsonData);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Veri çekme hatası' });
  }
};



exports.deleteUserData = async (req, res) => {
  const { userId } = req.params;

  try {
    console.log("Silinecek dosyanın sahibi olan kullanıcının ID'si:", userId); 

    // 1. Kullanıcıyı bul
    const user = await User.findById(userId);
    if (!user) {
      console.log("Kullanıcı bulunamadı.");
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    // 2. Kullanıcıya ait verileri bul
    const userRecords = await Data.find({ userId });

    if (userRecords.length === 0) {
      console.log("Kullanıcıya ait veriler bulunamadı.");
      return res.status(404).json({ message: "Kullanıcı verisi bulunamadı." });
    }

    // 3. Dosya silme işlemi
    for (const record of userRecords) {
      if (record.fileName) {
        const filePath = path.join(__dirname, "../uploads", record.fileName);
        if (fs.existsSync(filePath)) {
          console.log(`Dosya siliniyor: ${filePath}`);
          fs.unlinkSync(filePath);
        }
      }
    }

    // 4. Veritabanından silme
    await Data.deleteMany({ userId });

    res.status(200).json({ message: "Kullanıcının verileri ve dosyaları başarıyla silindi." });
  } catch (error) {
    console.error("Veri silme hatası:", error);
    res.status(500).json({ message: "Veri veya dosya silinirken hata oluştu." });
  }
};