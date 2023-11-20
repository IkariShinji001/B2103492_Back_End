const jwt = require('jsonwebtoken');
const config = require('../config/index');
const authentication = (req, res, next) => {
  const tokenName = req.headers.referer.includes('localhost:9999') ? 'admin_access_token' : 'user_access_token';
  const token = req.cookies[tokenName];
  if (token) {
    try {
      const decodedToken = jwt.verify(token, config.jwt.secret_key);
      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token không hợp lệ' });
    }
  } else {
    res.status(401).json({ error: 'Không có token' });
  }
};

module.exports = authentication;

