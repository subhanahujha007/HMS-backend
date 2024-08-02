const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  bed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed',
    required: true,
  },
  admissionDate: {
    type: Date,
    default: Date.now,
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
 
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
