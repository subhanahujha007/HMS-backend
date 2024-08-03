import mongoose from "mongoose";
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
  status:{
type: String,
enum:['admitted','discharged'],
default:'admitted'
  },
  bed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed',
    required: true,
  },
  disease:{
type:String,
required:true
  },
  floorno:{
    type:Number,
    required:true
  },
  admissionDate: {
    type: Date,
    default: Date.now,
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
 
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
