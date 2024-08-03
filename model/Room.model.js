import mongoose from 'mongoose';
import Bed from './Bed.model.js';
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
roomSchema.pre('remove', async function(next) {
  try {
    // Remove all beds associated with this room
    await Bed.deleteMany({ room: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
