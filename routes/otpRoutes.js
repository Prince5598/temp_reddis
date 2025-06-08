const express = require('express');
const router = express.Router();
const otpQueue = require('../queues/otpQueue');
const redis = require('../config/redis'); // Assuming you have a Redis client configured

router.post('/send-otp', async (req, res) => {
  
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
  const { email } = req.body;
    if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  console.log(ip);
  const otpSendKey = `otp:send:ip:${ip}`;
  const sendCount = await redis.incr(otpSendKey);

  if (sendCount === 1) {
    await redis.expire(otpSendKey, 60 * 60 * 24);
  }

  if (sendCount > 6) {
    return res.status(429).json({ message: 'Too many OTP requests from this IP. Try again tomorrow.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(`otp:${email}`, otp, 300);
  await redis.del(`otp:fail:${email}`);
  await otpQueue.add({ email, otp });

  res.status(200).json({ message: 'OTP sent successfully' });
});


router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = await redis.get(`otp:${email}`);
  console.log(storedOtp, otp);
  if (!storedOtp) {
    return res.status(400).json({ message: 'OTP expired or not found' });
  }

  if (storedOtp !== otp) {
    const attemptKey = `otp:fail:${email}`;
    const attempts = await redis.incr(attemptKey);

    if (attempts === 1) {
      await redis.expire(attemptKey, 60 * 60 * 24); // 1 day limit
    }

    if (attempts >= 3) {
      
      return res.status(403).json({ message: 'Too many incorrect attempts. resend otp.' });
    }

    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // Success: clear OTP and attempt count
  await redis.del(`otp:${email}`);
  await redis.del(`otp:fail:${email}`);
  await redis.del(`otp:send:ip:${req.headers['x-forwarded-for']?.split(',')[0] || req.ip}`);
  res.status(200).json({ message: 'OTP verified successfully' });
});

module.exports = router;
