const jwt = require('jsonwebtoken');

const crearToken = (usuario, fraseSecreta) => {
  return jwt.sign(usuario, fraseSecreta);
};

module.exports = {
  crearToken,
};
