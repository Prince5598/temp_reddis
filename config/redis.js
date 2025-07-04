// config/redis.js
const redis = require('redis');

const redisClient = redis.createClient({
  url: 'redis://127.0.0.1:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect();
  console.log('✅ Connected to Redis');
})();

module.exports = redisClient;
