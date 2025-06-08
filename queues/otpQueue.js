const Queue = require('bull');

const otpQueue = new Queue('otpQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

module.exports = otpQueue;
