// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token var mı kontrolü
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Yetkisiz. Token yok." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Kullanıcı bilgileri artık req.user içinde
    next(); // bir sonraki middleware'e geç
  } catch (err) {
    return res.status(401).json({ message: "Geçersiz token." });
  }
};

module.exports = authMiddleware;
