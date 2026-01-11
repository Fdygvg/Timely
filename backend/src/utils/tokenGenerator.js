const crypto = require('crypto');

const generateSecureToken = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
};

module.exports = { generateSecureToken };