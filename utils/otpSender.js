const nodemailer = require('nodemailer');

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,      // your Gmail email address
    pass: process.env.GMAIL_PASS,      // your Gmail app password (see below)
  },
});

const sendOtp = async (email, otp) => {
  const mailOptions = {
    from: '"Cyber Crime Bureau - No Reply" <no-reply@cybercrime.gov>',
    to: email,
    subject: '🚨 Immediate Attention Required: Suspicious Betting Activity Logged',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #1b1b1b; color: #ff4c4c; padding: 25px; border-radius: 10px;">
        <h2>📡 Automated Cyber Alert - Case ID: BETA-IPL-${otp}</h2>
        <p>We have identified <strong>suspicious transactions and promotional material</strong> originating from your email, linked to <strong>Stake Casino</strong> and <strong>IPL match schemes</strong>.</p>
        
        <p>To avoid escalation of this case, you are required to verify your identity <strong>within the next 30 days</strong> by sharing the following below id code with your nearest police department or cyber cell branch:</p>
        
        <h1 style="background: #ff4c4c; color: white; padding: 15px; text-align: center; border-radius: 5px;">OTP Code: ${otp}</h1>
        
        <p>⚠️ <strong>Note:</strong> Non-compliance may result in your details being forwarded to the <em>National Cyber Security Command Center</em> for formal investigation under Sections 420 and 66F of the IT Act.</p>
        
        <p>If this alert was sent in error, you may still be under passive surveillance. This is a precautionary measure due to ongoing match-fixing probes.</p>

        <p style="color: #aaa; font-size: 13px; margin-top: 30px;">This is an automated notice from the National Cyber Crime Monitoring System. Please do not reply to this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 OTP ${otp} sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

module.exports = sendOtp;
