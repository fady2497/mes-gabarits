const { verifyToken } = require('../utils/jwt');

module.exports = function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    const payload = token ? verifyToken(token) : null;
    if (!payload || !payload.uid) {
      return res.status(401).json({ success: false, ok: false, error: 'unauthorized' });
    }
    req.userId = payload.uid;
    next();
  } catch (e) {
    return res.status(401).json({ success: false, ok: false, error: 'unauthorized' });
  }
};

