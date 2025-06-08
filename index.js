require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const sanitizeRequest = require('./middleware/sanitize');
const morgan = require('morgan');
const logger = require('./middleware/logger'); // Custom logger
const userRoutes = require('./routes/useRoutes');
const userStatsRoutes = require('./routes/user');
const app = express();
const Db = require("./config/db")
require('./jobs/otpProcess');

app.use(morgan('dev'));
// === Security Middlewares ===
app.use(express.json());
Db.connect();

app.use(express.urlencoded({ extended: false }));
app.use(helmet()); // Adds secure headers
app.use(cors({ origin: 'http://localhost:3000' })); // CORS policy
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 requests / 15 mins
app.use(sanitizeRequest);
// Prevent NoSQL injection

// === Parsing Middleware ===

// === Routes ===
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/user', userStatsRoutes);
app.get('/api/test', (req, res) => {
  logger.info('Test endpoint hit');
  res.send('Hello from test endpoint');
});
app.use('/api/v1/otp', require('./routes/otpRoutes'));
app.use('/api/users', userStatsRoutes);


// === Error Handling Middleware ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
