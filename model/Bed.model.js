import mongoose from 'mongoose'

const bedSchema = new mongoose.Schema({
  
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
  roomNumber:{
    type: Number,
    required: true,
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
});

const Bed = mongoose.model('Bed', bedSchema);
export default Bed;
