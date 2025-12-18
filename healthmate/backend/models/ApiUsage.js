const mongoose = require('mongoose');

const apiUsageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date().toISOString().split('T')[0] // YYYY-MM-DD
  },
  count: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Compound index for user and date
apiUsageSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('ApiUsage', apiUsageSchema);