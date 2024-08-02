const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    required: true,
  },
  floorNumber: {
    type: Number,
    required: true,
  },
  roomType: {
    type: String,
    enum: ['single', 'double', 'suite'],
    required: true,
  },
  beds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed',
  }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
