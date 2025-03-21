const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra xem có cung cấp username và password không
    if (!username || !password) {
      return res.status(400).json({ message: 'Username và password là bắt buộc' });
    }

    // Tìm user trong database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Trả về token
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra xem có cung cấp username và password không
    if (!username || !password) {
      return res.status(400).json({ message: 'Username và password là bắt buộc' });
    }

    // Kiểm tra xem username đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = new User({
      username,
      password: hashedPassword
    });

    // Lưu user vào database
    await newUser.save();

    // Tạo JWT token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Trả về token
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        username: newUser.username
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
