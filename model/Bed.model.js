const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    required: true,
  },
  bedNumber: {
    type: Number,
    required: true,
  },
  floorNumber: {
    type: Number,
    required: true,
  },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  status: {
    type: String,
    enum: ['available', 'occupied'],
    default: 'available',
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
});

const Bed = mongoose.model('Bed', bedSchema);
module.exports = Bed;
