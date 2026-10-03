import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'chyk_adoni_anti_drug_marathon_2026_jwt_secret_key_987654321', {
    expiresIn: process.env.JWT_EXPIRES_IN || '365d',
  });
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Admin email and password required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized admin credentials',
        errorCode: 'UNAUTHORIZED_ADMIN',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
        errorCode: 'INVALID_CREDENTIALS',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Admin authentication successful',
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Admin login server error',
      errorCode: 'SERVER_ERROR',
    });
  }
};

export const getProfile = async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
};

export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current and new password required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
        errorCode: 'INVALID_CURRENT_PASSWORD',
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Admin password updated successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Password update error',
      errorCode: 'SERVER_ERROR',
    });
  }
};
