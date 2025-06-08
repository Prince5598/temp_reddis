const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true // Creates index on name
  },
  email: {
    type: String,
    required: true,
    unique: true // Also creates a unique index
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Indexed to sort/filter by creation date
  }
});

// Compound index for faster dashboard-type queries
userSchema.index({ role: 1, createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
