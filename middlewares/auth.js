const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY='SUPER_SECRET_KEY';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    return res
      .status(403)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};