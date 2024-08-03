import mongoose from 'mongoose';
const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    required: true,
  },
  floorNumber: {
    type: Number,
    required: true,
  },
  beds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed',
  }],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  isOperational: {
    type: String,
    enum: ['operational', 'non-operational'],
    default: 'non-operational',
  },
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
