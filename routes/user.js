const express = require('express');
const router = express.Router();
const { getUserStats } = require('../controllers/userController');
const User = require('../models/User');
const redisClient = require('../config/redis');

router.get('/stats', getUserStats);

router.get('/search', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: 'Missing search query' });
  }

  const cacheKey = `userSearch:${name.toLowerCase()}`;

  try {
    // 1. Check Redis cache
    const cachedResults = await redisClient.get(cacheKey);
    if (cachedResults) {
      return res.status(200).json({ source: 'cache', data: JSON.parse(cachedResults) });
    }

    // 2. If no cache, query MongoDB
    const users = await User.findOne({ name: { $regex: name, $options: 'i' } });
    if(!users){
        return res.status(401).json({message : "No user Found"});
    }
    // 3. Cache the result for 60 seconds
    await redisClient.setEx(cacheKey, 60, JSON.stringify(users));

    // 4. Send response
    res.status(200).json({ source: 'db', data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
