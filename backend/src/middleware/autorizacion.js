const jwt = require('jsonwebtoken');
require('dotenv').config();
const autorizarPeticiones = (req, res, next) => {
  const token = req.headers['authorization'];
  const soloToken = token.split(' ')[1];
  if (!token)
    return res.status(401).json({ msg: 'El token no ha sido proveído.' });
  try {
    const datosToken = jwt.verify(soloToken, process.env.SECRET);
    req.usuario = datosToken;
    next();
  } catch (error) {
    res.status(403).json({ msg: 'El token es invalido. Intente nuevamente' });
  }
};
module.exports = {
  autorizarPeticiones,
};
