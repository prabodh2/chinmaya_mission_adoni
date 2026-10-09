export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, please log in as an administrator to continue.',
      errorCode: 'AUTH_REQUIRED',
    });
  }

  const role = (req.user.role || '').toLowerCase();
  if (role === 'admin' || role === 'super_admin') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied: Administrator permissions are required.',
    errorCode: 'ADMIN_REQUIRED',
  });
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, please log in to continue.',
      errorCode: 'AUTH_REQUIRED',
    });
  }

  const userRole = (req.user.role || '').toLowerCase();
  const normalized = roles.map((r) => r.toLowerCase());
  if (normalized.includes(userRole) || userRole === 'admin' || userRole === 'super_admin') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied: Insufficient permissions for this resource.',
    errorCode: 'FORBIDDEN',
  });
};
