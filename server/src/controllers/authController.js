import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chyk_adoni_anti_drug_marathon_2026_jwt_secret_key_987654321';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '365d',
  });
};

/**
 * Clean & normalize phone number to standard 10-digit format (or normalized string)
 */
const normalizePhone = (rawPhone) => {
  if (!rawPhone) return '';
  let digits = rawPhone.toString().replace(/\D/g, '');
  // If phone starts with 91 and has 12 digits, strip country code
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.substring(2);
  }
  return digits;
};

/**
 * Public User Signup
 * POST /api/auth/signup
 */
export const signupUser = async (req, res) => {
  try {
    const { fullName, age, profession, phone, password, confirmPassword } = req.body;

    // 1. Validate required fields
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit Indian mobile number (starting with 6-9)',
        errorCode: 'INVALID_PHONE',
      });
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 5 || parsedAge > 120) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid age between 5 and 120 years',
        errorCode: 'INVALID_AGE',
      });
    }

    if (!profession || !profession.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Profession / Occupation is required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
        errorCode: 'WEAK_PASSWORD',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
        errorCode: 'PASSWORD_MISMATCH',
      });
    }

    // 2. Check for duplicate account with normalized phone number
    const existingUser = await User.findOne({ phone: cleanPhone });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this phone number already exists. Please log in instead.',
        errorCode: 'PHONE_ALREADY_REGISTERED',
      });
    }

    // 3. Create user
    const newUser = new User({
      fullName: fullName.trim(),
      phone: cleanPhone,
      age: parsedAge,
      profession: profession.trim(),
      password,
      role: 'user',
    });

    await newUser.save();

    // 4. Generate JWT Token
    const token = generateToken(newUser._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Chinmaya Mission Adoni.',
      data: {
        _id: newUser._id,
        fullName: newUser.fullName,
        phone: newUser.phone,
        age: newUser.age,
        profession: newUser.profession,
        role: newUser.role,
        createdAt: newUser.createdAt,
        token,
      },
    });
  } catch (err) {
    console.error('[Signup Error]:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to create account. Please try again.',
      errorCode: 'SIGNUP_ERROR',
    });
  }
};

/**
 * Centralized User & Admin Login
 * POST /api/auth/login
 */
export const loginUser = async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    let user = null;

    // Support phone-based authentication as primary
    if (phone) {
      const cleanPhone = normalizePhone(phone);
      user = await User.findOne({ phone: cleanPhone });
    } else if (email) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Phone number or email is required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your phone number and password.',
        errorCode: 'INVALID_CREDENTIALS',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your phone number and password.',
        errorCode: 'INVALID_CREDENTIALS',
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        _id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        age: user.age,
        profession: user.profession,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        token,
      },
    });
  } catch (err) {
    console.error('[Login Error]:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Authentication server error',
      errorCode: 'SERVER_ERROR',
    });
  }
};

/**
 * Dedicated Admin Login (preserved for backward compatibility)
 * POST /api/auth/admin/login
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Admin identifier and password required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    let user = null;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    } else if (phone) {
      const cleanPhone = normalizePhone(phone);
      user = await User.findOne({ phone: cleanPhone });
    }

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
        phone: user.phone,
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

/**
 * Get Authenticated User Profile
 * GET /api/auth/me or GET /api/auth/profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update Profile Details (Full Name, Age, Profession)
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { fullName, age, profession, email } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (fullName && fullName.trim()) user.fullName = fullName.trim();
    if (age) {
      const parsedAge = parseInt(age, 10);
      if (!isNaN(parsedAge) && parsedAge >= 5 && parsedAge <= 120) {
        user.age = parsedAge;
      }
    }
    if (profession !== undefined) user.profession = profession.trim();
    if (email !== undefined) {
      user.email = email ? email.toLowerCase().trim() : null;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        age: user.age,
        profession: user.profession,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update profile',
    });
  }
};

/**
 * Change Password
 * PUT /api/auth/change-password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
        errorCode: 'WEAK_PASSWORD',
      });
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match',
        errorCode: 'PASSWORD_MISMATCH',
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
      message: 'Password changed successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Password update error',
      errorCode: 'SERVER_ERROR',
    });
  }
};

// Aliases for admin password change
export const changeAdminPassword = changePassword;
