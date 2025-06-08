const logger = require('../middleware/logger');
const User = require('../models/User');
const redisClient = require('../config/redis');


async function invalidateUserSearchCache() {
  const keys = await redisClient.keys('userSearch:*');
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
}


exports.registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = new User({ name, email });
    await user.save();

    // Invalidate cached search results after create
    await invalidateUserSearchCache();

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }

};

exports.updateUser = async (req,res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Invalidate cache after update
    await invalidateUserSearchCache();

    res.status(200).json({ message: 'User updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.DeleteUser = async(req,res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Invalidate cache after delete
    await invalidateUserSearchCache();

    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}


exports.getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          totalUsers: { $sum: 1 }
        }
      },
      {
        $sort: { totalUsers: -1 }
      }
    ]);
    logger.info('Aggregation result: %o', stats);
    res.json(stats);
  } catch (error) {
    logger.error('Aggregation failed: %o', error);
    res.status(500).json({ message: 'Aggregation Error' });
  }
};
