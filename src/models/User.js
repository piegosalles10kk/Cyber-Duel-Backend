const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },  
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'vendor', 'enterprise', 'community'], default: 'community' },
  organization: String,
  permissions: { canCreateEDRs: { type: Boolean, default: false }, canRunTests: { type: Boolean, default: true }, maxConcurrentSessions: { type: Number, default: 1 } },
  subscription: { tier: { type: String, enum: ['free', 'starter', 'professional', 'enterprise'], default: 'free' }, validUntil: Date, monthlyTestLimit: Number, testsUsedThisMonth: { type: Number, default: 0 } },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: Date
}, { timestamps: true });

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);