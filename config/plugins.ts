// config/plugins.js
const Crypto = require('crypto');

module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET') || 'defaultJWTSecretForDevelopment123',
      jwt: {
        expiresIn: '30d',
      },
    },
  },
  upload: {
    config: {
      // Upload configuration if needed
    },
  },
});
