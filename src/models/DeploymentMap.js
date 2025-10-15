const mongoose = require('mongoose');

const deploymentMapSchema = new mongoose.Schema({
  edrId: { type: mongoose.Schema.Types.ObjectId, ref: 'EDR', required: true },
  terraformTemplate: { type: String, required: true },
  installCommand: { type: String, required: true },
  activationCommand: { type: String, required: true },
  requiredVariables: [{
    name: { type: String, required: true },
    description: String,
    type: { type: String, enum: ['string', 'number', 'boolean', 'secret'], default: 'string' },
    example: String,
    required: { type: Boolean, default: true }
  }],
  validationScript: String,
  preInstallScript: String,
  postInstallScript: String,
  version: { type: Number, default: 1 },
  validated: { type: Boolean, default: false },
  validatedAt: Date,
  validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

deploymentMapSchema.index({ edrId: 1 });

module.exports = mongoose.model('DeploymentMap', deploymentMapSchema);