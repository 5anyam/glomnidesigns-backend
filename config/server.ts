// config/server.js
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS') || [
      'myapp-key-1',
      'myapp-key-2',
      'myapp-key-3',
      'myapp-key-4'
    ],
  },
});
