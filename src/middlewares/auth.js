const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Lấy token từ header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Không có token xác thực' });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Thêm thông tin user vào request
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};