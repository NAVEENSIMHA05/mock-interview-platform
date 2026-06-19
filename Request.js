const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidateName: { type: String, required: true },
  companyApplied: { type: String, required: true },
  stream: { type: String, required: true },
  interestedSlot: { type: Date, required: true },
  originalSlot: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed'],
    default: 'pending'
  },
  interviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  meetLink: { type: String, default: null },
  feedback: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);