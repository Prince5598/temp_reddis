const otpQueue = require('../queues/otpQueue');
const sendOtp = require('../utils/otpSender');

otpQueue.process(async (job) => {
  const { email, otp } = job.data;
  await sendOtp(email, otp);
});
