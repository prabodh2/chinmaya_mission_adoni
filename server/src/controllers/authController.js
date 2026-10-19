import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chyk_adoni_anti_drug_marathon_2026_jwt_secret_key_987654321';

const generateToken = (id, role = 'user') => {
  return jwt.sign({ id, role }, JWT_SECRET, {
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
    const { fullName, email, phone, password, confirmPassword, age, profession } = req.body;

    // 1. Validate required fields
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    let cleanEmail = null;
    if (email && typeof email === 'string' && email.trim()) {
      cleanEmail = email.toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address',
          errorCode: 'INVALID_EMAIL',
        });
      }
    }

    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit Indian mobile number (starting with 6-9)',
        errorCode: 'INVALID_PHONE',
      });
    }

    let parsedAge = undefined;
    if (age !== undefined && age !== null && age !== '') {
      parsedAge = parseInt(age, 10);
      if (isNaN(parsedAge) || parsedAge < 5 || parsedAge > 120) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid age between 5 and 120 years',
          errorCode: 'INVALID_AGE',
        });
      }
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
        errorCode: 'WEAK_PASSWORD',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
        errorCode: 'PASSWORD_MISMATCH',
      });
    }

    // 2. Check for duplicate account with normalized phone number
    const existingPhone = await User.findOne({ phone: cleanPhone });
    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: 'An account with this phone number already exists. Please log in instead.',
        errorCode: 'PHONE_ALREADY_REGISTERED',
      });
    }

    // 3. Check for duplicate account with normalized email address
    if (cleanEmail) {
      const existingEmail = await User.findOne({ email: cleanEmail });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists. Please log in instead.',
          errorCode: 'EMAIL_ALREADY_REGISTERED',
        });
      }
    }

    // 4. Create user
    const userDoc = {
      fullName: fullName.trim(),
      phone: cleanPhone,
      password,
      role: 'user',
      profession: (profession || '').trim(),
    };
    if (cleanEmail) {
      userDoc.email = cleanEmail;
    }
    if (parsedAge !== undefined) {
      userDoc.age = parsedAge;
    }

    const newUser = new User(userDoc);
    await newUser.save();

    // 5. Generate JWT Token
    const token = generateToken(newUser._id, newUser.role);
    const userPayload = {
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      age: newUser.age,
      profession: newUser.profession,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Chinmaya Mission, Adoni.',
      token,
      user: userPayload,
      data: {
        ...userPayload,
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

    const token = generateToken(user._id, user.role);

    const userPayload = {
      _id: user._id,
      fullName: user.fullName,
      phone: user.phone,
      age: user.age,
      profession: user.profession,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: userPayload,
      data: {
        ...userPayload,
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

    const token = generateToken(user._id, user.role);

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
 * Verify Session & Get Active User
 * GET /api/auth/verify
 */
export const verifySession = async (req, res) => {
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
      user,
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
    const { fullName, email, phone, age, profession } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (fullName && fullName.trim()) {
      user.fullName = fullName.trim();
    }

    if (email !== undefined && email !== null) {
      const cleanEmail = email.toLowerCase().trim();
      if (cleanEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
          return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address',
            errorCode: 'INVALID_EMAIL',
          });
        }

        const duplicateEmail = await User.findOne({
          email: cleanEmail,
          _id: { $ne: user._id },
        });
        if (duplicateEmail) {
          return res.status(409).json({
            success: false,
            message: 'This email address is already in use by another account.',
            errorCode: 'EMAIL_ALREADY_IN_USE',
          });
        }
        user.email = cleanEmail;
      }
    }

    if (phone !== undefined && phone !== null) {
      const cleanPhone = normalizePhone(phone);
      if (cleanPhone) {
        if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
          return res.status(400).json({
            success: false,
            message: 'Please provide a valid 10-digit Indian mobile number (starting with 6-9)',
            errorCode: 'INVALID_PHONE',
          });
        }

        const duplicatePhone = await User.findOne({
          phone: cleanPhone,
          _id: { $ne: user._id },
        });
        if (duplicatePhone) {
          return res.status(409).json({
            success: false,
            message: 'This phone number is already in use by another account.',
            errorCode: 'PHONE_ALREADY_IN_USE',
          });
        }
        user.phone = cleanPhone;
      }
    }

    if (age !== undefined) {
      const parsedAge = parseInt(age, 10);
      if (!isNaN(parsedAge) && parsedAge >= 5 && parsedAge <= 120) {
        user.age = parsedAge;
      }
    }

    if (profession !== undefined) {
      user.profession = profession.trim();
    }

    await user.save();

    const userPayload = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      age: user.age,
      profession: user.profession,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userPayload,
      data: userPayload,
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
 * POST /api/auth/change-password
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

    if (newPassword === currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password',
        errorCode: 'PASSWORD_SAME_AS_CURRENT',
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
