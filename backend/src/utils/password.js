const bcrypt = require('bcrypt');

const hasClave = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};
const compararClave = async (password, hash) => {
  const result = await bcrypt.compare(password, hash);
  return result;
};
module.exports = {
  hasClave,
  compararClave,
};
