import { AgeVerificationLog } from '../models/index.js';

export const requireAgeVerification = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!req.user.ageVerified) {
      return res.status(403).json({
        success: false,
        error: 'Age verification required. You must be 18 or older to access this resource.',
      });
    }

    if (!req.user.isLegalAge()) {
      return res.status(403).json({
        success: false,
        error: 'You must be at least 18 years old to access this resource.',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const logAgeVerification = async (userId, orderId = null, verified, req) => {
  try {
    await AgeVerificationLog.create({
      userId,
      orderId,
      verificationMethod: 'dob_check',
      verified,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
    });
  } catch (error) {
    console.error('Error logging age verification:', error);
  }
};
