const jwt = require('jsonwebtoken');
const config = require('../config/index');

const authentication = (req, res, next) => {
  const tokenName = req.headers.referer.includes('localhost:9999') ? 'admin_access_token' : 'user_access_token';
  const token = req.cookies[tokenName];

  if (token) {
    try {
      const decodedToken = jwt.verify(token, config.jwt.secret_key);

      // Kiểm tra thời gian hết hạn của token
      const currentTimestamp = Math.floor(Date.now() / 1000); // Thời gian hiện tại (đơn vị giây)
      if (decodedToken.exp > currentTimestamp) {
        req.user = decodedToken;
        next();
      } else {
        res.status(401).json({ error: 'Token đã hết hạn' });
      }
    } catch (error) {
      res.status(401).json({ error: 'Token không hợp lệ' });
    }
  } else {
    res.status(401).json({ error: 'Không có token' });
  }
};

module.exports = authentication;