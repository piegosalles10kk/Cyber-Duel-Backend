const mongoose = require('mongoose');

const edrSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  vendor: { type: String, required: true, trim: true },
  platform: { type: String, enum: ['Windows', 'Linux', 'MacOS', 'Multi-Platform'], required: true },
  status: { type: String, enum: ['draft', 'active', 'deprecated'], default: 'draft' },
  description: { type: String, maxlength: 1000 },
  logoUrl: String,
  website: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

edrSchema.index({ name: 1, vendor: 1 });
edrSchema.index({ status: 1 });

module.exports = mongoose.model('EDR', edrSchema);